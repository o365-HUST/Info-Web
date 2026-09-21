"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Reorder } from "motion/react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { DOCUMENT_CATEGORIES } from "@/app/data/clubData";
import { auth, isFirebaseConfigured } from "@/app/lib/firebase";
import {
  checkIsAdmin,
  getResourcePage,
  saveResourcePage,
} from "@/app/lib/firestoreService";
import {
  deleteMediaAsset,
  uploadResourceAttachment,
} from "@/app/lib/storageService";
import type { ResourceAttachment, ResourceAttachmentType } from "@/app/types";
import TipTapEditor from "../components/TipTapEditor";
import MarkdownRenderer from "@/app/components/MarkdownRenderer";
import MediaPreview from "@/app/components/cms/MediaPreview";
import TableOfContents from "@/app/components/cms/TableOfContents";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ExternalLink,
  Eye,
  FileUp,
  GripVertical,
  Loader2,
  Trash2,
} from "lucide-react";

function detectMediaType(fileName: string): ResourceAttachmentType {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (!ext) return "other";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return "image";
  if (["mp4", "webm", "mov"].includes(ext)) return "video";
  if (ext === "pdf") return "pdf";
  if (["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext)) return "office";
  return "other";
}

function ResourceEditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") ?? "";

  const category = DOCUMENT_CATEGORIES.find((item) => item.id === slug);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveWarning, setSaveWarning] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<ResourceAttachment[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<
    { id: string; name: string; progress: number }[]
  >([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isFirebaseConfigured() || !auth) return;

    const unsub = onAuthStateChanged(auth, async (currentUser: User | null) => {
      if (!currentUser) {
        setSaveWarning(
          "Chưa đăng nhập Firebase. Nội dung chỉ lưu cục bộ trên trình duyệt cho đến khi bạn đăng nhập tại /admin.",
        );
        return;
      }

      const isAdmin = await checkIsAdmin(currentUser.uid);
      if (!isAdmin) {
        setSaveWarning(
          `Tài khoản ${currentUser.email ?? currentUser.uid} chưa có quyền quản trị trong Firestore (collection admins).`,
        );
        return;
      }

      setSaveWarning("");
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (!slug || !category) return;

    let mounted = true;
    let categoryTitle = category?.title;
    async function loadPage() {
      setIsLoading(true);
      try {
        const data = await getResourcePage(slug);
        if (!mounted) return;

        setTitle(data?.title || categoryTitle || "");
        setContent(
          data?.content ||
            `<p>Đang cập nhật nội dung cho mục <strong>${categoryTitle || ""}</strong>.</p>`,
        );
        setAttachments(data?.attachments || []);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadPage();
    return () => {
      mounted = false;
    };
  }, [slug, category]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length || !slug) return;

    const files = Array.from(event.target.files);

    for (const file of files) {
      const uploadId = Math.random().toString(36).slice(2, 9);
      setUploadingFiles((prev) => [
        ...prev,
        { id: uploadId, name: file.name, progress: 0 },
      ]);

      try {
        const { url, storagePath } = await uploadResourceAttachment(
          file,
          slug,
          (progress) => {
            setUploadingFiles((prev) =>
              prev.map((item) =>
                item.id === uploadId ? { ...item, progress } : item,
              ),
            );
          },
        );

        setAttachments((prev) => [
          ...prev,
          {
            id: uploadId,
            name: file.name,
            url,
            storagePath,
            type: detectMediaType(file.name),
            size: file.size,
          },
        ]);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Không thể tải file lên.";
        alert(`Lỗi khi tải lên file ${file.name}: ${message}`);
      } finally {
        setUploadingFiles((prev) => prev.filter((item) => item.id !== uploadId));
      }
    }

    event.target.value = "";
  };

  const handleDeleteAttachment = async (fileToDelete: ResourceAttachment) => {
    if (!confirm(`Bạn có chắc muốn xóa file ${fileToDelete.name}?`)) return;

    setAttachments((prev) => prev.filter((file) => file.id !== fileToDelete.id));

    try {
      await deleteMediaAsset(fileToDelete.url, fileToDelete.storagePath);
    } catch (error) {
      console.error("Failed to delete attachment from storage", error);
    }
  };

  const handleSave = async () => {
    if (!slug || !title.trim()) {
      alert("Vui lòng nhập tiêu đề trang trước khi lưu.");
      return;
    }

    setIsSaving(true);
    setSaveError("");
    setSaveWarning("");

    try {
      const { synced } = await saveResourcePage(slug, {
        title: title.trim(),
        content: content.trim(),
        attachments,
      });

      if (!synced) {
        setSaveWarning(
          "Đã lưu cục bộ nhưng chưa đồng bộ Firestore. Hãy đăng nhập tại /admin bằng tài khoản quản trị viên rồi lưu lại.",
        );
        setIsSaving(false);
        return;
      }

      setSaveSuccess(true);
      setTimeout(() => router.push("/admin"), 700);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Lưu tài liệu thất bại.";
      setSaveError(message);
      setIsSaving(false);
    }
  };

  if (!slug || !category) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-base font-bold text-ink mb-2">
          Không tìm thấy chuyên mục tài liệu
        </h2>
        <p className="text-xs text-ink-muted mb-4">
          Mở trang này từ tab Thư viện tài liệu trong CMS.
        </p>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ink text-surface text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Quay lại CMS
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin mb-3" />
        <h2 className="text-base font-bold text-ink">
          Đang tải trang tài liệu...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-ink flex flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5 shadow-2xs">
        <div className="max-w-[1700px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-card/80 text-xs font-semibold text-ink transition-colors shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quản trị</span>
            </Link>
            <span className="text-border hidden sm:inline">/</span>
            <div className="hidden sm:flex items-center gap-2 min-w-0">
              <span className="text-xs text-ink-muted">Tài liệu</span>
              <span className="text-border">/</span>
              <span className="text-xs font-bold text-ink truncate">
                {title || category.title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/resources/${slug}`}
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-card/80 text-xs font-semibold text-ink transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Xem trang
            </Link>
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ink text-surface hover:bg-ink/90 text-xs font-bold transition-transform active:scale-95 disabled:opacity-50"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Đã lưu
                </>
              ) : isSaving ? (
                "Đang lưu..."
              ) : (
                "Lưu trang"
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1700px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs space-y-4">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-accent mb-1">
                  {category.tag || "Tài liệu"}
                </p>
                <p className="text-xs text-ink-light">{category.description}</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                    Tiêu đề trang *
                  </label>
                  <span className="text-[10px] font-mono text-ink-muted">
                    {title.length} ký tự
                  </span>
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-[var(--bg)] text-ink text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">
                  Nội dung chi tiết
                </label>
                <TipTapEditor
                  content={content}
                  onChange={setContent}
                  uploadFolder={`resources/${slug}/inline`}
                  deferImageUpload={false}
                  placeholder="Soạn nội dung hướng dẫn, chèn tiêu đề H2/H3, danh sách, ảnh hoặc liên kết..."
                />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                  Tệp đính kèm
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-card/80 text-xs font-semibold text-ink transition-colors"
                >
                  <FileUp className="w-3.5 h-3.5 text-accent" />
                  Thêm file
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {uploadingFiles.length > 0 && (
                <div className="mb-4 space-y-2">
                  {uploadingFiles.map((file) => (
                    <div
                      key={file.id}
                      className="rounded-xl border border-border bg-card p-3"
                    >
                      <div className="flex justify-between text-xs mb-1">
                        <span className="truncate font-medium text-ink">
                          {file.name}
                        </span>
                        <span className="text-ink-muted">
                          {Math.round(file.progress)}%
                        </span>
                      </div>
                      <div className="w-full bg-[var(--bg)] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-accent h-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {attachments.length > 0 ? (
                <Reorder.Group
                  axis="y"
                  values={attachments}
                  onReorder={setAttachments}
                  className="space-y-2"
                >
                  {attachments.map((file) => (
                    <Reorder.Item
                      key={file.id}
                      value={file}
                      className="flex items-center justify-between rounded-xl border border-border bg-card p-3"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <GripVertical className="w-4 h-4 text-ink-muted shrink-0" />
                        <span className="text-sm font-medium text-ink truncate">
                          {file.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg)] text-ink-muted uppercase font-bold">
                          {file.type}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteAttachment(file)}
                        className="p-1.5 rounded-lg text-ink-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Xóa tệp"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-border rounded-xl text-xs text-ink-muted">
                  Chưa có tệp đính kèm.
                </div>
              )}
            </div>

            {saveWarning && (
              <p className="text-xs text-amber-700 font-medium rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
                {saveWarning}
              </p>
            )}

            {saveError && (
              <p className="text-xs text-red-600 font-medium">{saveError}</p>
            )}

            <div className="p-4 rounded-2xl border border-border bg-surface flex items-center justify-between gap-3 shadow-xs">
              <Link
                href="/admin"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-ink-muted hover:text-ink hover:bg-card transition-colors"
              >
                Hủy &amp; Quay lại
              </Link>
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSave}
                className="px-5 py-2 rounded-xl bg-ink text-surface hover:bg-ink/90 text-xs font-bold disabled:opacity-50"
              >
                {isSaving ? "Đang lưu..." : "Lưu trang"}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 sticky top-20 space-y-4 self-start">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-surface border border-border shadow-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-extrabold text-ink uppercase tracking-wider">
                  Xem trước trang tài liệu
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-card border border-border text-xs font-semibold text-ink-light">
                <Eye className="w-3.5 h-3.5 text-accent" />
                Trang tài liệu
              </span>
            </div>

            <div className="rounded-3xl border border-border bg-[var(--bg)] shadow-card overflow-hidden max-h-[calc(100vh-140px)] overflow-y-auto">
              <div className="p-6 sm:p-10">
                <Link
                  href="/resources"
                  className="inline-flex items-center gap-2 text-ink-light hover:text-accent transition-colors font-medium text-sm mb-6"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Quay lại Thư viện
                </Link>

                <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-ink tracking-tight mb-8">
                  {title.trim() || category.title}
                </h1>

                <div id="resource-preview-content" className="flex flex-col lg:flex-row gap-10">
                  <div className="flex-1 min-w-0">
                    <div className="mb-8 max-w-none">
                      {content.trim() ? (
                        <MarkdownRenderer content={content} />
                      ) : (
                        <p className="text-sm text-ink-muted italic m-0">
                          Nội dung sẽ hiển thị ở đây...
                        </p>
                      )}
                    </div>

                    {attachments.length > 0 && (
                      <div className="mt-12 pt-8 border-t border-border">
                        <h3 className="font-display text-xl font-bold text-ink mb-6">
                          Tài liệu đính kèm
                        </h3>
                        <div className="space-y-8">
                          {attachments.map((file) => (
                            <MediaPreview key={file.id} file={file} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <aside className="w-full lg:w-64 shrink-0 hidden md:block">
                    <TableOfContents selector="#resource-preview-content" />
                  </aside>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ResourceEditorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-6">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      }
    >
      <ResourceEditorContent />
    </Suspense>
  );
}

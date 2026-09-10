/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  getPostById,
  createPost,
  updatePost,
} from "@/app/lib/firestoreService";
import { uploadMediaAsset, deleteMediaAsset } from "@/app/lib/storageService";
import type { BlogPost } from "@/app/types";
import TipTapEditor from "../components/TipTapEditor";
import MarkdownRenderer from "@/app/components/MarkdownRenderer";
import {
  ArrowLeft,
  Upload,
  X,
  Calendar,
  Clock,
  Share2,
  Check,
  Eye,
  LayoutGrid,
  Sparkles,
  Loader2,
  Globe,
  ImageIcon,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  RefreshCw,
} from "lucide-react";

const CATEGORIES = [
  "Devlog",
  "Cuộc thi",
  "Hành trình",
  "Workshop",
  "Kỹ năng số",
  "Thông báo",
];
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import { useState, useEffect, Suspense, useMemo, useRef } from "react";

function ImageEditorModal({
  file,
  onSave,
  onCancel,
}: {
  file: File;
  onSave: (file: File, url: string) => void;
  onCancel: () => void;
}) {
  const imageRef = useRef<HTMLImageElement>(null);
  const cropperRef = useRef<Cropper | null>(null);

  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [sepia, setSepia] = useState(0);

  useEffect(() => {
    if (imageRef.current) {
      const url = URL.createObjectURL(file);
      imageRef.current.src = url;

      cropperRef.current = new Cropper(imageRef.current, {
        viewMode: 2,
        dragMode: "crop",
        aspectRatio: 16 / 9,
        autoCropArea: 1,
        cropBoxMovable: true,
        cropBoxResizable: true,
        guides: true,
        ready: function () {
          const cropper = cropperRef.current;
          if (cropper) {
            cropper.zoomTo(0);
          }
        },
      });

      return () => {
        cropperRef.current?.destroy();
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  const filterStyle = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${sepia}%)`;

  const handleAction = (action: string, param?: number) => {
    const cropper = cropperRef.current;
    if (!cropper) return;

    if (action === "rotate") {
      cropper.rotate(param || 90);

      cropper.zoomTo(0);
    }
    if (action === "flip-x") {
      cropper.scaleX(cropper.getImageData().scaleX === 1 ? -1 : 1);
    }
    if (action === "reset") {
      cropper.reset();
    }
  };

  const handleExport = () => {
    const cropper = cropperRef.current;
    if (!cropper) return;

    const sourceCanvas = cropper.getCroppedCanvas({ fillColor: "#fff" });
    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = sourceCanvas.width;
    finalCanvas.height = sourceCanvas.height;
    const ctx = finalCanvas.getContext("2d");
    if (!ctx) return;

    ctx.filter = filterStyle;
    ctx.drawImage(sourceCanvas, 0, 0);
    ctx.filter = "none";

    finalCanvas.toBlob(
      (blob) => {
        if (blob) {
          const editedFile = new File([blob], file.name, {
            type: "image/jpeg",
          });
          const localBlobUrl = URL.createObjectURL(editedFile);
          onSave(editedFile, localBlobUrl);
        }
      },
      "image/jpeg",
      0.9,
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8">
      <div className="bg-surface w-full max-w-5xl h-[85vh] rounded-3xl flex flex-col overflow-hidden border border-border shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b border-border bg-card">
          <h2 className="text-sm font-bold text-ink uppercase tracking-wider">
            Chỉnh sửa ảnh bìa
          </h2>
          <button
            onClick={onCancel}
            className="text-ink-muted hover:text-red-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Vùng Canvas */}
          <div className="flex-1 bg-card/50 p-4 flex items-center justify-center overflow-hidden">
            <div
              className="w-full h-[400px] sm:h-[500px]"
              style={{ filter: filterStyle }}
            >
              <img ref={imageRef} className="max-w-full block" alt="Source" />
            </div>
          </div>

          {/* Cột điều khiển */}
          <div className="w-full md:w-80 bg-surface border-l border-border p-5 overflow-y-auto space-y-6">
            {/* Cắt & Xoay */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-ink-muted uppercase">
                Xoay & Lật
              </h3>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => handleAction("rotate", -90)}
                  className="flex items-center justify-center p-2.5 border border-border bg-card hover:bg-surface rounded-xl transition-colors text-ink-muted hover:text-ink shadow-sm"
                  title="Xoay trái -90°"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleAction("rotate", 90)}
                  className="flex items-center justify-center p-2.5 border border-border bg-card hover:bg-surface rounded-xl transition-colors text-ink-muted hover:text-ink shadow-sm"
                  title="Xoay phải +90°"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleAction("flip-x")}
                  className="flex items-center justify-center p-2.5 border border-border bg-card hover:bg-surface rounded-xl transition-colors text-ink-muted hover:text-ink shadow-sm"
                  title="Lật ngang"
                >
                  <FlipHorizontal className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleAction("reset")}
                  className="flex items-center justify-center p-2.5 border border-border bg-card hover:bg-surface rounded-xl transition-colors text-ink-muted hover:text-red-500 shadow-sm"
                  title="Khôi phục gốc"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Màu sắc */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-ink-muted uppercase">
                Màu sắc
              </h3>
              <div>
                <label className="text-[11px] font-semibold">
                  Độ sáng ({brightness}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-accent"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold">
                  Tương phản ({contrast}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-accent"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold">
                  Bão hòa ({saturation}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={saturation}
                  onChange={(e) => setSaturation(Number(e.target.value))}
                  className="w-full accent-accent"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold">
                  Sepia ({sepia}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sepia}
                  onChange={(e) => setSepia(Number(e.target.value))}
                  className="w-full accent-accent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-card flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-ink border border-border hover:bg-surface"
          >
            Hủy
          </button>
          <button
            onClick={handleExport}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-ink text-surface hover:bg-ink/90"
          >
            Áp dụng & Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
function PostEditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");

  const [isLoadingPost, setIsLoadingPost] = useState(Boolean(postId));
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("Devlog");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return `${String(today.getDate()).padStart(2, "0")}/${String(
      today.getMonth() + 1,
    ).padStart(2, "0")}/${today.getFullYear()}`;
  });
  const [author, setAuthor] = useState("CLB o365 - HUST");
  const [thumbnail, setThumbnail] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(true);

  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState("");

  const [rawFileForEditor, setRawFileForEditor] = useState<File | null>(null);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");

  const [previewMode, setPreviewMode] = useState<"article" | "card">("article");

  useEffect(() => {
    if (!postId) return;

    let isMounted = true;
    async function loadPost() {
      setIsLoadingPost(true);
      try {
        const found = await getPostById(postId as string);
        if (found && isMounted) {
          setTitle(found.title);
          setTag(found.tag || "Devlog");
          setDate(found.date);
          setAuthor(found.author || "CLB o365 - HUST");
          setThumbnail(found.thumbnail || "");
          setExcerpt(found.excerpt);
          setContent(found.content || found.excerpt);
          setPublished(found.published !== false);
        }
      } finally {
        if (isMounted) setIsLoadingPost(false);
      }
    }

    loadPost();
    return () => {
      isMounted = false;
    };
  }, [postId]);

  const handleCoverFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Chỉ hỗ trợ tệp hình ảnh (PNG, JPG, WEBP, GIF, v.v.).");
      return;
    }

    setUploadError("");

    setRawFileForEditor(file);
    setShowImageEditor(true);

    e.target.value = "";
  };

  const handleClearSelectedCover = () => {
    if (coverPreviewUrl && coverPreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreviewUrl);
    }
    setSelectedCoverFile(null);
    setCoverPreviewUrl("");
    setThumbnail("");
  };

  const readTimeMinutes = useMemo(() => {
    const textToCount = content ? content.replace(/<[^>]*>/g, " ") : excerpt;
    return Math.max(1, Math.ceil(textToCount.trim().split(/\s+/).length / 180));
  }, [content, excerpt]);

  const handleSave = async (overridePublished?: boolean) => {
    if (!title.trim() || !excerpt.trim()) {
      alert("Vui lòng điền Tiêu đề và Tóm tắt bài viết trước khi lưu.");
      return;
    }

    setIsSaving(true);
    setUploadError("");

    try {
      let finalThumbnail = thumbnail.trim() || "/assets/blog/blog-devlog.jpg";

      if (selectedCoverFile) {
        setUploadProgress(0);
        finalThumbnail = await uploadMediaAsset(
          selectedCoverFile,
          "blog",
          (progress) => {
            setUploadProgress(progress);
          },
        );

        if (
          thumbnail &&
          thumbnail !== finalThumbnail &&
          thumbnail.includes("firebasestorage.googleapis.com")
        ) {
          await deleteMediaAsset(thumbnail);
        }
      }

      const isPublic =
        overridePublished !== undefined ? overridePublished : published;

      const postData: Omit<BlogPost, "id"> = {
        title: title.trim(),
        tag,
        date: date.trim() || "01/01/2026",
        author: author.trim() || "CLB o365 - HUST",
        thumbnail: finalThumbnail,
        excerpt: excerpt.trim(),
        content: content.trim() || excerpt.trim(),
        url: "#",
        published: isPublic,
      };

      if (postId) {
        await updatePost(postId, postData);
      } else {
        await createPost(postData);
      }

      setSaveSuccess(true);
      setTimeout(() => {
        router.push("/admin");
      }, 700);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Lưu bài viết thất bại.";
      setUploadError(message);
      setIsSaving(false);
    }
  };

  const handleInsertTag = (hashtag: string) => {
    setContent((prev) => `${prev} <p><strong>${hashtag}</strong></p>`);
  };

  if (isLoadingPost) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin mb-3" />
        <h2 className="text-base font-bold text-ink">
          Đang tải dữ liệu bài viết...
        </h2>
        <p className="text-xs text-ink-muted mt-1">
          Vui lòng chờ trong giây lát
        </p>
      </div>
    );
  }

  const activeCoverUrl = coverPreviewUrl || thumbnail;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-ink flex flex-col">
      {showImageEditor && rawFileForEditor && (
        <ImageEditorModal
          file={rawFileForEditor}
          onCancel={() => {
            setShowImageEditor(false);
            setRawFileForEditor(null);
          }}
          onSave={(editedFile, blobUrl) => {
            setSelectedCoverFile(editedFile);

            if (coverPreviewUrl && coverPreviewUrl.startsWith("blob:")) {
              URL.revokeObjectURL(coverPreviewUrl);
            }

            setCoverPreviewUrl(blobUrl);
            setShowImageEditor(false);
            setRawFileForEditor(null);
          }}
        />
      )}

      <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5 shadow-2xs">
        <div className="max-w-[1700px] mx-auto flex items-center justify-between gap-4">
          {/* Breadcrumb & Back */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-card/80 text-xs font-semibold text-ink transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quản trị</span>
            </Link>

            <span className="text-border">/</span>

            <div className="flex items-center gap-2">
              <span className="text-xs text-ink-muted">Bài viết</span>
              <span className="text-border">/</span>
              <span className="text-xs font-bold text-ink truncate max-w-xs sm:max-w-md">
                {postId
                  ? `Chỉnh sửa: ${title || "Bài viết"}`
                  : "Tạo bài viết mới"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <span
              className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                published
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                  : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  published ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
              {published ? "Công khai" : "Bản nháp"}
            </span>

            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSave(false)}
              className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-card/80 text-ink text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              Lưu bản nháp
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSave(true)}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-ink text-surface hover:bg-ink/90 text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Đã lưu!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  <span>
                    {postId ? "Cập nhật bài viết" : "Xuất bản bài viết"}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ─── SIDE-BY-SIDE SPLIT WORKSPACE ─── */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* ══════════════════════════════════════════ */}
          {/* LEFT COLUMN: CREATOR CONTROLS (META STYLE) */}
          {/* ══════════════════════════════════════════ */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-5">
            {/* Card 1: Post To */}
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-ink-muted mb-3">
                Post to / Đăng lên
              </h3>

              <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/30 to-accent/10 border border-border flex items-center justify-center font-bold text-ink text-sm shadow-2xs">
                    o365
                  </div>
                  <div>
                    <div className="text-sm font-bold text-ink">
                      CLB o365 - HUST
                    </div>
                    <div className="text-[11px] text-ink-muted flex items-center gap-1">
                      <Globe className="w-3 h-3 text-accent" />
                      <span>Đại sứ Chuyển đổi số ĐHBK Hà Nội</span>
                    </div>
                  </div>
                </div>

                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-surface text-ink border border-border">
                  Offical
                </span>
              </div>

              {/* Tag & Date Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-ink uppercase tracking-wider text-[11px] mb-1.5">
                    Chuyên mục (Tag) *
                  </label>
                  <select
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-ink text-xs focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent font-medium cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-ink uppercase tracking-wider text-[11px] mb-1.5">
                    Ngày đăng bài
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="DD/MM/YYYY"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-ink text-xs focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent font-mono"
                  ></input>
                </div>
              </div>
            </div>

            {/* Card 2: Media (Cover Image) */}
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-ink-muted">
                    Media / Ảnh bìa
                  </h3>
                  <p className="text-xs text-ink-light mt-0.5">
                    Ảnh bìa nổi bật hiển thị ở đầu bài viết và trên toàn bộ hệ
                    thống
                  </p>
                </div>
              </div>

              {/* Media Action Button */}
              <div className="mt-3">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card hover:bg-card/80 text-xs font-semibold text-ink transition-colors shadow-2xs">
                  <Upload className="w-3.5 h-3.5 text-accent" />
                  <span>
                    {selectedCoverFile
                      ? "Đổi ảnh từ máy..."
                      : "Add photo / Chọn ảnh từ máy"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isSaving}
                    onChange={handleCoverFileSelect}
                    className="hidden"
                  />
                </label>

                {/* Direct URL input */}
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="text"
                    value={
                      selectedCoverFile
                        ? `[Tệp cục bộ]: ${selectedCoverFile.name}`
                        : thumbnail
                    }
                    onChange={(e) => {
                      if (!selectedCoverFile) setThumbnail(e.target.value);
                    }}
                    readOnly={Boolean(selectedCoverFile)}
                    placeholder="Hoặc dán trực tiếp đường dẫn URL ảnh..."
                    className="flex-1 px-3 py-2 rounded-xl border border-border bg-surface text-ink text-xs focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                  />

                  {activeCoverUrl && (
                    <button
                      type="button"
                      onClick={handleClearSelectedCover}
                      className="p-2 rounded-xl text-ink-muted hover:text-red-600 hover:bg-red-50 border border-border transition-colors cursor-pointer"
                      title="Xóa ảnh"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Cover preview pill */}
                {activeCoverUrl && (
                  <div className="mt-3 flex items-center gap-3 p-2.5 rounded-xl bg-card border border-border">
                    <img
                      src={activeCoverUrl}
                      alt="Thumbnail preview"
                      className="w-14 h-10 object-cover rounded-lg border border-border shrink-0"
                    />
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="font-semibold text-ink truncate">
                        {selectedCoverFile
                          ? selectedCoverFile.name
                          : "Ảnh bìa đã chọn"}
                      </p>
                      <p className="text-[11px] text-ink-muted">
                        {selectedCoverFile
                          ? `${(selectedCoverFile.size / 1024).toFixed(1)} KB (sẽ tải lên khi lưu)`
                          : "Đã thiết lập URL ảnh"}
                      </p>
                    </div>
                  </div>
                )}

                {/* Upload Progress Bar */}
                {isSaving && selectedCoverFile && (
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-ink-muted">
                      <span>Đang tải ảnh lên Firebase Storage...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-card rounded-full h-1.5 overflow-hidden border border-border">
                      <div
                        className="bg-accent h-full transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {uploadError && (
                  <p className="mt-2 text-xs text-red-600 font-medium">
                    {uploadError}
                  </p>
                )}
              </div>
            </div>

            {/* Card 3: Post Details */}
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/80">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-ink-muted">
                  Post details / Chi tiết bài viết
                </h3>

                {/* Publish Toggle */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-accent focus:ring-accent border-border"
                  />
                  <span className="text-xs font-semibold text-ink">
                    {published ? "Công khai (Published)" : "Bản nháp (Draft)"}
                  </span>
                </label>
              </div>

              {/* Title Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                    Tiêu đề bài viết *
                  </label>
                  <span className="text-[10px] font-mono text-ink-muted">
                    {title.length} ký tự
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="VD: Devlog: Hành trình xây dựng hệ sinh thái số cho sinh viên"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm font-semibold placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                />
              </div>

              {/* Excerpt Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                    Tóm tắt ngắn (Excerpt) *
                  </label>
                  <span className="text-[10px] font-mono text-ink-muted">
                    {excerpt.length} ký tự
                  </span>
                </div>
                <textarea
                  required
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="1 đến 2 câu tóm lược súc tích, hiển thị ở đầu bài viết và trên thẻ tin tức..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-xs focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent resize-none leading-relaxed"
                />
              </div>

              {/* Rich Content Editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                    Text / Nội dung chi tiết
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleInsertTag("#o365HUST")}
                      className="px-2 py-0.5 rounded-md bg-card text-ink text-[10px] font-mono font-bold hover:bg-card/80 border border-border transition-colors cursor-pointer"
                    >
                      #o365HUST
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertTag("#ChuyenDoiSo")}
                      className="px-2 py-0.5 rounded-md bg-card text-ink text-[10px] font-mono font-bold hover:bg-card/80 border border-border transition-colors cursor-pointer"
                    >
                      #ChuyenDoiSo
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertTag("#BachKhoa")}
                      className="px-2 py-0.5 rounded-md bg-card text-ink text-[10px] font-mono font-bold hover:bg-card/80 border border-border transition-colors cursor-pointer"
                    >
                      #BachKhoa
                    </button>
                  </div>
                </div>

                <TipTapEditor
                  content={content}
                  onChange={setContent}
                  placeholder="Viết nội dung bài viết... Bạn có thể bôi đậm, chèn tiêu đề H2/H3, danh sách, trích dẫn hoặc tải ảnh trực tiếp."
                />
              </div>
            </div>

            {/* Bottom Form Actions */}
            <div className="p-4 rounded-2xl border border-border bg-surface flex items-center justify-between gap-3 shadow-xs">
              <Link
                href="/admin"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-ink-muted hover:text-ink hover:bg-card transition-colors"
              >
                Hủy &amp; Quay lại
              </Link>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleSave(false)}
                  className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-card/80 text-ink text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  Lưu bản nháp
                </button>

                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleSave(true)}
                  className="px-5 py-2 rounded-xl bg-ink text-surface hover:bg-ink/90 text-xs font-bold transition-transform active:scale-95 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? "Đang lưu..." : postId ? "Cập nhật" : "Xuất bản"}
                </button>
              </div>
            </div>
          </div>

          {/* ═════════════════════════════════════════════════ */}
          {/* RIGHT COLUMN: REAL WEBSITE POST PREVIEW           */}
          {/* ═════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 xl:col-span-7 sticky top-20 space-y-4">
            {/* Preview Toolbar */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-surface border border-border shadow-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-extrabold text-ink uppercase tracking-wider">
                  Live Preview / Xem trước website
                </span>
              </div>

              {/* View Switcher: Single Article vs Card */}
              <div className="flex items-center p-1 rounded-xl bg-card border border-border">
                <button
                  type="button"
                  onClick={() => setPreviewMode("article")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    previewMode === "article"
                      ? "bg-surface text-ink shadow-xs"
                      : "text-ink-muted hover:text-ink"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-accent" />
                  <span>Trang bài viết</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewMode("card")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    previewMode === "card"
                      ? "bg-surface text-ink shadow-xs"
                      : "text-ink-muted hover:text-ink"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-accent" />
                  <span>Thẻ danh sách</span>
                </button>
              </div>
            </div>

            {/* Preview Viewport Container */}
            <div className="rounded-3xl border border-border bg-surface shadow-card overflow-hidden max-h-[calc(100vh-140px)] overflow-y-auto">
              {previewMode === "article" ? (
                /* ─── REAL WEBSITE ARTICLE PAGE VIEW ─── */
                <article className="p-6 sm:p-10 max-w-3xl mx-auto">
                  {/* Breadcrumbs */}
                  <nav className="flex items-center gap-2 text-xs text-ink-muted mb-6">
                    <span>Trang chủ</span>
                    <span>/</span>
                    <span>Bài viết</span>
                    <span>/</span>
                    <span className="text-ink font-semibold truncate">
                      {tag || "Chuyên mục"}
                    </span>
                  </nav>

                  {/* Tag, Date, Read Time Row */}
                  <div className="flex flex-wrap items-center gap-2.5 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-card text-ink border border-border shadow-2xs">
                      {tag || "Chuyên mục"}
                    </span>
                    <span className="text-xs text-ink-muted flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3 text-ink-light" />
                      {date || "Hôm nay"}
                    </span>
                    <span className="text-xs text-ink-muted">•</span>
                    <span className="text-xs text-ink-muted flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-ink-light" />
                      {readTimeMinutes} phút đọc
                    </span>
                  </div>

                  {/* Article Title */}
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink leading-tight tracking-tight mb-6">
                    {title.trim() || (
                      <span className="text-ink-muted/50 italic">
                        Tiêu đề bài viết sẽ hiển thị ở đây...
                      </span>
                    )}
                  </h1>

                  {/* Author Bar */}
                  <div className="flex items-center justify-between py-4 border-y border-border/80 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/20 border border-border flex items-center justify-center text-ink font-bold text-sm">
                        {author ? author.charAt(0).toUpperCase() : "O"}
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-ink">
                          {author || "CLB o365 - HUST"}
                        </div>
                        <div className="text-[11px] text-ink-muted">
                          Đại sứ Chuyển đổi số ĐHBK Hà Nội
                        </div>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-ink-light">
                      <Share2 className="w-3.5 h-3.5 text-accent" />
                      <span>Chia sẻ</span>
                    </div>
                  </div>

                  {/* Cover Image Hero or Dashed Placeholder */}
                  <div className="mb-8">
                    {activeCoverUrl ? (
                      <div className="aspect-[16/9] sm:aspect-[16/9] relative rounded-3xl overflow-hidden bg-card border border-border shadow-card">
                        <img
                          src={activeCoverUrl}
                          alt={title || "Cover preview"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      /* Dashed Placeholder Matching User Reference */
                      <div className="aspect-[16/9] sm:aspect-[16/9] rounded-3xl border-2 border-dashed border-border/80 bg-card/40 flex flex-col items-center justify-center p-6 text-center group">
                        <div className="w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center text-ink-muted mb-3 shadow-2xs">
                          <ImageIcon className="w-7 h-7 text-ink-muted/60" />
                        </div>
                        <p className="text-xs font-bold text-ink mb-1">
                          Chưa có ảnh bìa bài viết
                        </p>
                        <p className="text-[11px] text-ink-muted max-w-xs">
                          Bấm &quot;Add photo / Chọn ảnh từ máy&quot; ở bảng
                          điều khiển bên trái để tải ảnh lên.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Excerpt Callout Box */}
                  {excerpt.trim() && (
                    <div className="p-6 rounded-2xl bg-card/60 border border-border/70 text-ink text-sm sm:text-base leading-relaxed font-medium mb-8 shadow-2xs">
                      {excerpt}
                    </div>
                  )}

                  {/* Formatted Body Content */}
                  <div className="py-2 min-h-[140px]">
                    {content.trim() ? (
                      <MarkdownRenderer content={content} />
                    ) : (
                      <div className="py-10 text-center border-2 border-dashed border-border/60 rounded-2xl text-xs text-ink-muted">
                        Bắt đầu soạn thảo nội dung ở cột bên trái để xem trước
                        định dạng bài viết thực tế...
                      </div>
                    )}
                  </div>
                </article>
              ) : (
                /* ─── REAL WEBSITE CARD GRID VIEW ─── */
                <div className="p-8 max-w-md mx-auto">
                  <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-4 text-center">
                    Xem trước trên danh sách tin tức (/blog &amp; Trang chủ)
                  </p>

                  <div className="rounded-2xl bg-surface border border-border p-5 shadow-card group">
                    {/* Thumbnail */}
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-card mb-4 border border-border">
                      {activeCoverUrl ? (
                        <img
                          src={activeCoverUrl}
                          alt={title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-card/50 text-ink-muted">
                          <ImageIcon className="w-8 h-8 opacity-40 mb-1" />
                          <span className="text-[10px]">Chưa có ảnh bìa</span>
                        </div>
                      )}

                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-surface/90 backdrop-blur-xs text-ink border border-border">
                        {tag}
                      </span>
                      <span
                        className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          published
                            ? "bg-emerald-500/90 text-surface"
                            : "bg-amber-500/90 text-surface"
                        }`}
                      >
                        {published ? "Xuất bản" : "Bản nháp"}
                      </span>
                    </div>

                    <div className="text-[11px] text-ink-muted font-mono mb-1">
                      {date || "Hôm nay"} • {author || "o365"}
                    </div>

                    <h3 className="font-bold text-base text-ink tracking-tight line-clamp-2 mb-2">
                      {title || "Tiêu đề bài viết..."}
                    </h3>

                    <p className="text-xs text-ink-light leading-relaxed line-clamp-3 mb-4">
                      {excerpt ||
                        "Tóm tắt ngắn gọn nội dung bài viết sẽ hiển thị tại đây..."}
                    </p>

                    <div className="pt-3 border-t border-border/70 flex items-center justify-between text-[11px] text-ink-muted font-mono">
                      <span>Đọc tiếp →</span>
                      <span>{readTimeMinutes} phút đọc</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PostEditorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-6">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      }
    >
      <PostEditorContent />
    </Suspense>
  );
}

"use client";

import { useState, useEffect } from "react";
import type { BlogPost } from "@/app/types";
import { X, Image as ImageIcon, Sparkles, Check, Globe, Upload, Loader2 } from "lucide-react";
import { uploadMediaAsset, deleteMediaAsset } from "@/app/lib/storageService";
import TipTapEditor from "./TipTapEditor";

interface PostEditorModalProps {
  post: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (postData: Omit<BlogPost, "id">, id?: string) => Promise<void>;
}

const CATEGORIES = [
  "Devlog",
  "Cuộc thi",
  "Hành trình",
  "Workshop",
  "Kỹ năng số",
  "Thông báo",
];

export default function PostEditorModal({
  post,
  isOpen,
  onClose,
  onSave,
}: PostEditorModalProps) {
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("Devlog");
  const [date, setDate] = useState("");
  const [author, setAuthor] = useState("CLB o365 - HUST");
  const [thumbnail, setThumbnail] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("#");
  const [published, setPublished] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Deferred cover upload state: 0 network bytes until user clicks "Lưu/Tạo bài viết"
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");

  const handleCoverFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Chỉ hỗ trợ tệp hình ảnh (PNG, JPG, WEBP, GIF, v.v.).");
      return;
    }

    setUploadError("");
    setSelectedCoverFile(file);

    // Instant local preview without sending any bytes to storage yet!
    if (coverPreviewUrl && coverPreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreviewUrl);
    }
    const localBlobUrl = URL.createObjectURL(file);
    setCoverPreviewUrl(localBlobUrl);
  };

  const handleClearSelectedCover = () => {
    if (coverPreviewUrl && coverPreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreviewUrl);
    }
    setSelectedCoverFile(null);
    setCoverPreviewUrl("");
    setThumbnail(post?.thumbnail || "/assets/blog/blog-devlog.jpg");
  };

  useEffect(() => {
    // Revoke any previous local object URL on modal close or post change
    if (coverPreviewUrl && coverPreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreviewUrl);
    }
    setSelectedCoverFile(null);
    setCoverPreviewUrl("");
    setUploadError("");
    setUploadProgress(0);

    if (post) {
      setTitle(post.title);
      setTag(post.tag || "Devlog");
      setDate(post.date);
      setAuthor(post.author || "CLB o365 - HUST");
      setThumbnail(post.thumbnail || "");
      setExcerpt(post.excerpt);
      setContent(post.content || post.excerpt);
      setUrl(post.url || "#");
      setPublished(post.published ?? true);
    } else {
      // Default new post values
      const today = new Date();
      const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(
        today.getMonth() + 1
      ).padStart(2, "0")}/${today.getFullYear()}`;
      setTitle("");
      setTag("Devlog");
      setDate(formattedDate);
      setAuthor("CLB o365 - HUST");
      setThumbnail("/assets/blog/blog-devlog.jpg");
      setExcerpt("");
      setContent("");
      setUrl("#");
      setPublished(true);
    }
  }, [post, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim()) return;

    setIsSaving(true);
    setUploadError("");

    try {
      let finalThumbnail = thumbnail.trim() || "/assets/blog/blog-devlog.jpg";

      // DEFERRED UPLOAD: Only upload to Firebase Storage when the post is actually confirmed!
      if (selectedCoverFile) {
        setUploadProgress(0);
        finalThumbnail = await uploadMediaAsset(selectedCoverFile, "blog", (progress) => {
          setUploadProgress(progress);
        });

        // If editing an existing post and replacing an old Firebase image, clean up the old file
        if (
          post?.thumbnail &&
          post.thumbnail !== finalThumbnail &&
          post.thumbnail.includes("firebasestorage.googleapis.com")
        ) {
          await deleteMediaAsset(post.thumbnail);
        }
      }

      await onSave(
        {
          title: title.trim(),
          tag,
          date,
          author,
          thumbnail: finalThumbnail,
          excerpt: excerpt.trim(),
          content: content.trim() || excerpt.trim(),
          url: url.trim() || "#",
          published,
        },
        post?.id
      );
      onClose();
    } catch (err: any) {
      setUploadError(err.message || "Lưu bài viết thất bại.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/30 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl lg:max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-surface border border-border shadow-xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center text-ink">
              <Sparkles className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h3 className="font-bold text-base text-ink">
                {post ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
              </h3>
              <p className="text-xs text-ink-muted">
                Đồng bộ trực tiếp với cơ sở dữ liệu Firestore
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-ink-muted hover:text-ink hover:bg-card flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-4 text-sm"
        >
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
              Tiêu đề bài viết *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Devlog: Hành trình xây dựng hệ sinh thái số cho sinh viên"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-ink placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent text-sm"
            />
          </div>

          {/* Category & Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Chuyên mục
              </label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Ngày đăng
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="DD/MM/YYYY"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
              />
            </div>
          </div>

          {/* Cover Image URL with deferred upload option and preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider">
                Ảnh bìa bài viết (Cover Image)
              </label>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-surface hover:bg-card text-xs font-medium text-ink transition-colors shadow-2xs">
                <Upload className="w-3.5 h-3.5 text-accent" />
                <span>{selectedCoverFile ? "Đổi ảnh khác" : "Chọn ảnh từ máy"}</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={isSaving}
                  onChange={handleCoverFileSelect}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-2">
              <div className="flex gap-3 items-center">
                <input
                  type="text"
                  value={
                    selectedCoverFile
                      ? `[Tệp cục bộ]: ${selectedCoverFile.name} (sẽ tải lên khi lưu)`
                      : thumbnail
                  }
                  onChange={(e) => {
                    if (!selectedCoverFile) {
                      setThumbnail(e.target.value);
                    }
                  }}
                  readOnly={Boolean(selectedCoverFile)}
                  placeholder="Dán URL ảnh hoặc bấm 'Chọn ảnh từ máy' ở trên"
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                />

                {selectedCoverFile && (
                  <button
                    type="button"
                    onClick={handleClearSelectedCover}
                    className="p-2 rounded-xl text-ink-muted hover:text-red-600 hover:bg-red-50 border border-border transition-colors text-xs cursor-pointer"
                    title="Hủy chọn ảnh này"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {(coverPreviewUrl || thumbnail) && (
                  <div className="w-10 h-10 rounded-lg border border-border overflow-hidden shrink-0 relative bg-card flex items-center justify-center">
                    <img
                      src={coverPreviewUrl || thumbnail}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/150?text=o365";
                      }}
                    />
                  </div>
                )}
              </div>

              {isSaving && selectedCoverFile && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-ink-muted">
                    <span>Đang tải ảnh bìa lên Firebase Storage...</span>
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
                <p className="text-xs text-red-600 font-medium">
                  {uploadError}
                </p>
              )}
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
              Tóm tắt ngắn (Hiển thị ngoài trang chủ) *
            </label>
            <textarea
              required
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="1 đến 2 câu mô tả ngắn gọn nội dung bài viết..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent resize-none"
            />
          </div>

          {/* Full Content TipTap WYSIWYG Editor */}
          <div>
            <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-2">
              Nội dung chi tiết bài viết (WYSIWYG Rich Editor)
            </label>
            <TipTapEditor
              content={content}
              onChange={setContent}
              placeholder="Bắt đầu viết nội dung bài viết... Bạn có thể định dạng in đậm, tiêu đề, danh sách hoặc chèn ảnh trực quan như Microsoft Word."
            />
          </div>

          {/* Publishing Status Toggle */}
          <div className="pt-2 flex items-center justify-between border-t border-border/70">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="publishedCheckbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 rounded text-accent focus:ring-accent border-border"
              />
              <label
                htmlFor="publishedCheckbox"
                className="text-xs font-medium text-ink cursor-pointer"
              >
                Hiển thị công khai trên website (Published)
              </label>
            </div>

            <span className="text-xs text-ink-muted font-mono">
              {published ? "Trạng thái: Xuất bản" : "Trạng thái: Bản nháp"}
            </span>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-border/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-ink-light hover:text-ink hover:bg-card transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-ink text-surface text-xs font-semibold hover:bg-ink/90 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSaving ? "Đang lưu..." : post ? "Cập nhật" : "Tạo bài viết"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

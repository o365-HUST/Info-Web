"use client";

import { useState, useEffect, useRef } from "react";
import type { Milestone, MilestoneType, BlogPost } from "@/app/types";
import { uploadMediaAsset } from "@/app/lib/storageService";
import {
  X,
  Check,
  Flag,
  Trophy,
  GraduationCap,
  ImagePlus,
  Loader2,
  Trash2,
  Image,
  Link2,
  Link2Off,
} from "lucide-react";

interface MilestoneEditorModalProps {
  milestone: Milestone | null;
  posts: BlogPost[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Milestone, "id">, id?: string) => Promise<void>;
}

const TYPE_OPTIONS: Array<{
  id: MilestoneType;
  label: string;
  Icon: typeof Flag;
}> = [
  { id: "moc", label: "Cột mốc", Icon: Flag },
  { id: "thanh_tich", label: "Thành tích", Icon: Trophy },
  { id: "alumni", label: "Cựu thành viên", Icon: GraduationCap },
  { id: "photo", label: "Khung ảnh", Icon: Image },
];

const pad2 = (n: string | number) => String(n).padStart(2, "0");

/** Best-effort sortable key from a display label like "08/2023" or "02/05/2024". */
function deriveSortKey(label: string): string {
  const s = label.trim();
  let m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/); // dd/mm/yyyy
  if (m) return `${m[3]}-${pad2(m[2])}-${pad2(m[1])}`;
  m = s.match(/^(\d{1,2})\/(\d{4})$/); // mm/yyyy
  if (m) return `${m[2]}-${pad2(m[1])}`;
  m = s.match(/(\d{1,2})[-–](\d{1,2})\/(\d{4})/); // mm-mm/yyyy range
  if (m) return `${m[3]}-${pad2(m[1])}`;
  m = s.match(/(\d{4})/); // any year present
  if (m) return m[1];
  return "";
}

function deriveYear(label: string): string {
  const m = label.match(/(\d{4})/);
  return m ? m[1] : "";
}

export default function MilestoneEditorModal({
  milestone,
  posts,
  isOpen,
  onClose,
  onSave,
}: MilestoneEditorModalProps) {
  const [type, setType] = useState<MilestoneType>("moc");
  const [year, setYear] = useState<string>(String(new Date().getFullYear()));
  const [dateLabel, setDateLabel] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [sortKeyTouched, setSortKeyTouched] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [alumniName, setAlumniName] = useState("");
  const [alumniRole, setAlumniRole] = useState("");
  const [alumniAvatar, setAlumniAvatar] = useState("");
  const [alumniQuote, setAlumniQuote] = useState("");
  const [alumniLink, setAlumniLink] = useState("");
  const [relatedPostId, setRelatedPostId] = useState("");
  const [threaded, setThreaded] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const imageInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (milestone) {
      setType(milestone.type || "moc");
      setYear(String(milestone.year ?? new Date().getFullYear()));
      setDateLabel(milestone.dateLabel || "");
      setSortKey(milestone.sortKey || "");
      setSortKeyTouched(Boolean(milestone.sortKey));
      setTitle(milestone.title || "");
      setDescription(milestone.description || "");
      setImages(milestone.images || []);
      setAlumniName(milestone.alumniName || "");
      setAlumniRole(milestone.alumniRole || "");
      setAlumniAvatar(milestone.alumniAvatar || "");
      setAlumniQuote(milestone.alumniQuote || "");
      setAlumniLink(milestone.alumniLink || "");
      setRelatedPostId(milestone.relatedPostId || "");
      setThreaded(milestone.threaded !== false);
    } else {
      setType("moc");
      setYear(String(new Date().getFullYear()));
      setDateLabel("");
      setSortKey("");
      setSortKeyTouched(false);
      setTitle("");
      setDescription("");
      setImages([]);
      setAlumniName("");
      setAlumniRole("");
      setAlumniAvatar("");
      setAlumniQuote("");
      setAlumniLink("");
      setRelatedPostId("");
      setThreaded(true);
    }
    setUploadError("");
  }, [milestone, isOpen]);

  if (!isOpen) return null;

  const isAlumni = type === "alumni";
  const isPhoto = type === "photo";

  const handleDateLabelChange = (v: string) => {
    setDateLabel(v);
    if (!sortKeyTouched) {
      const derived = deriveSortKey(v);
      if (derived) setSortKey(derived);
    }
    const y = deriveYear(v);
    if (y) setYear(y);
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setIsUploading(true);
    setUploadError("");
    try {
      const urls: string[] = [];
      for (const file of files) {
        const url = await uploadMediaAsset(file, "milestones");
        urls.push(url);
      }
      setImages((prev) => [...prev, ...urls]);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Tải ảnh lên thất bại.",
      );
    } finally {
      setIsUploading(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  const handleAvatarUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setUploadError("");
    try {
      const url = await uploadMediaAsset(file, "milestones");
      setAlumniAvatar(url);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Tải ảnh lên thất bại.",
      );
    } finally {
      setIsUploading(false);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedYear = parseInt(year, 10);

    setIsSaving(true);
    try {
      const data: Omit<Milestone, "id"> = {
        type,
        year: Number.isFinite(parsedYear)
          ? parsedYear
          : new Date().getFullYear(),
        dateLabel: dateLabel.trim() || undefined,
        sortKey: sortKey.trim() || undefined,
        title: title.trim(),
        description: description.trim() || undefined,
        images: images.length > 0 ? images : undefined,
        relatedPostId: relatedPostId || undefined,
        threaded: threaded ? undefined : false,
        ...(isAlumni
          ? {
              alumniName: alumniName.trim() || undefined,
              alumniRole: alumniRole.trim() || undefined,
              alumniAvatar: alumniAvatar || undefined,
              alumniQuote: alumniQuote.trim() || undefined,
              alumniLink: alumniLink.trim() || undefined,
            }
          : {}),
      };
      await onSave(data, milestone?.id);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/30 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl bg-surface border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center text-ink">
              <Flag className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h3 className="font-bold text-base text-ink">
                {milestone ? "Chỉnh sửa cột mốc" : "Thêm cột mốc mới"}
              </h3>
              <p className="text-xs text-ink-muted">
                Dòng thời gian hành trình CLB o365
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

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 text-sm overflow-y-auto max-h-[calc(90vh-130px)]"
        >
          {/* Type */}
          <div>
            <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-2">
              Loại thẻ *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TYPE_OPTIONS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setType(id)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    type === id
                      ? "bg-accent/10 border-accent text-accent font-bold shadow-xs"
                      : "border-border bg-card/40 text-ink-muted hover:text-ink"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Year + Title */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Năm *
              </label>
              <input
                type="number"
                required
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2024"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Tiêu đề *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Thành lập CLB o365 - HUST"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
              />
            </div>
          </div>

          {/* Date label + Sort key */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Nhãn ngày (hiển thị)
              </label>
              <input
                type="text"
                value={dateLabel}
                onChange={(e) => handleDateLabelChange(e.target.value)}
                placeholder="VD: 08/2023, Giữa 05/2025"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Khoá sắp xếp
              </label>
              <input
                type="text"
                value={sortKey}
                onChange={(e) => {
                  setSortKey(e.target.value);
                  setSortKeyTouched(true);
                }}
                placeholder="VD: 2023-08"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
              />
              <p className="mt-1 text-[11px] text-ink-muted">
                Định dạng YYYY-MM (hoặc YYYY-MM-DD) để sắp xếp đúng thứ tự trong năm.
              </p>
            </div>
          </div>

          {/* Description (moc, thanh_tich, alumni, photo back) */}
          {!isPhoto && (
            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Mô tả {isAlumni ? "(tuỳ chọn)" : ""}
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nội dung chi tiết hiển thị khi mở rộng thẻ. Hỗ trợ Markdown."
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent resize-none"
              />
            </div>
          )}

          {isPhoto && (
            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Nội dung mặt sau khung (Markdown)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ghi chú, liên kết hoặc bối cảnh hiển thị khi người dùng lật khung trên trang Hành trình."
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent resize-none"
              />
              <p className="mt-1 text-[11px] text-ink-muted">
                Hiển thị ở mặt sau khung ảnh khi bấm &quot;Lật khung&quot; trên bảng công khai.
              </p>
            </div>
          )}

          {/* Photo frame cover */}
          {isPhoto && (
            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Ảnh khung *
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {images[0] && (
                  <div className="relative w-28 h-36 rounded-lg overflow-hidden border border-border bg-card group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={images[0]}
                      alt="Ảnh khung"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImages([])}
                      className="absolute top-0.5 right-0.5 w-5 h-5 rounded-md bg-ink/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Xoá ảnh"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card/40 text-ink text-xs font-semibold hover:bg-card transition-colors cursor-pointer disabled:opacity-50"
              >
                {isUploading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ImagePlus className="w-3.5 h-3.5" />
                )}
                <span>{images[0] ? "Đổi ảnh" : "Tải ảnh lên"}</span>
              </button>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setIsUploading(true);
                  setUploadError("");
                  try {
                    const url = await uploadMediaAsset(file, "milestones");
                    setImages([url]);
                  } catch (err) {
                    setUploadError(
                      err instanceof Error ? err.message : "Tải ảnh lên thất bại.",
                    );
                  } finally {
                    setIsUploading(false);
                    if (imageInputRef.current) imageInputRef.current.value = "";
                  }
                }}
                className="hidden"
              />
              <p className="mt-1 text-[11px] text-ink-muted">
                Hiển thị dạng khung ảnh dán băng keo trên bảng ghi chú.
              </p>
            </div>
          )}

          {/* Images (moc / thanh_tich) */}
          {!isAlumni && !isPhoto && (
            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Thư viện ảnh (hiển thị khi mở rộng)
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {images.map((src, idx) => (
                  <div
                    key={`${src}-${idx}`}
                    className="relative w-20 h-16 rounded-lg overflow-hidden border border-border bg-card group"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Ảnh ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-0.5 right-0.5 w-5 h-5 rounded-md bg-ink/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Xoá ảnh"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card/40 text-ink text-xs font-semibold hover:bg-card transition-colors cursor-pointer disabled:opacity-50"
              >
                {isUploading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ImagePlus className="w-3.5 h-3.5" />
                )}
                <span>Tải ảnh lên</span>
              </button>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          )}

          {/* Alumni fields */}
          {isAlumni && (
            <div className="space-y-4 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                    Tên cựu thành viên
                  </label>
                  <input
                    type="text"
                    value={alumniName}
                    onChange={(e) => setAlumniName(e.target.value)}
                    placeholder="VD: Nguyễn Văn A"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                    Vai trò hiện tại
                  </label>
                  <input
                    type="text"
                    value={alumniRole}
                    onChange={(e) => setAlumniRole(e.target.value)}
                    placeholder="VD: Technical Consultant tại Microsoft VN"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                  Trích dẫn (hiển thị khi mở rộng)
                </label>
                <textarea
                  rows={2}
                  value={alumniQuote}
                  onChange={(e) => setAlumniQuote(e.target.value)}
                  placeholder="Câu chuyện hoặc lời nhắn của cựu thành viên..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                    Liên kết hồ sơ (LinkedIn...)
                  </label>
                  <input
                    type="url"
                    value={alumniLink}
                    onChange={(e) => setAlumniLink(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                    Ảnh đại diện
                  </label>
                  <div className="flex items-center gap-3">
                    {alumniAvatar && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={alumniAvatar}
                        alt="Ảnh đại diện"
                        className="w-10 h-10 rounded-full object-cover border border-border"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={isUploading}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card/40 text-ink text-xs font-semibold hover:bg-card transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isUploading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <ImagePlus className="w-3.5 h-3.5" />
                      )}
                      <span>{alumniAvatar ? "Đổi ảnh" : "Tải ảnh"}</span>
                    </button>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Thread toggle */}
          <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card/30 px-4 py-3">
            <div>
              <p className="text-xs font-semibold text-ink">Nối vào đường chỉ</p>
              <p className="mt-0.5 text-[11px] text-ink-muted">
                Ghi chú được nối theo thứ tự thời gian trên bảng công khai.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={threaded}
              onClick={() => setThreaded((v) => !v)}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border transition-colors ${
                threaded
                  ? "border-accent bg-accent/20"
                  : "border-border bg-card"
              }`}
            >
              <span
                className={`inline-flex h-5 w-5 items-center justify-center rounded-full bg-surface shadow-xs transition-transform ${
                  threaded ? "translate-x-6" : "translate-x-1"
                }`}
              >
                {threaded ? (
                  <Link2 className="h-3 w-3 text-accent" />
                ) : (
                  <Link2Off className="h-3 w-3 text-ink-muted" />
                )}
              </span>
            </button>
          </div>

          {/* Related post */}
          <div>
            <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
              Bài viết liên quan (tuỳ chọn)
            </label>
            <select
              value={relatedPostId}
              onChange={(e) => setRelatedPostId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent cursor-pointer"
            >
              <option value="">— Không liên kết —</option>
              {posts.map((post) => (
                <option key={post.id} value={post.id}>
                  {post.title}
                </option>
              ))}
            </select>
          </div>

          {uploadError && (
            <p className="text-xs text-red-600 font-medium">{uploadError}</p>
          )}

          {/* Footer */}
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
              disabled={isSaving || isUploading}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-ink text-surface text-xs font-semibold hover:bg-ink/90 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>
                {isSaving ? "Đang lưu..." : milestone ? "Cập nhật" : "Thêm cột mốc"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import type { EventItem, EventStatus } from "@/app/types";
import { X, Calendar, Check, Sparkles, Flame, Clock, Award } from "lucide-react";

interface EventEditorModalProps {
  event: EventItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: Omit<EventItem, "id">, id?: string) => Promise<void>;
}

export default function EventEditorModal({
  event,
  isOpen,
  onClose,
  onSave,
}: EventEditorModalProps) {
  const [status, setStatus] = useState<EventStatus>("ongoing");
  const [month, setMonth] = useState("Tháng 10");
  const [title, setTitle] = useState("");
  const [linkLabel, setLinkLabel] = useState("Đăng ký ngay");
  const [linkUrl, setLinkUrl] = useState("#");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Công tác SV");
  const [drl, setDrl] = useState("+5 ĐRL");
  const [isHighlight, setIsHighlight] = useState(false);
  const [funnyQuote, setFunnyQuote] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (event) {
      setStatus(event.status || "ongoing");
      setMonth(event.month);
      setTitle(event.title);
      setLinkLabel(event.linkLabel);
      setLinkUrl(event.linkUrl);
      setDescription(event.description || "");
      setLocation(event.location || "");
      setCategory(event.category || "Công tác SV");
      setDrl(event.drl || "+5 ĐRL");
      setIsHighlight(Boolean(event.isHighlight));
      setFunnyQuote(event.funnyQuote || "");
      setTargetDate(event.targetDate || "");
    } else {
      setStatus("ongoing");
      setMonth("Tháng 10");
      setTitle("");
      setLinkLabel("Đăng ký ngay");
      setLinkUrl("#");
      setDescription("");
      setLocation("ĐHBK Hà Nội");
      setCategory("Công tác SV");
      setDrl("+5 ĐRL");
      setIsHighlight(false);
      setFunnyQuote("");
      setTargetDate("");
    }
  }, [event, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !month.trim()) return;

    setIsSaving(true);
    try {
      await onSave(
        {
          status,
          month: month.trim(),
          title: title.trim(),
          linkLabel: linkLabel.trim() || "Đăng ký ngay",
          linkUrl: linkUrl.trim() || "#",
          description: description.trim(),
          location: location.trim(),
          category: category.trim() || "Công tác SV",
          drl: drl.trim(),
          isHighlight,
          funnyQuote: funnyQuote.trim(),
          targetDate: targetDate.trim(),
          reactions: event?.reactions || {},
        },
        event?.id
      );
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/30 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl bg-surface border border-border shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center text-ink">
              <Calendar className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h3 className="font-bold text-base text-ink">
                {event ? "Chỉnh sửa sự kiện" : "Thêm sự kiện mới"}
              </h3>
              <p className="text-xs text-ink-muted">
                Quản lý lịch hoạt động & công tác sinh viên o365
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm overflow-y-auto max-h-[calc(90vh-130px)]">
          {/* Tab / Status Selection */}
          <div>
            <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-2">
              Trạng thái hiển thị (Tab) *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus("ongoing")}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  status === "ongoing"
                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold shadow-xs"
                    : "border-border bg-card/40 text-ink-muted hover:text-ink"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Đang diễn ra</span>
              </button>
              <button
                type="button"
                onClick={() => setStatus("upcoming")}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  status === "upcoming"
                    ? "bg-blue-500/10 border-blue-500 text-blue-700 dark:text-blue-300 font-bold shadow-xs"
                    : "border-border bg-card/40 text-ink-muted hover:text-ink"
                }`}
              >
                <Clock className="w-3 h-3 text-blue-500" />
                <span>Sắp diễn ra</span>
              </button>
              <button
                type="button"
                onClick={() => setStatus("past")}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  status === "past"
                    ? "bg-purple-500/10 border-purple-500 text-purple-700 dark:text-purple-300 font-bold shadow-xs"
                    : "border-border bg-card/40 text-ink-muted hover:text-ink"
                }`}
              >
                <Award className="w-3 h-3 text-purple-500" />
                <span>Đã diễn ra</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
              Tên sự kiện / Hoạt động *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Tuyển thành viên Gen 3.0 / Workshop MOSWC"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
            />
          </div>

          {/* Month / Date & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Thời gian hiển thị (Badge) *
              </label>
              <input
                type="text"
                required
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                placeholder="VD: Tháng 10 hoặc 18/10/2026"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Địa điểm
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="VD: Hội trường C2 / Thư viện Tạ Quang Bửu"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
              />
            </div>
          </div>

          {/* Category & ĐRL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Phân loại / Ban
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Công tác SV, Học thuật & AI, Tuyển quân..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Điểm Rèn Luyện (ĐRL) / Chứng nhận
              </label>
              <input
                type="text"
                value={drl}
                onChange={(e) => setDrl(e.target.value)}
                placeholder="+5 ĐRL, +8 ĐRL, Chứng nhận HUST..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
              />
            </div>
          </div>

          {/* Target Date for countdown & Highlight toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Ngày đếm ngược (YYYY-MM-DD)
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
              />
            </div>

            <div className="pt-5">
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-border bg-card/40 cursor-pointer hover:bg-card transition-colors">
                <input
                  type="checkbox"
                  checked={isHighlight}
                  onChange={(e) => setIsHighlight(e.target.checked)}
                  className="w-4 h-4 rounded text-accent focus:ring-accent cursor-pointer"
                />
                <span className="text-xs font-semibold text-ink flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Sự kiện HOT (Điểm tin 10s)</span>
                </span>
              </label>
            </div>
          </div>

          {/* Funny Quote / Punchline */}
          <div>
            <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Câu quote hài hước Bách Khoa / Punchline</span>
            </label>
            <input
              type="text"
              value={funnyQuote}
              onChange={(e) => setFunnyQuote(e.target.value)}
              placeholder="VD: Deadline dí tới mông rồi kìa, nộp đơn đi trước 23:59!"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent font-medium text-accent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
              Mô tả chi tiết
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nội dung, mục tiêu hoặc đối tượng sinh viên tham gia..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent resize-none"
            />
          </div>

          {/* Link Label & URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Nút hành động (Label)
              </label>
              <input
                type="text"
                value={linkLabel}
                onChange={(e) => setLinkLabel(e.target.value)}
                placeholder="VD: Đăng ký ngay, Cổng CTSV — Lấy ĐRL"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Đường dẫn liên kết (Link URL)
              </label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://forms.office.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
              />
            </div>
          </div>

          {/* Modal Footer */}
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
              <span>{isSaving ? "Đang lưu..." : event ? "Cập nhật" : "Thêm sự kiện"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

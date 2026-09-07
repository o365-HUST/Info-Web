"use client";

import { useState, useEffect } from "react";
import type { EventItem } from "@/app/types";
import { X, Calendar, Check } from "lucide-react";

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
  const [month, setMonth] = useState("Tháng 10");
  const [title, setTitle] = useState("");
  const [linkLabel, setLinkLabel] = useState("Đăng ký ngay");
  const [linkUrl, setLinkUrl] = useState("#");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (event) {
      setMonth(event.month);
      setTitle(event.title);
      setLinkLabel(event.linkLabel);
      setLinkUrl(event.linkUrl);
      setDescription(event.description || "");
      setLocation(event.location || "");
    } else {
      setMonth("Tháng 10");
      setTitle("");
      setLinkLabel("Đăng ký ngay");
      setLinkUrl("#");
      setDescription("");
      setLocation("ĐHBK Hà Nội");
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
          month: month.trim(),
          title: title.trim(),
          linkLabel: linkLabel.trim() || "Đăng ký ngay",
          linkUrl: linkUrl.trim() || "#",
          description: description.trim(),
          location: location.trim(),
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
      <div className="relative w-full max-w-lg flex flex-col rounded-2xl bg-surface border border-border shadow-xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center text-ink">
              <Calendar className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h3 className="font-bold text-base text-ink">
                {event ? "Chỉnh sửa sự kiện" : "Thêm sự kiện mới"}
              </h3>
              <p className="text-xs text-ink-muted">
                Cập nhật lịch hoạt động & công tác sinh viên
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          {/* Month / Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Thời gian / Tháng *
              </label>
              <input
                type="text"
                required
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                placeholder="VD: Tháng 10 hoặc 15/10"
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
                placeholder="VD: Hội trường C2 / Online"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
              />
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
              placeholder="VD: Workshop Kỹ năng số & Microsoft 365"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
              Mô tả ngắn gọn
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nội dung, mục tiêu hoặc đối tượng tham gia..."
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
                Liên kết (Link URL)
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

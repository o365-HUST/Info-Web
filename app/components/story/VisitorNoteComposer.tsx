"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import {
  DOTTED_MODAL_CLOSE,
  VISITOR_MODAL_SHELL,
} from "@/app/components/story/cards/milestoneTileStyles";
import {
  VISITOR_HEADLINE_MAX,
  VISITOR_MESSAGE_MAX,
  createVisitorNote,
  sanitizeVisitorHeadline,
  sanitizeVisitorMessage,
  type VisitorNote,
} from "@/app/lib/visitorNote";

interface VisitorNoteComposerProps {
  open: boolean;
  initial: VisitorNote | null;
  reducedMotion: boolean;
  onSave: (note: VisitorNote) => void;
  onRemove: () => void;
  onClose: () => void;
}

export default function VisitorNoteComposer({
  open,
  initial,
  reducedMotion,
  onSave,
  onRemove,
  onClose,
}: VisitorNoteComposerProps) {
  const [headline, setHeadline] = useState(initial?.headline ?? "");
  const [message, setMessage] = useState(initial?.message ?? "");
  const headlineRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setHeadline(initial?.headline ?? "");
    setMessage(initial?.message ?? "");
    const t = requestAnimationFrame(() => headlineRef.current?.focus());
    return () => cancelAnimationFrame(t);
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !dialogRef.current) return;

    const root = dialogRef.current;
    const getFocusables = () =>
      Array.from(
        root.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const focusables = getFocusables();
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    root.addEventListener("keydown", onKeyDown);
    return () => root.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const cleanHeadline = sanitizeVisitorHeadline(headline);
    if (!cleanHeadline) return;

    const cleanMessage = sanitizeVisitorMessage(message);
    if (initial) {
      onSave({
        ...initial,
        headline: cleanHeadline,
        message: cleanMessage,
      });
    } else {
      onSave(createVisitorNote(cleanHeadline, cleanMessage));
    }
  };

  const handleRemove = () => {
    if (
      window.confirm("Gỡ ghi chú khỏi bảng? Ghi chú sẽ bị xóa khỏi trình duyệt này.")
    ) {
      onRemove();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.12 : 0.2 }}
        >
          <button
            type="button"
            aria-label="Đóng"
            onClick={onClose}
            className="absolute inset-0 bg-black/45"
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="visitor-note-composer-title"
            initial={reducedMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            transition={
              reducedMotion
                ? { duration: 0.12 }
                : { type: "spring", damping: 30, stiffness: 320 }
            }
            className={`relative z-[81] p-5 ${VISITOR_MODAL_SHELL}`}
          >
            <p
              className={`mb-2 font-display text-lg font-extrabold uppercase tracking-[0.14em] text-rose-700 dark:text-rose-300 sm:text-xl`}
            >
              Của bạn
            </p>
            <div className="mb-4 flex items-start justify-between gap-3 pr-10">
              <div>
                <h2
                  id="visitor-note-composer-title"
                  className="font-display text-lg font-bold text-ink tracking-tight m-0 sm:text-xl"
                >
                  {initial ? "Sửa ghi chú của bạn" : "Ghi dấu của bạn"}
                </h2>
                <p className="text-xs text-ink-light leading-relaxed mt-1 mb-0">
                  Chỉ lưu trên trình duyệt này — không gửi lên server.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className={`absolute right-3 top-3 ${DOTTED_MODAL_CLOSE}`}
            >
              <X className="h-4 w-4" />
            </button>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="visitor-note-headline"
                  className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-700 dark:text-rose-300"
                >
                  Dòng chính
                </label>
                <input
                  ref={headlineRef}
                  id="visitor-note-headline"
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  maxLength={VISITOR_HEADLINE_MAX}
                  required
                  placeholder="Tên, lớp, khoá…"
                  className="w-full rounded-xl border-2 border-dashed border-ink/25 bg-surface px-3 py-2.5 text-sm text-ink focus-visible:outline-2 focus-visible:outline-accent"
                />
                <p className="mt-1 text-[11px] text-ink-muted m-0">
                  {headline.length}/{VISITOR_HEADLINE_MAX}
                </p>
              </div>

              <div>
                <label
                  htmlFor="visitor-note-message"
                  className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-700 dark:text-rose-300"
                >
                  Lời nhắn (tuỳ chọn)
                </label>
                <textarea
                  id="visitor-note-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={VISITOR_MESSAGE_MAX}
                  rows={3}
                  placeholder="Viết vài dòng gửi CLB…"
                  className="w-full resize-none rounded-xl border-2 border-dashed border-ink/25 bg-surface px-3 py-2.5 text-sm text-ink leading-relaxed focus-visible:outline-2 focus-visible:outline-accent"
                />
                <p className="mt-1 text-[11px] text-ink-muted m-0">
                  {message.length}/{VISITOR_MESSAGE_MAX}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full border-2 border-dashed border-rose-500/50 bg-rose-100 px-4 py-2.5 text-sm font-semibold text-ink [box-shadow:var(--timeline-chunky-shadow)] transition-[transform,box-shadow] hover:-translate-y-0.5 active:shadow-[var(--timeline-chunky-shadow-press)] focus-visible:outline-2 focus-visible:outline-accent dark:bg-rose-900 dark:text-rose-50"
                >
                  {initial ? "Lưu thay đổi" : "Dán lên bảng"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center justify-center rounded-full border-2 border-dashed border-ink/30 bg-surface px-4 py-2.5 text-sm font-semibold text-ink hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-accent"
                >
                  Huỷ
                </button>
                {initial && (
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="ml-auto text-sm font-semibold text-ink-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-accent rounded-sm"
                  >
                    Gỡ ghi chú
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

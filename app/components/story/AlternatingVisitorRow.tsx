"use client";

import { motion } from "motion/react";
import type { VisitorNote } from "@/app/lib/visitorNote";

interface VisitorNoteSectionProps {
  note: VisitorNote | null;
  composerOpen: boolean;
  reducedMotion: boolean;
  pulse: boolean;
  onAdd: () => void;
  onOpenNote: (el: HTMLElement) => void;
}

export function VisitorNoteSection({
  note,
  composerOpen,
  reducedMotion,
  pulse,
  onAdd,
  onOpenNote,
}: VisitorNoteSectionProps) {
  if (composerOpen && !note) return null;

  return (
    <motion.div
      className="mx-auto mt-10 w-full max-w-[760px] border-t border-dashed border-border pt-8"
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reducedMotion
          ? { duration: 0.12 }
          : { type: "spring", damping: 28, stiffness: 320 }
      }
    >
      {note ? (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1 rounded-[var(--radius-2xl)] border border-border bg-card p-4 text-left shadow-card [box-shadow:var(--shadow-card),inset_0_1px_0_0_var(--border-subtle)]">
            <p className="font-display text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink-muted">
              Ghi chú của bạn
            </p>
            <p className="mt-1 font-display text-base font-bold leading-snug text-ink text-pretty">
              {note.headline}
            </p>
            {note.message && (
              <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-ink-light">
                {note.message}
              </p>
            )}
            {note.dateLabel && (
              <p className="mt-2 text-[11px] font-medium text-ink-muted">{note.dateLabel}</p>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => onOpenNote(e.currentTarget)}
            className="shrink-0 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-ink shadow-xs transition-colors hover:border-accent/40 hover:text-accent focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4"
          >
            Xem / chỉnh sửa
          </button>
        </div>
      ) : (
        <div
          className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${
            pulse && !reducedMotion
              ? "animate-[visitorPatchPulse_2.4s_ease-in-out_infinite]"
              : ""
          }`}
        >
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-bold leading-snug text-ink">
              Ghim ghi chú của bạn
            </p>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink-light text-pretty">
              Một dòng kỷ niệm riêng sau hành trình — chỉ lưu trên trình duyệt này.
            </p>
          </div>
          <button
            type="button"
            onClick={onAdd}
            aria-label="Thêm ghi chú của bạn sau hành trình"
            className="shrink-0 rounded-full border-2 border-ink/80 bg-accent px-6 py-2.5 text-sm font-bold text-ink shadow-card transition-[transform,box-shadow] hover:shadow-md active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4"
          >
            Thêm ghi chú
          </button>
        </div>
      )}
    </motion.div>
  );
}

/** @deprecated Visitor rows on the rail — use VisitorNoteSection below the timeline. */
export function AlternatingVisitorNode() {
  return null;
}

/** @deprecated */
export function AlternatingVisitorPatch() {
  return null;
}

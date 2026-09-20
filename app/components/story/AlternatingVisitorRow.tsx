"use client";

import { motion } from "motion/react";
import TimelineDot from "@/app/components/story/TimelineDot";
import TimelineDateLabel from "@/app/components/story/TimelineDateLabel";
import type { TimelineSide } from "@/app/lib/alternatingTimeline";
import type { VisitorNote } from "@/app/lib/visitorNote";

interface AlternatingVisitorRowProps {
  side: TimelineSide;
  rowTop: number;
  note: VisitorNote;
  reducedMotion: boolean;
  onOpen: (el: HTMLElement) => void;
}

export function AlternatingVisitorNode({
  side,
  rowTop,
  note,
  reducedMotion,
  onOpen,
}: AlternatingVisitorRowProps) {
  const labelBlock = (
    <div className={`max-w-[11rem] ${side === "left" ? "text-right" : "text-left"}`}>
      <p className="font-display text-[12px] font-bold leading-snug text-ink text-pretty">
        {note.headline}
      </p>
      {note.message && (
        <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-ink-light">
          {note.message}
        </p>
      )}
      <p className="mt-0.5 text-[10px] font-medium text-ink-muted">Ghi chú của bạn</p>
    </div>
  );

  return (
    <motion.li
      className="absolute left-0 right-0 list-none"
      style={{ top: rowTop }}
      initial={reducedMotion ? false : { opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={
        reducedMotion
          ? { duration: 0.12 }
          : { type: "spring", damping: 28, stiffness: 320 }
      }
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
        <div className={`flex flex-col ${side === "left" ? "items-end pr-1 sm:pr-3" : ""}`}>
          {side === "left" && (
            <>
              <TimelineDateLabel dateLabel={note.dateLabel} side={side} />
              {labelBlock}
            </>
          )}
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={(e) => onOpen(e.currentTarget)}
            aria-label={`Ghi chú của bạn: ${note.headline}. Nhấn để xem hoặc chỉnh sửa.`}
            className="group flex flex-col items-center focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4"
          >
            <TimelineDot />
            <span className="mt-1.5 text-[10px] font-semibold text-accent opacity-0 transition-opacity group-hover:opacity-100">
              Xem / sửa →
            </span>
          </button>
        </div>

        <div className={`flex flex-col ${side === "right" ? "items-start pl-1 sm:pl-3" : ""}`}>
          {side === "right" && (
            <>
              <TimelineDateLabel dateLabel={note.dateLabel} side={side} />
              {labelBlock}
            </>
          )}
        </div>
      </div>
    </motion.li>
  );
}

interface AlternatingVisitorPatchProps {
  side: TimelineSide;
  rowTop: number;
  pulse: boolean;
  reducedMotion: boolean;
  onClick: () => void;
}

export function AlternatingVisitorPatch({
  side,
  rowTop,
  pulse,
  reducedMotion,
  onClick,
}: AlternatingVisitorPatchProps) {
  const hintBlock = (
    <button
      type="button"
      onClick={onClick}
      className="max-w-[11rem] text-left focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4"
    >
      <p className="font-display text-[12px] font-bold leading-snug text-ink">
        Ghim ghi chú của bạn
      </p>
      <p className="mt-0.5 text-[11px] leading-relaxed text-ink-light">
        Một dòng kỷ niệm riêng ở cuối hành trình — chỉ lưu trên trình duyệt này.
      </p>
    </button>
  );

  return (
    <motion.li
      className="absolute left-0 right-0 list-none"
      style={{ top: rowTop }}
      initial={reducedMotion ? false : { opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={
        reducedMotion
          ? { duration: 0.12 }
          : { type: "spring", damping: 28, stiffness: 320 }
      }
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
        <div className={`flex flex-col ${side === "left" ? "items-end pr-1 sm:pr-3" : ""}`}>
          {side === "left" && (
            <>
              <TimelineDateLabel dateLabel="Của bạn" side={side} />
              <div className="text-right">{hintBlock}</div>
            </>
          )}
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={onClick}
            aria-label="Thêm ghi chú của bạn vào cuối hành trình"
            className={`group flex flex-col items-center focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4 ${
              pulse && !reducedMotion
                ? "animate-[visitorPatchPulse_2.4s_ease-in-out_infinite]"
                : ""
            }`}
          >
            <TimelineDot variant="cta" />
            <span className="mt-1.5 text-[10px] font-semibold text-accent">Thêm +</span>
          </button>
        </div>

        <div className={`flex flex-col ${side === "right" ? "items-start pl-1 sm:pl-3" : ""}`}>
          {side === "right" && (
            <>
              <TimelineDateLabel dateLabel="Của bạn" side={side} />
              {hintBlock}
            </>
          )}
        </div>
      </div>
    </motion.li>
  );
}

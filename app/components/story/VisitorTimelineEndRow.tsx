"use client";

import { motion } from "motion/react";
import { Heart } from "lucide-react";
import type { VisitorNote } from "@/app/lib/visitorNote";
import {
  ALTERNATING_VISITOR_ROW_HEIGHT,
  type TimelineSide,
  timelineLayoutTransition,
} from "@/app/lib/alternatingTimeline";
import TimelineDateLabel from "@/app/components/story/TimelineDateLabel";
import {
  MILESTONE_TILE_BUTTON,
  TIMELINE_RAIL_ICON_TACTILE,
  VISITOR_TILE_SURFACE,
  milestoneTileMaxWidthClass,
} from "@/app/components/story/cards/milestoneTileStyles";

interface VisitorTimelineEndRowProps {
  side: TimelineSide;
  rowTop: number;
  note: VisitorNote | null;
  composerOpen: boolean;
  reducedMotion: boolean;
  pulse: boolean;
  layoutAnimate: boolean;
  onAdd: () => void;
  onOpenNote: (el: HTMLElement) => void;
}

export default function VisitorTimelineEndRow({
  side,
  rowTop,
  note,
  composerOpen,
  reducedMotion,
  pulse,
  layoutAnimate,
  onAdd,
  onOpenNote,
}: VisitorTimelineEndRowProps) {
  if (composerOpen && !note) return null;

  const layoutT = timelineLayoutTransition(reducedMotion);
  const dateLabel = note?.dateLabel ?? "Dấu mốc của bạn";

  const stack = (
    <div
      className={`flex flex-col ${milestoneTileMaxWidthClass("default")} ${
        side === "left" ? "items-end" : "items-start"
      }`}
    >
      <TimelineDateLabel dateLabel={dateLabel} side={side} variant="default" />
      {note ? (
        <button
          type="button"
          onClick={(e) => onOpenNote(e.currentTarget)}
          className={`group w-full p-4 text-left ${VISITOR_TILE_SURFACE} ${MILESTONE_TILE_BUTTON}`}
          aria-label={`Ghi chú của bạn: ${note.headline}. Nhấn để xem hoặc chỉnh sửa.`}
        >
          <p className="font-display text-sm font-bold leading-snug text-ink text-pretty sm:text-[15px]">
            {note.headline}
          </p>
          {note.message && (
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-light">
              {note.message}
            </p>
          )}
          <span className="mt-1 block text-[10px] font-semibold text-accent opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            Xem / chỉnh sửa →
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={onAdd}
          className={`w-full p-4 text-left ${VISITOR_TILE_SURFACE} ${MILESTONE_TILE_BUTTON} ${
            pulse && !reducedMotion
              ? "animate-[visitorPatchPulse_2.4s_ease-in-out_infinite]"
              : ""
          }`}
          aria-label="Thêm ghi chú của bạn vào cuối hành trình"
        >
          <p className="font-display text-sm font-bold leading-snug text-ink">
            Hãy để lại dấu mốc của bản thân
          </p>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-light">
            Một dòng kỷ niệm riêng trong hành trình của CLB o365 - HUST.
          </p>
          <span className="mt-1 block text-[10px] font-semibold text-accent">Thêm +</span>
        </button>
      )}
    </div>
  );

  return (
    <motion.li
      className="absolute left-0 right-0 list-none overflow-visible"
      initial={false}
      animate={{ top: rowTop, opacity: 1 }}
      transition={layoutAnimate ? layoutT : { duration: 0.12 }}
      style={{ height: ALTERNATING_VISITOR_ROW_HEIGHT }}
    >
      <div className="grid h-full grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
        <div
          className={`flex flex-col justify-center ${
            side === "left" ? "items-end pr-1 sm:pr-3" : ""
          }`}
        >
          {side === "left" && stack}
        </div>

        <div className="flex justify-center">
          <span
            className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-400 text-ink ${TIMELINE_RAIL_ICON_TACTILE}`}
            aria-hidden="true"
          >
            <Heart className="h-5 w-5" strokeWidth={2.25} />
          </span>
        </div>

        <div
          className={`flex flex-col justify-center ${
            side === "right" ? "items-start pl-1 sm:pl-3" : ""
          }`}
        >
          {side === "right" && stack}
        </div>
      </div>
    </motion.li>
  );
}

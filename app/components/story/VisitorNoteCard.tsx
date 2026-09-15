"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue } from "motion/react";
import { NOTE_W, noteTapeTilt } from "@/app/lib/milestoneBoard";
import type { BoardPos } from "@/app/lib/milestoneBoard";
import { VISITOR_NOTE_ID, type VisitorNote } from "@/app/lib/visitorNote";

const PAPER_GRAIN =
  "repeating-linear-gradient(0deg, rgba(0,0,0,0.018) 0 1px, transparent 1px 4px), repeating-linear-gradient(90deg, rgba(0,0,0,0.012) 0 1px, transparent 1px 5px)";

const NOTE_TRANSFORM_ORIGIN = "50% 12px";

const MOC_THEME = {
  outer: "#fde68a",
  inner: "#fffef7",
  lineColor: "rgba(180,83,9,0.12)",
  shadow:
    "1px 2px 0 rgba(0,0,0,0.04), 3px 6px 12px rgba(0,0,0,0.1), 6px 14px 24px rgba(180,130,40,0.12)",
  shadowHover:
    "2px 4px 0 rgba(0,0,0,0.05), 6px 12px 20px rgba(0,0,0,0.14), 10px 22px 32px rgba(180,130,40,0.16)",
  ink: "text-[#713f12]",
  inkMuted: "text-[#92400e]",
  tape: "bg-[#fde68a]/90",
};

interface VisitorNoteCardProps {
  note: VisitorNote;
  layout: BoardPos;
  savedPos?: BoardPos;
  dragEnabled: boolean;
  reducedMotion: boolean;
  constraintsRef: React.RefObject<HTMLDivElement | null>;
  registerPin: (id: string, el: HTMLSpanElement | null) => void;
  onOpen: (el: HTMLElement) => void;
  onCommitPos: (pos: BoardPos) => void;
  onMove: () => void;
}

function MaskingTape({
  rotate,
  color,
}: {
  rotate: number;
  color: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`absolute left-1/2 z-30 h-[18px] w-[58px] -translate-x-1/2 rounded-[1px] shadow-[0_1px_2px_rgba(0,0,0,0.15)] ${color}`}
      style={{ rotate: `${rotate}deg`, top: "-10px" }}
    />
  );
}

export default function VisitorNoteCard({
  note,
  layout,
  savedPos,
  dragEnabled,
  reducedMotion,
  constraintsRef,
  registerPin,
  onOpen,
  onCommitPos,
  onMove,
}: VisitorNoteCardProps) {
  const theme = MOC_THEME;
  const tilt = reducedMotion ? 0 : -2.5;
  const tapeTilt = noteTapeTilt(VISITOR_NOTE_ID);

  const base = savedPos ?? layout;
  const x = useMotionValue(base.x);
  const y = useMotionValue(base.y);
  const [isDragging, setIsDragging] = useState(false);
  const wasDragged = useRef(false);

  useEffect(() => {
    const next = savedPos ?? layout;
    x.set(next.x);
    y.set(next.y);
  }, [savedPos, layout.x, layout.y, x, y]);

  const dragProps = {
    drag: dragEnabled as true | false,
    dragConstraints: constraintsRef,
    dragMomentum: false,
    dragElastic: 0.08,
    onDragStart: () => {
      setIsDragging(true);
      wasDragged.current = true;
    },
    onDrag: onMove,
    onDragEnd: () => {
      setIsDragging(false);
      onCommitPos({ x: x.get(), y: y.get() });
      onMove();
      setTimeout(() => {
        wasDragged.current = false;
      }, 0);
    },
  };

  return (
    <motion.li
      id={VISITOR_NOTE_ID}
      className={`absolute list-none ${
        dragEnabled ? "cursor-grab active:cursor-grabbing" : ""
      } ${isDragging ? "z-50" : "z-10"}`}
      style={{
        x,
        y,
        width: NOTE_W,
        rotate: isDragging || reducedMotion ? 0 : tilt,
        transformOrigin: NOTE_TRANSFORM_ORIGIN,
      }}
      initial={reducedMotion ? false : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={
        reducedMotion
          ? { duration: 0.12 }
          : { type: "spring", damping: 28, stiffness: 320 }
      }
      {...dragProps}
    >
      <button
        type="button"
        onPointerDown={() => {
          wasDragged.current = false;
        }}
        onClick={(e) => {
          if (wasDragged.current) return;
          onOpen(e.currentTarget);
        }}
        aria-label={`Ghi chú của bạn: ${note.headline}. Nhấn để xem hoặc chỉnh sửa.`}
        className={`group relative block w-full text-left focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
          isDragging ? "scale-[1.02]" : ""
        }`}
      >
        <span
          ref={(el) => registerPin(VISITOR_NOTE_ID, el)}
          aria-hidden="true"
          className="absolute top-0 z-20 h-3 w-3 -translate-x-1/2"
          style={{ left: "50%" }}
        />

        <MaskingTape color={theme.tape} rotate={tapeTilt} />

        <div
          className="relative aspect-square w-full rounded-2xl p-2 transition-[transform,box-shadow] duration-200 group-hover:-translate-y-0.5"
          style={{
            backgroundColor: theme.outer,
            backgroundImage: PAPER_GRAIN,
            boxShadow: isDragging ? theme.shadowHover : theme.shadow,
          }}
        >
          <div
            className="flex h-full min-h-0 flex-col rounded-xl p-2.5"
            style={{
              backgroundColor: theme.inner,
              backgroundImage: PAPER_GRAIN,
            }}
          >
            <div
              className="flex min-h-0 flex-1 flex-col rounded-lg px-1.5 py-1"
              style={{
                backgroundImage: `${PAPER_GRAIN}, repeating-linear-gradient(transparent, transparent 17px, ${theme.lineColor} 17px, ${theme.lineColor} 18px)`,
              }}
            >
              <p className={`mb-1 font-mono text-[10px] font-semibold tabular-nums ${theme.inkMuted}`}>
                {note.dateLabel}
              </p>
              <h3
                className={`font-display text-[13px] font-bold leading-snug tracking-tight text-pretty ${theme.ink}`}
              >
                {note.headline}
              </h3>
              {note.message && (
                <p className={`mt-1 line-clamp-3 text-[11px] leading-relaxed ${theme.inkMuted}`}>
                  {note.message}
                </p>
              )}
              <p className={`mt-auto pt-2 text-[9px] font-medium ${theme.inkMuted}`}>
                Ghi chú của bạn
              </p>
            </div>
          </div>
        </div>

        <span
          className={`mt-1.5 block text-center text-[10px] font-semibold opacity-0 transition-opacity group-hover:opacity-100 ${theme.inkMuted}`}
        >
          {dragEnabled ? "Kéo hoặc xem / sửa →" : "Xem / sửa →"}
        </span>
      </button>
    </motion.li>
  );
}

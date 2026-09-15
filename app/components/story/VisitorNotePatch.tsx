"use client";

import { motion } from "motion/react";
import { NOTE_H, NOTE_W } from "@/app/lib/milestoneBoard";

interface VisitorNotePatchProps {
  x: number;
  y: number;
  pulse: boolean;
  reducedMotion: boolean;
  onClick: () => void;
}

export default function VisitorNotePatch({
  x,
  y,
  pulse,
  reducedMotion,
  onClick,
}: VisitorNotePatchProps) {
  return (
    <motion.li
      className="absolute list-none"
      style={{
        left: x,
        top: y,
        width: NOTE_W,
        height: NOTE_H,
      }}
      initial={reducedMotion ? false : { opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={
        reducedMotion
          ? { duration: 0.12 }
          : { type: "spring", damping: 28, stiffness: 300 }
      }
    >
      <button
        type="button"
        onClick={onClick}
        aria-label="Ghi dấu của bạn — thêm một ghi chú trên bảng hành trình"
        className={`story-board-visitor-patch group flex h-full w-full flex-col items-center justify-center rounded-xl px-4 text-center transition-colors focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
          pulse && !reducedMotion ? "motion-safe:animate-[visitorPatchPulse_2.4s_ease-in-out_infinite]" : ""
        }`}
      >
        <span className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-dashed border-[#713f12]/25 bg-[#fffef7]/80 text-lg text-[#92400e]">
          +
        </span>
        <span className="font-display text-sm font-bold text-[#431407]">
          Ghi dấu của bạn
        </span>
        <span className="mt-1 text-[11px] leading-snug text-[#7c2d12]/80">
          Một ghi chú — chỉ trên thiết bị này
        </span>
      </button>
    </motion.li>
  );
}

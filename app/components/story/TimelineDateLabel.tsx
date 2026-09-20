"use client";

import type { TimelineSide } from "@/app/lib/alternatingTimeline";

interface TimelineDateLabelProps {
  dateLabel: string;
  side: TimelineSide;
}

export default function TimelineDateLabel({
  dateLabel,
  side,
}: TimelineDateLabelProps) {
  return (
    <p
      className={`mb-3 font-display text-sm font-extrabold uppercase tracking-[0.12em] text-ink sm:text-base ${
        side === "left" ? "text-left" : "text-right"
      }`}
    >
      {dateLabel}
    </p>
  );
}

"use client";

import type { TimelineSide } from "@/app/lib/alternatingTimeline";
import type { StoryTimelineVariant } from "@/app/data/storyTimeline";
import { milestoneDatePopClass } from "@/app/components/story/cards/milestoneTileStyles";

interface TimelineDateLabelProps {
  dateLabel: string;
  side: TimelineSide;
  variant?: StoryTimelineVariant;
}

export default function TimelineDateLabel({
  dateLabel,
  side,
  variant = "default",
}: TimelineDateLabelProps) {
  const tint = milestoneDatePopClass(variant);

  return (
    <p
      className={`relative z-[1] mb-1.5 -translate-y-1 font-display text-lg font-extrabold uppercase leading-none tracking-[0.14em] sm:text-xl sm:tracking-[0.16em] ${tint} ${
        side === "left" ? "self-start text-left" : "self-end text-right"
      } [text-shadow:0_1px_0_var(--bg),0_0_12px_var(--bg)]`}
    >
      {dateLabel}
    </p>
  );
}

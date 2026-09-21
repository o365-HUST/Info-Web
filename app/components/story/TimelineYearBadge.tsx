"use client";

import { ChevronDown } from "lucide-react";
import { TIMELINE_NODE_TACTILE } from "@/app/components/story/cards/milestoneTileStyles";

interface TimelineYearBadgeProps {
  year: number;
  expanded: boolean;
  milestoneCount: number;
  onToggle: () => void;
  controlsId: string;
}

export default function TimelineYearBadge({
  year,
  expanded,
  milestoneCount,
  onToggle,
  controlsId,
}: TimelineYearBadgeProps) {
  return (
    <button
      type="button"
      id={`year-badge-${year}`}
      aria-expanded={expanded}
      aria-controls={controlsId}
      onClick={onToggle}
      className={`group relative z-20 flex min-h-11 min-w-[4.5rem] flex-col items-center justify-center rounded-full px-4 py-1.5 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4 ${TIMELINE_NODE_TACTILE}`}
    >
      <span className="font-display text-sm font-extrabold tabular-nums tracking-tight text-ink">
        {year}
      </span>
      <span className="mt-0.5 flex items-center gap-0.5 text-[9px] font-semibold uppercase tracking-wide text-ink-muted">
        <ChevronDown
          className={`h-3 w-3 transition-transform duration-200 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none ${
            expanded ? "rotate-0" : "-rotate-90"
          }`}
          aria-hidden="true"
        />
        {milestoneCount} mốc
      </span>
    </button>
  );
}

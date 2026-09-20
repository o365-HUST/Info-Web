"use client";

import { Trophy } from "lucide-react";
import type { StoryTimelineEntry } from "@/app/data/storyTimeline";

interface MilestoneCardProps {
  entry: StoryTimelineEntry;
  iconOnRight: boolean;
}

function truncate(text: string, max = 120): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  return `${flat.slice(0, max - 1)}…`;
}

export default function AchievementMilestoneCard({
  entry,
  iconOnRight,
}: MilestoneCardProps) {
  return (
    <div
      className={`flex w-full max-w-[17.5rem] items-center gap-3 rounded-full border-2 border-ink/80 bg-surface px-4 py-3 shadow-xs sm:max-w-[19rem] sm:px-5 sm:py-3.5 ${
        iconOnRight ? "flex-row-reverse text-right" : "text-left"
      }`}
    >
      <div className="min-w-0 flex-1">
        <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-900 dark:text-amber-200">
          <Trophy className="h-3 w-3" />
          Thành tích
        </span>
        <h3 className="font-display text-sm font-bold leading-snug text-ink text-pretty sm:text-[15px]">
          {entry.title}
        </h3>
        {entry.description && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-light">
            {truncate(entry.description)}
          </p>
        )}
      </div>
    </div>
  );
}

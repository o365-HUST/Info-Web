"use client";

import type { StoryTimelineEntry } from "@/app/data/storyTimeline";

interface MilestoneCardProps {
  entry: StoryTimelineEntry;
  iconOnRight: boolean;
}

function truncate(text: string, max = 100): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  return `${flat.slice(0, max - 1)}…`;
}

export default function PhotoMilestoneCard({
  entry,
  iconOnRight,
}: MilestoneCardProps) {
  const thumb = entry.images?.[0];

  return (
    <div
      className={`flex w-full max-w-[17.5rem] items-center gap-3 rounded-full border-2 border-ink/80 bg-surface px-3 py-2.5 shadow-xs sm:max-w-[19rem] sm:px-4 sm:py-3 ${
        iconOnRight ? "flex-row-reverse text-right" : "text-left"
      }`}
    >
      {thumb && (
        <img
          src={thumb}
          alt=""
          className="h-14 w-14 shrink-0 rounded-2xl border border-border object-cover"
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wide text-violet-700 dark:text-violet-300">
          Khoảnh khắc
        </p>
        <h3 className="font-display text-sm font-bold leading-snug text-ink">
          {entry.title}
        </h3>
        {entry.description && (
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-ink-light">
            {truncate(entry.description)}
          </p>
        )}
      </div>
    </div>
  );
}

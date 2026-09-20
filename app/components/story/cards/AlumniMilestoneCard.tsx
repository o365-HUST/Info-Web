"use client";

import type { StoryTimelineEntry } from "@/app/data/storyTimeline";

interface MilestoneCardProps {
  entry: StoryTimelineEntry;
  iconOnRight: boolean;
}

export default function AlumniMilestoneCard({
  entry,
  iconOnRight,
}: MilestoneCardProps) {
  const name = entry.alumniName ?? entry.title;

  return (
    <div
      className={`flex w-full max-w-[17.5rem] items-center gap-3 rounded-full border-2 border-ink/80 bg-surface px-4 py-3 shadow-xs sm:max-w-[19rem] sm:px-5 sm:py-3.5 ${
        iconOnRight ? "flex-row-reverse text-right" : "text-left"
      }`}
    >
      {entry.alumniAvatar && (
        <img
          src={entry.alumniAvatar}
          alt=""
          className="h-10 w-10 shrink-0 rounded-full border border-border object-cover"
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
          Cựu thành viên
        </p>
        <h3 className="font-display text-sm font-bold leading-snug text-ink">{name}</h3>
        {entry.alumniRole && (
          <p className="mt-0.5 text-xs text-ink-light">{entry.alumniRole}</p>
        )}
        {entry.alumniQuote && (
          <p className="mt-1 line-clamp-2 text-xs italic leading-relaxed text-ink-muted">
            “{entry.alumniQuote}”
          </p>
        )}
      </div>
    </div>
  );
}

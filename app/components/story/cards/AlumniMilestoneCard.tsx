"use client";

import type { StoryTimelineEntry } from "@/app/data/storyTimeline";
import { milestoneTileSurfaceClass } from "@/app/components/story/cards/milestoneTileStyles";

interface MilestoneCardProps {
  entry: StoryTimelineEntry;
  iconOnRight?: boolean;
}

export default function AlumniMilestoneCard({ entry }: MilestoneCardProps) {
  const name = entry.alumniName ?? entry.title;

  return (
    <div className={`${milestoneTileSurfaceClass("alumni")} items-start p-4`}>
      <div className="flex items-start gap-3">
        {entry.alumniAvatar && (
          <img
            src={entry.alumniAvatar}
            alt=""
            className="h-10 w-10 shrink-0 rounded-full border border-border object-cover"
          />
        )}
        <div className="min-w-0 flex-1">
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
    </div>
  );
}

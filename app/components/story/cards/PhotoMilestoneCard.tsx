"use client";

import type { StoryTimelineEntry } from "@/app/data/storyTimeline";
import { milestoneTileSurfaceClass } from "@/app/components/story/cards/milestoneTileStyles";

interface MilestoneCardProps {
  entry: StoryTimelineEntry;
  iconOnRight?: boolean;
}

function truncate(text: string, max = 100): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  return `${flat.slice(0, max - 1)}…`;
}

export default function PhotoMilestoneCard({ entry }: MilestoneCardProps) {
  const thumb = entry.images?.[0];

  return (
    <div className={`${milestoneTileSurfaceClass("photo")} items-start`}>
      {thumb && (
        <img
          src={thumb}
          alt=""
          className="mb-2.5 w-full rounded-2xl border border-border object-cover aspect-[4/3]"
        />
      )}
      <h3 className="font-display text-sm font-bold leading-snug text-ink sm:text-[15px]">
        {entry.title}
      </h3>
      {entry.description && (
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-light">
          {truncate(entry.description)}
        </p>
      )}
    </div>
  );
}

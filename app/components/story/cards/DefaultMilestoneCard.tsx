"use client";

import type { StoryTimelineEntry } from "@/app/data/storyTimeline";
import { milestoneTileSurfaceClass } from "@/app/components/story/cards/milestoneTileStyles";

interface MilestoneCardProps {
  entry: StoryTimelineEntry;
  iconOnRight?: boolean;
}

function truncate(text: string, max = 140): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  return `${flat.slice(0, max - 1)}…`;
}

export default function DefaultMilestoneCard({ entry }: MilestoneCardProps) {
  return (
    <div className={`${milestoneTileSurfaceClass(entry.variant)} items-start p-4`}>
      <h3 className="font-display text-sm font-bold leading-snug text-ink text-pretty sm:text-[15px]">
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

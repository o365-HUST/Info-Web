"use client";

import type { AlternatingPathSegment } from "@/app/lib/alternatingTimeline";

interface AlternatingTimelinePathProps {
  segments: AlternatingPathSegment[];
  width: number;
  height: number;
}

export default function AlternatingTimelinePath({
  segments,
  width,
  height,
}: AlternatingTimelinePathProps) {
  if (segments.length === 0) return null;

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-0"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
    >
      {segments.map((seg, i) => (
        <line
          key={i}
          x1={seg.x1}
          y1={seg.y1}
          x2={seg.x2}
          y2={seg.y2}
          stroke="currentColor"
          strokeWidth={1.75}
          strokeDasharray="6 5"
          className="text-ink/45"
        />
      ))}
    </svg>
  );
}

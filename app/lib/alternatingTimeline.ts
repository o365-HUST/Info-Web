import type { StoryTimelineEntry } from "@/app/data/storyTimeline";

export type TimelineSide = "left" | "right";

export const ALTERNATING_ROW_HEIGHT = 220;
export const ALTERNATING_ICON_SIZE = 48;
export const ALTERNATING_RAIL_WIDTH = 2;
export const ALTERNATING_MAX_WIDTH = 760;

export interface AlternatingRow {
  index: number;
  side: TimelineSide;
  entry: StoryTimelineEntry;
  rowTop: number;
  iconY: number;
}

export interface AlternatingLayout {
  rows: AlternatingRow[];
  width: number;
  height: number;
  railX: number;
  visitorRowIndex: number;
  visitorIconY: number;
}

export interface AlternatingPathSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export function buildAlternatingLayout(
  entries: StoryTimelineEntry[],
  options?: { includeVisitorSlot?: boolean },
): AlternatingLayout {
  const width = ALTERNATING_MAX_WIDTH;
  const railX = width / 2;
  const rows: AlternatingRow[] = entries.map((entry, index) => ({
    index,
    side: index % 2 === 0 ? "left" : "right",
    entry,
    rowTop: index * ALTERNATING_ROW_HEIGHT,
    iconY: index * ALTERNATING_ROW_HEIGHT + ALTERNATING_ROW_HEIGHT / 2,
  }));

  const visitorRowIndex = entries.length;
  const visitorIconY =
    visitorRowIndex * ALTERNATING_ROW_HEIGHT + ALTERNATING_ROW_HEIGHT / 2;
  const baseHeight = Math.max(
    entries.length * ALTERNATING_ROW_HEIGHT,
    ALTERNATING_ROW_HEIGHT,
  );
  const height = options?.includeVisitorSlot
    ? baseHeight + ALTERNATING_ROW_HEIGHT
    : baseHeight;

  return {
    rows,
    width,
    height,
    railX,
    visitorRowIndex,
    visitorIconY,
  };
}

/** L-shaped dashed segments between consecutive icon anchors on the center rail. */
export function buildAlternatingPathSegments(
  layout: AlternatingLayout,
  options?: { includeVisitor?: boolean },
): AlternatingPathSegment[] {
  const segments: AlternatingPathSegment[] = [];
  const anchorYs = layout.rows.map((row) => row.iconY);

  if (options?.includeVisitor) {
    anchorYs.push(layout.visitorIconY);
  }

  if (anchorYs.length < 2) return segments;

  const { railX } = layout;
  const elbow = 28;

  for (let i = 0; i < anchorYs.length - 1; i++) {
    const y1 = anchorYs[i]!;
    const y2 = anchorYs[i + 1]!;
    const midY = (y1 + y2) / 2;

    segments.push({ x1: railX, y1, x2: railX, y2: midY - elbow / 2 });
    segments.push({
      x1: railX,
      y1: midY - elbow / 2,
      x2: railX,
      y2: midY + elbow / 2,
    });
    segments.push({ x1: railX, y1: midY + elbow / 2, x2: railX, y2 });
  }

  return segments;
}

export function polylineAttr(points: { x: number; y: number }[]): string {
  return points.map((p) => `${p.x},${p.y}`).join(" ");
}

import type { StoryTimelineEntry } from "@/app/data/storyTimeline";

export type TimelineSide = "left" | "right";

export const ALTERNATING_ROW_HEIGHT = 220;
export const ALTERNATING_PHOTO_ROW_HEIGHT = 300;
export const ALTERNATING_YEAR_ROW_HEIGHT = 64;
export const ALTERNATING_VISITOR_ROW_HEIGHT = 200;
export const ALTERNATING_ICON_SIZE = 48;
export const ALTERNATING_RAIL_WIDTH = 2;
export const ALTERNATING_MAX_WIDTH = 760;

export interface AlternatingYearRow {
  kind: "year";
  year: number;
  revealIndex: number;
  rowTop: number;
  iconY: number;
  milestoneCount: number;
  collapsed: boolean;
}

export interface AlternatingMilestoneRow {
  kind: "milestone";
  /** Sequential reveal index (year badges + milestones in visit order). */
  revealIndex: number;
  side: TimelineSide;
  entry: StoryTimelineEntry;
  rowTop: number;
  iconY: number;
  year: number;
  rowHeight: number;
  /** First milestone in this year - target for year badge `aria-controls`. */
  yearControlsId?: string;
}

/** @deprecated Use AlternatingMilestoneRow - kept for row components. */
export type AlternatingRow = AlternatingMilestoneRow;

export type AlternatingTimelineItem = AlternatingYearRow | AlternatingMilestoneRow;

export interface AlternatingLayout {
  items: AlternatingTimelineItem[];
  milestoneRows: AlternatingMilestoneRow[];
  yearRows: AlternatingYearRow[];
  pathAnchorYs: number[];
  width: number;
  height: number;
  railX: number;
  /** Inclusive count of reveal steps (0 … revealItemCount - 1). */
  revealItemCount: number;
  years: number[];
  /** Last node on the spine when visitor CTA/note is shown (after all years). */
  visitorEnd: {
    rowTop: number;
    iconY: number;
    side: TimelineSide;
  };
}

export interface AlternatingPathSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

function normalizeCollapsedYears(
  collapsedYears?: ReadonlySet<number> | readonly number[],
): Set<number> {
  if (!collapsedYears) return new Set();
  if (collapsedYears instanceof Set) return new Set(collapsedYears);
  return new Set(collapsedYears);
}

export function groupEntriesByYear(
  entries: StoryTimelineEntry[],
): { year: number; entries: StoryTimelineEntry[] }[] {
  const order: number[] = [];
  const map = new Map<number, StoryTimelineEntry[]>();

  for (const entry of entries) {
    if (!map.has(entry.year)) {
      order.push(entry.year);
      map.set(entry.year, []);
    }
    map.get(entry.year)!.push(entry);
  }

  return order.map((year) => ({
    year,
    entries: map.get(year)!,
  }));
}

export function milestoneRowHeight(entry: StoryTimelineEntry): number {
  return entry.variant === "photo"
    ? ALTERNATING_PHOTO_ROW_HEIGHT
    : ALTERNATING_ROW_HEIGHT;
}

export function buildAlternatingLayout(
  entries: StoryTimelineEntry[],
  options?: {
    collapsedYears?: ReadonlySet<number> | readonly number[];
    /** Measured spine container width (px); defaults to max layout width. */
    containerWidth?: number;
  },
): AlternatingLayout {
  const measured = options?.containerWidth;
  const width =
    measured && measured > 0
      ? Math.min(measured, ALTERNATING_MAX_WIDTH)
      : ALTERNATING_MAX_WIDTH;
  const railX = width / 2;
  const collapsed = normalizeCollapsedYears(options?.collapsedYears);
  const groups = groupEntriesByYear(entries);

  const items: AlternatingTimelineItem[] = [];
  const yearRows: AlternatingYearRow[] = [];
  const milestoneRows: AlternatingMilestoneRow[] = [];
  const pathAnchorYs: number[] = [];

  let cursorY = 0;
  let visibleSideIndex = 0;
  let revealIndex = 0;

  for (const { year, entries: yearEntries } of groups) {
    const isCollapsed = collapsed.has(year);
    const yearRowTop = cursorY;
    const yearIconY = yearRowTop + ALTERNATING_YEAR_ROW_HEIGHT / 2;

    const yearRow: AlternatingYearRow = {
      kind: "year",
      year,
      revealIndex,
      rowTop: yearRowTop,
      iconY: yearIconY,
      milestoneCount: yearEntries.length,
      collapsed: isCollapsed,
    };

    yearRows.push(yearRow);
    items.push(yearRow);
    pathAnchorYs.push(yearIconY);
    revealIndex += 1;
    cursorY += ALTERNATING_YEAR_ROW_HEIGHT;

    if (!isCollapsed) {
      let firstInYear = true;
      for (const entry of yearEntries) {
        const side: TimelineSide =
          visibleSideIndex % 2 === 0 ? "left" : "right";
        visibleSideIndex += 1;

        const rowTop = cursorY;
        const rowHeight = milestoneRowHeight(entry);
        const iconY = rowTop + rowHeight / 2;

        const milestoneRow: AlternatingMilestoneRow = {
          kind: "milestone",
          revealIndex,
          side,
          entry,
          rowTop,
          iconY,
          year,
          rowHeight,
          yearControlsId: firstInYear
            ? `story-year-${year}-milestones`
            : undefined,
        };

        firstInYear = false;

        milestoneRows.push(milestoneRow);
        items.push(milestoneRow);
        pathAnchorYs.push(iconY);
        revealIndex += 1;
        cursorY += rowHeight;
      }
    }
  }

  const height = Math.max(cursorY, ALTERNATING_YEAR_ROW_HEIGHT);
  const visitorSide: TimelineSide =
    visibleSideIndex % 2 === 0 ? "left" : "right";

  return {
    items,
    milestoneRows,
    yearRows,
    pathAnchorYs,
    width,
    height,
    railX,
    revealItemCount: revealIndex,
    years: groups.map((g) => g.year),
    visitorEnd: {
      rowTop: height,
      iconY: height + ALTERNATING_VISITOR_ROW_HEIGHT / 2,
      side: visitorSide,
    },
  };
}

/** Smooth easing for layout reflow (year collapse, spine height). */
export const TIMELINE_LAYOUT_EASE = [0.33, 1, 0.68, 1] as const;

export function timelineLayoutTransition(reducedMotion: boolean) {
  return reducedMotion
    ? { duration: 0.12 }
    : { duration: 0.45, ease: TIMELINE_LAYOUT_EASE };
}

export function buildPathWithVisitorAnchor(
  layout: AlternatingLayout,
  includeVisitor: boolean,
): AlternatingPathSegment[] {
  const anchors = includeVisitor
    ? [...layout.pathAnchorYs, layout.visitorEnd.iconY]
    : layout.pathAnchorYs;
  return buildPathSegmentsFromAnchors(anchors, layout.railX);
}

export function spineHeightWithVisitor(
  layout: AlternatingLayout,
  includeVisitor: boolean,
): number {
  return includeVisitor
    ? layout.height + ALTERNATING_VISITOR_ROW_HEIGHT
    : layout.height;
}

/** L-shaped dashed segments between consecutive anchors on the center rail. */
export function buildAlternatingPathSegments(
  layout: AlternatingLayout,
): AlternatingPathSegment[] {
  return buildPathSegmentsFromAnchors(layout.pathAnchorYs, layout.railX);
}

export function buildPathSegmentsFromAnchors(
  anchorYs: number[],
  railX: number,
): AlternatingPathSegment[] {
  const segments: AlternatingPathSegment[] = [];

  if (anchorYs.length < 2) return segments;

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

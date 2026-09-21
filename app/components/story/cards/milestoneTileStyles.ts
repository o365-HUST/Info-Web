import type { StoryTimelineVariant } from "@/app/data/storyTimeline";

const TILE_TACTILE =
  "rounded-[var(--radius-2xl)] border-2 border-dashed text-left transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.33,1,0.68,1)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[var(--timeline-chunky-shadow-press)] [box-shadow:var(--timeline-chunky-shadow),inset_0_1px_0_0_var(--border-subtle)]";

const VARIANT_TILE: Record<
  StoryTimelineVariant,
  { surface: string; datePop: string; maxWidth: string }
> = {
  default: {
    surface: `${TILE_TACTILE} border-accent/50 bg-sky-50 dark:bg-sky-950`,
    datePop: "text-accent",
    maxWidth: "max-w-[17.5rem] sm:max-w-[19rem]",
  },
  founding: {
    surface: `${TILE_TACTILE} border-accent/60 bg-sky-100 dark:bg-sky-950`,
    datePop: "text-accent",
    maxWidth: "max-w-[17.5rem] sm:max-w-[19rem]",
  },
  achievement: {
    surface: `${TILE_TACTILE} border-amber-500/55 bg-amber-50 dark:bg-amber-950`,
    datePop: "text-amber-800 dark:text-amber-300",
    maxWidth: "max-w-[17.5rem] sm:max-w-[19rem]",
  },
  alumni: {
    surface: `${TILE_TACTILE} border-emerald-500/55 bg-emerald-50 dark:bg-emerald-950`,
    datePop: "text-emerald-800 dark:text-emerald-300",
    maxWidth: "max-w-[17.5rem] sm:max-w-[19rem]",
  },
  photo: {
    surface: `${TILE_TACTILE} border-violet-500/55 bg-violet-50 p-3 dark:bg-violet-950`,
    datePop: "text-violet-800 dark:text-violet-300",
    maxWidth: "max-w-[21rem] sm:max-w-[23rem]",
  },
};

export function milestoneTileSurfaceClass(variant: StoryTimelineVariant): string {
  return `w-full ${VARIANT_TILE[variant].maxWidth} ${VARIANT_TILE[variant].surface}`;
}

/** Dotted tactile surface without timeline max-width (modals). */
export function dottedSurfaceClass(variant: StoryTimelineVariant): string {
  return `w-full ${VARIANT_TILE[variant].surface}`;
}

export function dottedModalShellClass(
  variant: StoryTimelineVariant,
  widthClass = "max-w-lg",
): string {
  return `relative flex ${widthClass} w-full max-h-[85vh] flex-col overflow-hidden ${VARIANT_TILE[variant].surface}`;
}

export const DOTTED_MODAL_CLOSE =
  "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-ink/35 bg-card text-ink [box-shadow:var(--timeline-chunky-shadow)] transition-[transform,box-shadow] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[var(--timeline-chunky-shadow-press)]";

export const VISITOR_MODAL_SHELL = `relative flex w-full max-w-md max-h-[90vh] flex-col overflow-hidden ${TILE_TACTILE} border-rose-400/50 bg-rose-50 dark:bg-rose-950`;

export function milestoneDatePopClass(variant: StoryTimelineVariant): string {
  return VARIANT_TILE[variant].datePop;
}

export function milestoneTileMaxWidthClass(variant: StoryTimelineVariant): string {
  return `w-full ${VARIANT_TILE[variant].maxWidth}`;
}

/** Visitor / neutral spine end tile. */
export const VISITOR_TILE_SURFACE = `w-full max-w-[17.5rem] sm:max-w-[19rem] ${TILE_TACTILE} border-rose-400/50 bg-rose-50 dark:bg-rose-950`;

export const MILESTONE_TILE_BUTTON =
  "rounded-[var(--radius-2xl)] focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4";

/** Colored rail icon — keep variant fill; tactile border/shadow only. */
export const TIMELINE_RAIL_ICON_TACTILE =
  "border-2 border-dashed border-ink/35 [box-shadow:var(--timeline-chunky-shadow),inset_0_1px_0_0_rgba(255,255,255,0.12)] transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.33,1,0.68,1)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[var(--timeline-chunky-shadow-press)]";

/** Neutral rail controls (year badge). */
export const TIMELINE_NODE_TACTILE =
  "border-2 border-dashed border-ink/45 bg-card [box-shadow:var(--timeline-chunky-shadow),inset_0_1px_0_0_var(--border-subtle)] transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.33,1,0.68,1)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[var(--timeline-chunky-shadow-press)]";

/** @deprecated Use milestoneTileSurfaceClass */
export const MILESTONE_TILE_SURFACE = milestoneTileSurfaceClass("default");

/** @deprecated Timestamp is rendered above the node in TimelineMilestoneRow */
export const MILESTONE_DATE_CAPTION = "";

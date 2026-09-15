import type { Milestone, MilestoneType } from "@/app/types";

export const BOARD_PAD = 40;
export const NOTE_W = 240;
export const NOTE_H = 240;
export const PHOTO_W = 188;
export const PHOTO_H = 248;
/** Polaroid image opening shared by board notes and photo modal */
export const PHOTO_FRAME_IMAGE_CLASS = "aspect-[4/5] w-full shrink-0";
export const PHOTO_FRAME_PADDING_CLASS = "p-2 pb-2.5";
export const SLOT_W = NOTE_W;
export const ROW_H = PHOTO_H + 16;
export const GAP_X = 40;
export const GAP_Y = 72;
export const DESKTOP_COLS = 3;

/** Canonical reference width used when migrating legacy pixel positions. */
export const BOARD_REF_WIDTH = BOARD_PAD * 2 + DESKTOP_COLS * 292;

export type BoardPos = { x: number; y: number };
export type BoardRelPos = { relX: number; relY: number };

const KNOWN_TYPES: MilestoneType[] = ["moc", "thanh_tich", "alumni", "photo"];

type LegacyMilestone = Milestone & { boardX?: number; boardY?: number };

export function normalizeMilestoneType(type: unknown): MilestoneType {
  return KNOWN_TYPES.includes(type as MilestoneType)
    ? (type as MilestoneType)
    : "moc";
}

export function sortKeyOf(m: Milestone): string {
  return m.sortKey || String(m.year).padStart(4, "0");
}

export function sortMilestones(items: Milestone[]): Milestone[] {
  return [...items].sort(
    (a, b) => sortKeyOf(a).localeCompare(sortKeyOf(b)) || a.title.localeCompare(b.title),
  );
}

export function noteSize(type: MilestoneType): { w: number; h: number } {
  return type === "photo"
    ? { w: PHOTO_W, h: PHOTO_H }
    : { w: NOTE_W, h: NOTE_H };
}

function stableHash(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** Stable per-note tilt in roughly ±2–4° for a hand-pinned look. */
export function noteTilt(id: string): number {
  const h = stableHash(`${id}:tilt`);
  const magnitude = 2 + (h % 21) / 10;
  return (h & 1) === 0 ? magnitude : -magnitude;
}

/** Slight pin offset so notes are not perfectly centered on the pushpin. */
export function notePinOffsetX(id: string): number {
  return (stableHash(`${id}:pin`) % 7) - 3;
}

export function noteTapeTilt(id: string): number {
  return -5 + (stableHash(`${id}:tape`) % 11);
}

/** Default true — only explicit `false` opts out of the connecting thread. */
export function isThreaded(m: Milestone): boolean {
  return m.threaded !== false;
}

/** Chronological threaded milestones for the connecting line. */
export function getThreadedInOrder(ordered: Milestone[]): Milestone[] {
  return ordered.filter(isThreaded);
}

/** Count threaded milestones revealed up to and including maxRevealed index. */
export function countRevealedThreaded(
  ordered: Milestone[],
  maxRevealed: number,
): number {
  let count = 0;
  for (let i = 0; i <= maxRevealed && i < ordered.length; i++) {
    if (isThreaded(ordered[i])) count++;
  }
  return count;
}

export function hasRelativeBoardPosition(m: Milestone): boolean {
  return typeof m.boardRelX === "number" && typeof m.boardRelY === "number";
}

export function hasBoardPosition(m: Milestone): boolean {
  return hasRelativeBoardPosition(m) || getLegacyBoardPixels(m) !== null;
}

function getLegacyBoardPixels(m: Milestone): BoardPos | null {
  const legacy = m as LegacyMilestone;
  if (
    typeof legacy.boardX === "number" &&
    typeof legacy.boardY === "number"
  ) {
    return { x: legacy.boardX, y: legacy.boardY };
  }
  return null;
}

export function getBoardCanvasSize(
  noteCount: number,
  cols: number,
): { width: number; height: number } {
  return {
    width: BOARD_REF_WIDTH,
    height: boardHeightFor(noteCount, cols),
  };
}

export function pixelToRelative(
  x: number,
  y: number,
  canvasW: number,
  canvasH: number,
): BoardRelPos {
  if (canvasW <= 0 || canvasH <= 0) {
    return { relX: 0, relY: 0 };
  }
  return {
    relX: clamp01(x / canvasW),
    relY: clamp01(y / canvasH),
  };
}

export function relativeToPixel(
  relX: number,
  relY: number,
  canvasW: number,
  canvasH: number,
): BoardPos {
  return {
    x: relX * canvasW,
    y: relY * canvasH,
  };
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function legacyPixelsToRelative(
  m: Milestone,
  noteCount: number,
  cols: number,
): BoardRelPos | null {
  const legacy = getLegacyBoardPixels(m);
  if (!legacy) return null;
  const { height } = getBoardCanvasSize(noteCount, cols);
  return pixelToRelative(legacy.x, legacy.y, BOARD_REF_WIDTH, height);
}

/** Resolve one note's pixel position from relative, legacy, or fallback coords. */
export function resolveNotePosition(
  m: Milestone,
  canvasW: number,
  canvasH: number,
  serpentineFallback: BoardPos,
  noteCount: number,
  cols: number,
): BoardPos {
  if (canvasW <= 0 || canvasH <= 0) {
    return serpentineFallback;
  }

  if (hasRelativeBoardPosition(m)) {
    return relativeToPixel(m.boardRelX!, m.boardRelY!, canvasW, canvasH);
  }

  const legacyRel = legacyPixelsToRelative(m, noteCount, cols);
  if (legacyRel) {
    return relativeToPixel(legacyRel.relX, legacyRel.relY, canvasW, canvasH);
  }

  return serpentineFallback;
}

/** Serpentine fallback when admin has not set a default position. */
export function buildSerpentineLayout(
  items: Milestone[],
  cols: number,
): BoardPos[] {
  if (items.length === 0) return [];
  return items.map((m, i) => {
    const row = Math.floor(i / cols);
    const colInRow = i % cols;
    const col = row % 2 === 0 ? colInRow : cols - 1 - colInRow;
    const { w } = noteSize(normalizeMilestoneType(m.type));
    return {
      x: BOARD_PAD + col * (SLOT_W + GAP_X) + (SLOT_W - w) / 2,
      y: BOARD_PAD + row * (ROW_H + GAP_Y),
    };
  });
}

export function boardHeightFor(count: number, cols: number): number {
  if (count === 0) return 480;
  const rows = Math.ceil(count / cols);
  return BOARD_PAD * 2 + rows * (ROW_H + GAP_Y) - GAP_Y + 48;
}

/** Admin default, legacy migration, or serpentine fallback for each note. */
export function resolveDefaultLayout(
  ordered: Milestone[],
  cols: number,
  canvasW: number,
  canvasH: number,
): Record<string, BoardPos> {
  const serpentine = buildSerpentineLayout(ordered, cols);
  const fallbackW = canvasW > 0 ? canvasW : BOARD_REF_WIDTH;
  const fallbackH =
    canvasH > 0 ? canvasH : boardHeightFor(ordered.length, cols);
  const out: Record<string, BoardPos> = {};

  ordered.forEach((m, i) => {
    out[m.id] = resolveNotePosition(
      m,
      fallbackW,
      fallbackH,
      serpentine[i] ?? { x: BOARD_PAD, y: BOARD_PAD },
      ordered.length,
      cols,
    );
  });
  return out;
}

export const TYPE_LABELS: Record<MilestoneType, string> = {
  moc: "Cột mốc",
  thanh_tich: "Thành tích",
  alumni: "Cựu thành viên",
  photo: "Khung ảnh",
};

export const TYPE_CHIP: Record<MilestoneType, string> = {
  moc: "bg-[#e8f1fc] text-[#1a3560] border-[#b8cfe8]",
  thanh_tich: "bg-[#fff6e5] text-[#4a3d18] border-[#edd9a8]",
  alumni: "bg-[#e9f7ef] text-[#1a4530] border-[#b5dfc8]",
  photo: "bg-[#faf9f6] text-[#2b241f] border-[#ddd8cf]",
};

import {
  pixelToRelative,
  relativeToPixel,
  type BoardPos,
} from "@/app/lib/milestoneBoard";

export const VISITOR_NOTE_KEY = "o365_story_visitor_note_v1";
export const VISITOR_NOTE_ID = "visitor-note";

export const VISITOR_HEADLINE_MAX = 40;
export const VISITOR_MESSAGE_MAX = 100;

export type VisitorNote = {
  headline: string;
  message?: string;
  dateLabel: string;
  createdAt: string;
  /** Relative X on the extended story board (0–1). */
  relX?: number;
  /** Relative Y on the extended story board (0–1). */
  relY?: number;
};

export function formatVisitorDateLabel(date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${month}/${date.getFullYear()}`;
}

function trimText(value: string, max: number): string {
  return value.trim().slice(0, max);
}

export function sanitizeVisitorHeadline(value: string): string {
  return trimText(value.replace(/\s+/g, " "), VISITOR_HEADLINE_MAX);
}

export function sanitizeVisitorMessage(value: string): string | undefined {
  const trimmed = trimText(value.replace(/\s+/g, " "), VISITOR_MESSAGE_MAX);
  return trimmed.length > 0 ? trimmed : undefined;
}

export function loadVisitorNote(): VisitorNote | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(VISITOR_NOTE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as VisitorNote;
    if (!parsed?.headline?.trim()) return null;
    return {
      headline: sanitizeVisitorHeadline(parsed.headline),
      message: parsed.message
        ? sanitizeVisitorMessage(parsed.message)
        : undefined,
      dateLabel: parsed.dateLabel || formatVisitorDateLabel(),
      createdAt: parsed.createdAt || new Date().toISOString(),
      relX:
        typeof parsed.relX === "number" && Number.isFinite(parsed.relX)
          ? Math.max(0, Math.min(1, parsed.relX))
          : undefined,
      relY:
        typeof parsed.relY === "number" && Number.isFinite(parsed.relY)
          ? Math.max(0, Math.min(1, parsed.relY))
          : undefined,
    };
  } catch {
    return null;
  }
}

export function saveVisitorNote(note: VisitorNote): void {
  try {
    localStorage.setItem(VISITOR_NOTE_KEY, JSON.stringify(note));
  } catch {
    /* ignore quota / private mode */
  }
}

export function removeVisitorNote(): void {
  try {
    localStorage.removeItem(VISITOR_NOTE_KEY);
  } catch {
    /* ignore */
  }
}

export function createVisitorNote(
  headline: string,
  message?: string,
): VisitorNote {
  return {
    headline: sanitizeVisitorHeadline(headline),
    message: message ? sanitizeVisitorMessage(message) : undefined,
    dateLabel: formatVisitorDateLabel(),
    createdAt: new Date().toISOString(),
  };
}

export function visitorNoteWithPosition(
  note: VisitorNote,
  pos: BoardPos,
  canvasW: number,
  canvasH: number,
): VisitorNote {
  return {
    ...note,
    ...pixelToRelative(pos.x, pos.y, canvasW, canvasH),
  };
}

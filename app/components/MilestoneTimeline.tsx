"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  motion,
  AnimatePresence,
  animate,
  useMotionValue,
  useInView,
} from "motion/react";
import { Loader2 } from "lucide-react";
import { subscribeMilestones, subscribePosts } from "@/app/lib/firestoreService";
import { MILESTONES } from "@/app/data/clubData";
import NoteModalRouter from "@/app/components/milestone-modals/NoteModalRouter";
import { alumniInitials } from "@/app/components/milestone-modals/milestoneModalUtils";
import type { BlogPost, Milestone, MilestoneType } from "@/app/types";
import {
  BOARD_PAD,
  BOARD_REF_WIDTH,
  DESKTOP_COLS,
  TYPE_LABELS,
  buildSerpentineLayout,
  isThreaded,
  normalizeMilestoneType,
  notePinOffsetX,
  noteSize,
  noteTapeTilt,
  noteTilt,
  PHOTO_FRAME_IMAGE_CLASS,
  PHOTO_FRAME_PADDING_CLASS,
  pixelToRelative,
  relativeToPixel,
  resolveDefaultLayout,
  sortKeyOf,
  positionCanvasHeight,
  visitorBoardHeight,
  visitorNoteCtaSlot,
  visitorNoteSlot,
  type BoardRelPos,
} from "@/app/lib/milestoneBoard";
import {
  loadVisitorNote,
  removeVisitorNote,
  saveVisitorNote,
  VISITOR_NOTE_ID,
  type VisitorNote,
} from "@/app/lib/visitorNote";
import VisitorNoteCard from "@/app/components/story/VisitorNoteCard";
import VisitorNoteComposer from "@/app/components/story/VisitorNoteComposer";
import VisitorNotePatch from "@/app/components/story/VisitorNotePatch";

const POS_KEY = "o365_story_note_pos_v4";
const SESSION_REVEAL_KEY = "o365_story_revealed";
const LOADER_MIN_MS = 300;
const REVEAL_STAGGER_MS = 100;
const THREAD_DRAW_SPRING = { type: "spring" as const, stiffness: 70, damping: 22 };

const PIN_SPRING = { type: "spring" as const, stiffness: 380, damping: 28 };

const NOTE_TRANSFORM_ORIGIN = "50% 12px";
const PHOTO_TRANSFORM_ORIGIN = "50% 4px";

const PAPER_GRAIN =
  "repeating-linear-gradient(0deg, rgba(0,0,0,0.018) 0 1px, transparent 1px 4px), repeating-linear-gradient(90deg, rgba(0,0,0,0.012) 0 1px, transparent 1px 5px)";

type Pos = { x: number; y: number };

type NoteTheme = {
  outer: string;
  inner: string;
  lineColor: string;
  shadow: string;
  shadowHover: string;
  ink: string;
  inkMuted: string;
  accent: string;
  pin: string;
  tape: string;
};

const NOTE_THEMES: Record<MilestoneType, NoteTheme> = {
  moc: {
    outer: "#fde68a",
    inner: "#fffef7",
    lineColor: "rgba(180,83,9,0.12)",
    shadow:
      "1px 2px 0 rgba(0,0,0,0.04), 3px 6px 12px rgba(0,0,0,0.1), 6px 14px 24px rgba(180,130,40,0.12)",
    shadowHover:
      "2px 3px 0 rgba(0,0,0,0.06), 5px 10px 18px rgba(0,0,0,0.14), 10px 22px 32px rgba(180,130,40,0.16)",
    ink: "text-[#713f12]",
    inkMuted: "text-[#92400e]",
    accent: "text-[#b45309]",
    pin: "bg-[#f59e0b]",
    tape: "bg-[#fde68a]/90",
  },
  thanh_tich: {
    outer: "#f9a8d4",
    inner: "#fff5f9",
    lineColor: "rgba(190,24,93,0.1)",
    shadow:
      "1px 2px 0 rgba(0,0,0,0.04), 3px 6px 12px rgba(0,0,0,0.1), 6px 14px 24px rgba(219,39,119,0.1)",
    shadowHover:
      "2px 3px 0 rgba(0,0,0,0.06), 5px 10px 18px rgba(0,0,0,0.14), 10px 22px 32px rgba(219,39,119,0.14)",
    ink: "text-[#831843]",
    inkMuted: "text-[#9d174d]",
    accent: "text-[#be185d]",
    pin: "bg-[#ec4899]",
    tape: "bg-[#fbcfe8]/90",
  },
  alumni: {
    outer: "#86efac",
    inner: "#f0fdf4",
    lineColor: "rgba(21,128,61,0.1)",
    shadow:
      "1px 2px 0 rgba(0,0,0,0.04), 3px 6px 12px rgba(0,0,0,0.1), 6px 14px 24px rgba(34,197,94,0.1)",
    shadowHover:
      "2px 3px 0 rgba(0,0,0,0.06), 5px 10px 18px rgba(0,0,0,0.14), 10px 22px 32px rgba(34,197,94,0.14)",
    ink: "text-[#14532d]",
    inkMuted: "text-[#166534]",
    accent: "text-[#15803d]",
    pin: "bg-[#22c55e]",
    tape: "bg-[#bbf7d0]/90",
  },
  photo: {
    outer: "#fcd9b6",
    inner: "#fffaf5",
    lineColor: "rgba(124,45,18,0.08)",
    shadow:
      "1px 2px 0 rgba(0,0,0,0.05), 3px 6px 12px rgba(0,0,0,0.12), 6px 14px 24px rgba(0,0,0,0.1)",
    shadowHover:
      "2px 3px 0 rgba(0,0,0,0.07), 5px 10px 18px rgba(0,0,0,0.16), 10px 22px 32px rgba(0,0,0,0.14)",
    ink: "text-[#431407]",
    inkMuted: "text-[#7c2d12]",
    accent: "text-[#c2410c]",
    pin: "bg-[#a8a29e]",
    tape: "bg-[#fde68a]/85",
  },
};

function normalizeType(type: unknown): MilestoneType {
  return normalizeMilestoneType(type);
}

function previewOf(m: Milestone): string | undefined {
  const type = normalizeType(m.type);
  if (type === "photo") return undefined;
  if (type === "alumni") {
    return [m.alumniRole, m.alumniQuote].filter(Boolean).join(" — ") || undefined;
  }
  return m.description;
}

function titleOf(m: Milestone): string {
  const type = normalizeType(m.type);
  if (type === "alumni") return m.alumniName || m.title;
  return m.title;
}

/* ───────────────────────── Shared bits ───────────────────────── */

function MaskingTape({
  className = "",
  rotate = -2.5,
  color,
}: {
  className?: string;
  rotate?: number;
  color: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`absolute left-1/2 z-30 h-[18px] w-[58px] -translate-x-1/2 rounded-[1px] shadow-[0_1px_2px_rgba(0,0,0,0.15)] ${color} ${className}`}
      style={{ rotate: `${rotate}deg`, top: "-10px" }}
    />
  );
}

function StickyNoteFace({
  theme,
  isDragging,
  children,
}: {
  theme: NoteTheme;
  isDragging?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`relative aspect-square w-full rounded-2xl p-2 transition-[transform,box-shadow] duration-200 ${
        isDragging ? "scale-[1.02]" : "group-hover:-translate-y-0.5"
      }`}
      style={{
        backgroundColor: theme.outer,
        backgroundImage: PAPER_GRAIN,
        boxShadow: isDragging ? theme.shadowHover : theme.shadow,
      }}
    >
      <div
        className="flex h-full min-h-0 flex-col rounded-xl p-2.5"
        style={{
          backgroundColor: theme.inner,
          backgroundImage: PAPER_GRAIN,
        }}
      >
        <div
          className="flex min-h-0 flex-1 flex-col rounded-lg px-1.5 py-1"
          style={{
            backgroundImage: `${PAPER_GRAIN}, repeating-linear-gradient(transparent, transparent 17px, ${theme.lineColor} 17px, ${theme.lineColor} 18px)`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Note card ───────────────────────── */

function RevealDebugBadge({
  noteIndex,
  isRevealed,
  inView,
  maxRevealed,
  threaded,
}: {
  noteIndex: number;
  isRevealed: boolean;
  inView: boolean;
  maxRevealed: number;
  threaded: boolean;
}) {
  return (
    <span
      className={`absolute bottom-1 right-1 z-40 rounded px-1.5 py-0.5 font-mono text-[9px] leading-tight text-white shadow-sm pointer-events-none ${
        isRevealed ? "bg-emerald-700/90" : "bg-black/75"
      }`}
    >
      #{noteIndex} {isRevealed ? "pinned" : "waiting"}
      {inView ? " · view" : ""}
      {!threaded ? " · ∅thread" : ""}
      <span className="opacity-70"> · max {maxRevealed}</span>
    </span>
  );
}

interface NoteProps {
  milestone: Milestone;
  noteIndex: number;
  layout: Pos;
  savedPos: Pos | undefined;
  dragEnabled: boolean;
  reducedMotion: boolean;
  measureOnly: boolean;
  isRevealed: boolean;
  animateReveal: boolean;
  debugReveal: boolean;
  maxRevealed: number;
  constraintsRef: React.RefObject<HTMLDivElement | null>;
  registerPin: (id: string, el: HTMLSpanElement | null) => void;
  onOpen: (id: string, el: HTMLElement) => void;
  onCommitPos: (id: string, pos: Pos) => void;
  onMove: () => void;
  onEnterView: (index: number) => void;
}

function Note({
  milestone,
  noteIndex,
  layout,
  savedPos,
  dragEnabled,
  reducedMotion,
  measureOnly,
  isRevealed,
  animateReveal,
  debugReveal,
  maxRevealed,
  constraintsRef,
  registerPin,
  onOpen,
  onCommitPos,
  onMove,
  onEnterView,
}: NoteProps) {
  const type = normalizeType(milestone.type);
  const theme = NOTE_THEMES[type];
  const { w, h } = noteSize(type);
  const label = TYPE_LABELS[type];
  const title = titleOf(milestone);
  const preview = previewOf(milestone);
  const dateLabel = milestone.dateLabel || String(milestone.year);
  const isPhoto = type === "photo";
  const isAlumni = type === "alumni";
  const cover = milestone.images?.[0];
  const threaded = isThreaded(milestone);
  const tilt = noteTilt(milestone.id);
  const pinOffsetX = notePinOffsetX(milestone.id);
  const tapeTilt = noteTapeTilt(milestone.id);

  const base = savedPos ?? layout;
  const x = useMotionValue(base.x);
  const y = useMotionValue(base.y);
  const [isDragging, setIsDragging] = useState(false);
  const wasDragged = useRef(false);
  const noteRef = useRef<HTMLLIElement>(null);
  const inView = useInView(noteRef, { amount: 0.3, once: true });

  const debugBadge = debugReveal ? (
    <RevealDebugBadge
      noteIndex={noteIndex}
      isRevealed={isRevealed}
      inView={inView}
      maxRevealed={maxRevealed}
      threaded={threaded}
    />
  ) : null;

  useEffect(() => {
    const next = savedPos ?? layout;
    x.set(next.x);
    y.set(next.y);
  }, [savedPos, layout.x, layout.y, x, y]);

  useEffect(() => {
    if (measureOnly || !animateReveal || !inView) return;
    onEnterView(noteIndex);
  }, [inView, measureOnly, animateReveal, noteIndex, onEnterView]);

  const dragProps = {
    drag: dragEnabled as true | false,
    dragConstraints: constraintsRef,
    dragMomentum: false,
    dragElastic: 0.08,
    onDragStart: () => {
      setIsDragging(true);
      wasDragged.current = true;
    },
    onDrag: onMove,
    onDragEnd: () => {
      setIsDragging(false);
      onCommitPos(milestone.id, { x: x.get(), y: y.get() });
      onMove();
      setTimeout(() => {
        wasDragged.current = false;
      }, 0);
    },
  };

  const showContent = measureOnly || isRevealed || !animateReveal;
  const pinHidden = animateReveal && !isRevealed && !measureOnly;

  const contentMotion = measureOnly
    ? { opacity: 0, y: 0, scale: 1 }
    : animateReveal
      ? isRevealed
        ? { opacity: 1, y: 0, scale: 1 }
        : { opacity: 0, y: -28, scale: 0.88 }
      : { opacity: 1, y: 0, scale: 1 };

  const liClass = `absolute list-none ${
    dragEnabled ? "cursor-grab active:cursor-grabbing" : ""
  } ${isDragging ? "z-50" : showContent ? "z-10" : "z-0"} ${
    showContent && !measureOnly ? "" : "pointer-events-none"
  }`;

  const noteMotionStyle = {
    x,
    y,
    rotate: isDragging || reducedMotion ? 0 : tilt,
    width: w,
    transformOrigin: isPhoto ? PHOTO_TRANSFORM_ORIGIN : NOTE_TRANSFORM_ORIGIN,
  } as const;

  if (isPhoto) {
    return (
      <motion.li
        ref={noteRef}
        className={liClass}
        style={noteMotionStyle}
        aria-hidden={!showContent || measureOnly}
        {...dragProps}
      >
        <motion.div
          initial={animateReveal ? { opacity: 0, y: -28, scale: 0.88 } : false}
          animate={contentMotion}
          transition={animateReveal && isRevealed ? PIN_SPRING : { duration: 0 }}
        >
          <span
            ref={(el) => registerPin(milestone.id, el)}
            aria-hidden="true"
            className={`absolute top-0 z-20 h-3 w-3 -translate-x-1/2 transition-opacity ${
              pinHidden ? "opacity-0" : "opacity-100"
            }`}
            style={{ left: `calc(50% + ${pinOffsetX}px)` }}
          />

          <button
            type="button"
            onPointerDown={() => {
              wasDragged.current = false;
            }}
            onClick={(e) => {
              if (wasDragged.current || !showContent || measureOnly) return;
              onOpen(milestone.id, e.currentTarget);
            }}
            tabIndex={showContent && !measureOnly ? 0 : -1}
            aria-label={`${label} ${dateLabel}: ${title}. Nhấn để xem chi tiết.`}
            className={`group relative block w-full text-left focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
              isDragging ? "scale-[1.02]" : ""
            }`}
          >
            <MaskingTape color={theme.tape} rotate={tapeTilt} />

            <div
              className={`relative overflow-hidden rounded-sm border-2 border-white/90 dark:border-[#e8e4dc]/20 ${PHOTO_FRAME_PADDING_CLASS}`}
              style={{
                backgroundColor: theme.inner,
                backgroundImage: PAPER_GRAIN,
                boxShadow: isDragging ? theme.shadowHover : theme.shadow,
              }}
            >
              <div
                className={`${PHOTO_FRAME_IMAGE_CLASS} overflow-hidden bg-neutral-100 outline outline-1 outline-black/8`}
              >
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cover}
                    alt={title}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[11px] text-neutral-400">
                    Chưa có ảnh
                  </div>
                )}
              </div>
              <p
                className={`mt-2 px-1 text-center font-display text-[12px] font-bold leading-snug ${theme.ink}`}
              >
                {title}
              </p>
              {dateLabel && (
                <p className={`mt-0.5 text-center font-mono text-[10px] tabular-nums ${theme.inkMuted}`}>
                  {dateLabel}
                </p>
              )}
            </div>

            <span className="mt-1.5 block text-center text-[10px] font-semibold text-accent opacity-0 transition-opacity group-hover:opacity-100">
              Xem →
            </span>
          </button>
          {debugBadge}
        </motion.div>
      </motion.li>
    );
  }

  if (isAlumni) {
    const avatar = milestone.alumniAvatar;
    const initials = alumniInitials(title);

    return (
      <motion.li
        ref={noteRef}
        className={liClass}
        style={noteMotionStyle}
        aria-hidden={!showContent || measureOnly}
        {...dragProps}
      >
        <motion.div
          initial={animateReveal ? { opacity: 0, y: -28, scale: 0.88 } : false}
          animate={contentMotion}
          transition={animateReveal && isRevealed ? PIN_SPRING : { duration: 0 }}
        >
          <span
            ref={(el) => registerPin(milestone.id, el)}
            aria-hidden="true"
            className={`absolute -top-2.5 z-20 h-4 w-4 -translate-x-1/2 transition-opacity ${
              pinHidden ? "opacity-0" : "opacity-100"
            }`}
            style={{ left: `calc(50% + ${pinOffsetX}px)` }}
          >
            <span
              className={`absolute inset-0 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.25)] ${theme.pin}`}
            />
            <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-[70%] -translate-y-[70%] rounded-full bg-white/80" />
          </span>

          <button
            type="button"
            onPointerDown={() => {
              wasDragged.current = false;
            }}
            onClick={(e) => {
              if (wasDragged.current || !showContent || measureOnly) return;
              onOpen(milestone.id, e.currentTarget);
            }}
            tabIndex={showContent && !measureOnly ? 0 : -1}
            aria-label={`${label} ${dateLabel}: ${title}. Nhấn để xem chi tiết.`}
            className="group relative block w-full text-left focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            <div
              className={`relative aspect-square w-full rounded-xl border-[3px] p-3 transition-[transform,box-shadow] duration-200 ${
                isDragging ? "scale-[1.02]" : "group-hover:-translate-y-0.5"
              }`}
              style={{
                borderColor: theme.outer,
                backgroundColor: theme.inner,
                backgroundImage: PAPER_GRAIN,
                boxShadow: isDragging ? theme.shadowHover : theme.shadow,
              }}
            >
              <div className="flex h-full flex-col items-center justify-center text-center">
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatar}
                    alt={title}
                    className="h-16 w-16 rounded-full border-[3px] object-cover shadow-sm"
                    style={{ borderColor: theme.outer }}
                    draggable={false}
                  />
                ) : (
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-full border-[3px] font-display text-lg font-bold shadow-sm ${theme.ink}`}
                    style={{
                      borderColor: theme.outer,
                      backgroundColor: theme.outer,
                    }}
                  >
                    {initials || "?"}
                  </div>
                )}

                <h3
                  className={`mt-2 font-display text-[13px] font-bold leading-snug tracking-tight text-pretty ${theme.ink}`}
                >
                  {title}
                </h3>

                {milestone.alumniRole && (
                  <p className={`mt-0.5 text-[10px] font-medium ${theme.inkMuted}`}>
                    {milestone.alumniRole}
                  </p>
                )}

                {preview && (
                  <p className={`mt-1 line-clamp-2 text-[10px] italic leading-snug ${theme.inkMuted}`}>
                    {preview}
                  </p>
                )}
              </div>
            </div>

            <span
              className={`mt-1.5 block text-center text-[10px] font-semibold opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${theme.accent}`}
            >
              Xem chi tiết →
            </span>
          </button>
          {debugBadge}
        </motion.div>
      </motion.li>
    );
  }

  return (
    <motion.li
      ref={noteRef}
      className={liClass}
      style={noteMotionStyle}
      aria-hidden={!showContent || measureOnly}
      {...dragProps}
    >
      <motion.div
        initial={animateReveal ? { opacity: 0, y: -28, scale: 0.88 } : false}
        animate={contentMotion}
        transition={animateReveal && isRevealed ? PIN_SPRING : { duration: 0 }}
      >
        <span
          ref={(el) => registerPin(milestone.id, el)}
          aria-hidden="true"
          className={`absolute -top-2.5 z-20 h-4 w-4 -translate-x-1/2 transition-opacity ${
            pinHidden ? "opacity-0" : "opacity-100"
          }`}
          style={{ left: `calc(50% + ${pinOffsetX}px)` }}
        >
          <span
            className={`absolute inset-0 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.25)] ${theme.pin}`}
          />
          <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-[70%] -translate-y-[70%] rounded-full bg-white/80" />
        </span>

        <button
          type="button"
          onPointerDown={() => {
            wasDragged.current = false;
          }}
          onClick={(e) => {
            if (wasDragged.current || !showContent || measureOnly) return;
            onOpen(milestone.id, e.currentTarget);
          }}
          tabIndex={showContent && !measureOnly ? 0 : -1}
          aria-label={`${label} ${dateLabel}: ${title}. Nhấn để xem chi tiết.`}
          className="group relative block w-full text-left focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
        >
          <StickyNoteFace theme={theme} isDragging={isDragging}>
            <p className={`mb-1 font-mono text-[10px] font-semibold tabular-nums ${theme.inkMuted}`}>
              {dateLabel}
            </p>

            <h3
              className={`font-display text-[13px] font-bold leading-snug tracking-tight text-pretty ${theme.ink}`}
            >
              {title}
            </h3>

            {preview && (
              <p className={`mt-1 text-[11px] leading-relaxed line-clamp-3 ${theme.inkMuted}`}>
                {preview}
              </p>
            )}

            <span
              className={`mt-auto inline-block pt-1.5 text-[10px] font-semibold opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${theme.accent}`}
            >
              Xem chi tiết →
            </span>
          </StickyNoteFace>
        </button>
        {debugBadge}
      </motion.div>
    </motion.li>
  );
}

/* ───────────────────────── Animated thread ───────────────────────── */

type ThreadPoint = { x: number; y: number };

function polylineLength(points: ThreadPoint[]): number {
  let len = 0;
  for (let i = 1; i < points.length; i++) {
    len += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
  }
  return len;
}

function pointAtLength(points: ThreadPoint[], targetLen: number): ThreadPoint {
  if (points.length === 0) return { x: 0, y: 0 };
  if (targetLen <= 0) return points[0];

  let acc = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    const seg = Math.hypot(dx, dy);
    if (acc + seg >= targetLen) {
      const t = seg > 0 ? (targetLen - acc) / seg : 0;
      return { x: points[i - 1].x + dx * t, y: points[i - 1].y + dy * t };
    }
    acc += seg;
  }
  return points[points.length - 1];
}

function activeThreadPoints(
  points: ThreadPoint[],
  drawnPinCount: number,
  pointCount: number,
): ThreadPoint[] {
  if (pointCount <= drawnPinCount || pointCount < 2) return [];
  if (drawnPinCount >= 1) return points.slice(drawnPinCount - 1, pointCount);
  return points.slice(0, pointCount);
}

function polylineAttr(points: ThreadPoint[]): string {
  return points.map((p) => `${p.x},${p.y}`).join(" ");
}

const THREAD_STROKE = {
  fill: "none" as const,
  stroke: "var(--accent)",
  strokeWidth: 1.5,
  strokeOpacity: 0.45,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
};

function AnimatedThread({
  points,
  width,
  height,
  showFull,
  reducedMotion,
  drawnPinCount,
  onDrawComplete,
  animTargetRef,
}: {
  points: ThreadPoint[];
  width: number;
  height: number;
  showFull: boolean;
  reducedMotion: boolean;
  drawnPinCount: number;
  onDrawComplete: (pinCount: number) => void;
  animTargetRef: React.MutableRefObject<number>;
}) {
  const activeDash = useMotionValue(1);
  const pointsRef = useRef(points);
  const animRef = useRef<ReturnType<typeof animate> | null>(null);
  const segmentStartDrawnRef = useRef(drawnPinCount);
  const lastSizeRef = useRef({ w: width, h: height });
  pointsRef.current = points;
  if (width > 0) lastSizeRef.current.w = width;
  if (height > 0) lastSizeRef.current.h = height;

  const [lead, setLead] = useState<ThreadPoint | null>(null);
  const pointCount = points.length;

  useEffect(() => {
    return () => {
      animRef.current?.stop();
    };
  }, []);

  useLayoutEffect(() => {
    if (pointCount < 2) return;

    if (reducedMotion || showFull) {
      animRef.current?.stop();
      activeDash.set(0);
      setLead(null);
      animTargetRef.current = pointCount;
      onDrawComplete(pointCount);
      return;
    }

    if (pointCount <= drawnPinCount) {
      animRef.current?.stop();
      activeDash.set(0);
      setLead(null);
      animTargetRef.current = pointCount;
      return;
    }

    if (pointCount <= animTargetRef.current) return;

    const pts = pointsRef.current;
    const active = activeThreadPoints(pts, drawnPinCount, pointCount);
    if (active.length < 2) return;

    const continuingMidFlight = animTargetRef.current > drawnPinCount;
    animTargetRef.current = pointCount;

    if (!continuingMidFlight) {
      segmentStartDrawnRef.current = drawnPinCount;
      activeDash.set(1);
    }

    animRef.current?.stop();
    animRef.current = animate(activeDash, 0, {
      ...THREAD_DRAW_SPRING,
      onUpdate: (v) => {
        const current = pointsRef.current;
        const activePts = activeThreadPoints(
          current,
          segmentStartDrawnRef.current,
          animTargetRef.current,
        );
        if (activePts.length < 2) return;
        const len = polylineLength(activePts);
        setLead(pointAtLength(activePts, (1 - v) * len));
      },
      onComplete: () => {
        const target = animTargetRef.current;
        const current = pointsRef.current;
        setLead(current[target - 1] ?? null);
        onDrawComplete(target);
      },
    });
  }, [
    pointCount,
    drawnPinCount,
    showFull,
    reducedMotion,
    activeDash,
    onDrawComplete,
    animTargetRef,
  ]);

  if (points.length < 2) return null;

  const svgW = width > 0 ? width : lastSizeRef.current.w;
  const svgH = height > 0 ? height : lastSizeRef.current.h;
  if (svgW <= 0 || svgH <= 0) return null;

  const showStatic = reducedMotion || showFull;
  const stablePoints =
    !showStatic && drawnPinCount >= 2 ? points.slice(0, drawnPinCount) : [];
  const activePoints =
    !showStatic && pointCount > drawnPinCount
      ? activeThreadPoints(points, drawnPinCount, pointCount)
      : [];
  // Hide active segment for one frame while dash offset is reset (avoids full-line flash).
  const suppressActiveFlash =
    !showStatic &&
    pointCount > drawnPinCount &&
    pointCount > animTargetRef.current &&
    animTargetRef.current <= drawnPinCount;

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-0"
      width={svgW}
      height={svgH}
      aria-hidden="true"
    >
      {showStatic ? (
        <polyline
          points={polylineAttr(points)}
          {...THREAD_STROKE}
        />
      ) : (
        <>
          {stablePoints.length >= 2 && (
            <polyline points={polylineAttr(stablePoints)} {...THREAD_STROKE} />
          )}
          {activePoints.length >= 2 && !suppressActiveFlash && (
            <motion.polyline
              points={polylineAttr(activePoints)}
              {...THREAD_STROKE}
              pathLength={1}
              strokeDasharray="1"
              initial={{ strokeDashoffset: 1 }}
              style={{ strokeDashoffset: activeDash }}
            />
          )}
        </>
      )}
      {lead && !showStatic && (
        <circle
          cx={lead.x}
          cy={lead.y}
          r={4}
          fill="var(--accent)"
          opacity={0.7}
        />
      )}
    </svg>
  );
}

/* ───────────────────────── Main ───────────────────────── */

export default function MilestoneTimeline() {
  const [milestones, setMilestones] = useState<Milestone[]>(MILESTONES);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [relativeOverrides, setRelativeOverrides] = useState<
    Record<string, BoardRelPos>
  >({});
  const [thread, setThread] = useState<{ x: number; y: number }[]>([]);
  const [boardSize, setBoardSize] = useState({ w: 0, h: 0 });
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });
  const [boardReady, setBoardReady] = useState(false);
  const [hasMeasured, setHasMeasured] = useState(false);
  const [skipScrollReveal, setSkipScrollReveal] = useState(false);
  const [maxRevealed, setMaxRevealed] = useState(-1);
  const [threadDrawnPinCount, setThreadDrawnPinCount] = useState(0);
  const [debugReveal, setDebugReveal] = useState(false);
  const [revealEpoch, setRevealEpoch] = useState(0);
  const [visitorNote, setVisitorNote] = useState<VisitorNote | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [visitorNoteHydrated, setVisitorNoteHydrated] = useState(false);

  const boardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLUListElement>(null);
  const pinRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
  const openerRef = useRef<HTMLElement | null>(null);
  const visitorOpenerRef = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const loaderMountTime = useRef(Date.now());
  const maxRevealedRef = useRef(-1);
  const revealTargetRef = useRef(-1);
  const revealTimersRef = useRef<number[]>([]);
  const pumpingRef = useRef(false);
  const threadDrawnPinCountRef = useRef(0);
  const threadAnimTargetRef = useRef(0);

  useEffect(() => {
    const unsub = subscribeMilestones((live) => setMilestones(live));
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = subscribePosts((posts) => setBlogPosts(posts));
    return () => unsub();
  }, []);

  const postsById = useMemo(() => {
    const map: Record<string, BlogPost> = {};
    for (const post of blogPosts) {
      map[post.id] = post;
    }
    return map;
  }, [blogPosts]);

  useEffect(() => {
    try {
      localStorage.removeItem("o365_story_note_pos_v3");
      const raw = localStorage.getItem(POS_KEY);
      if (raw) {
        setRelativeOverrides(JSON.parse(raw) as Record<string, BoardRelPos>);
      }
      if (sessionStorage.getItem(SESSION_REVEAL_KEY)) {
        setSkipScrollReveal(true);
      }
    } catch {
      /* ignore */
    }
    setDebugReveal(
      new URLSearchParams(window.location.search).has("debugReveal"),
    );
    setVisitorNote(loadVisitorNote());
    setVisitorNoteHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const deskMq = window.matchMedia("(min-width: 768px)");
    const update = () => {
      setReducedMotion(motionMq.matches);
      setIsDesktop(deskMq.matches);
    };
    update();
    motionMq.addEventListener("change", update);
    deskMq.addEventListener("change", update);
    return () => {
      motionMq.removeEventListener("change", update);
      deskMq.removeEventListener("change", update);
    };
  }, []);

  const ordered = useMemo(
    () =>
      [...milestones].sort((a, b) =>
        sortKeyOf(a).localeCompare(sortKeyOf(b)),
      ),
    [milestones],
  );

  const layoutCols = isDesktop ? DESKTOP_COLS : 1;
  const boardContentHeight = positionCanvasHeight(
    ordered.length,
    layoutCols,
  );
  const visitorZoneExtended = Boolean(visitorNote || composerOpen);
  const boardMinHeight = visitorBoardHeight(boardContentHeight, visitorZoneExtended);
  const boardMinWidth = isDesktop ? BOARD_REF_WIDTH : undefined;
  const canvasW = canvasSize.w || boardMinWidth || BOARD_REF_WIDTH;
  /** Official-note coord frame — matches admin board; excludes visitor strip. */
  const positionCanvasH = boardContentHeight;
  const visitorSlot = visitorNoteSlot(boardContentHeight, canvasW);
  const visitorCtaSlot = visitorNoteCtaSlot(boardContentHeight, canvasW);

  const serpentineMap = useMemo(() => {
    const serpentine = buildSerpentineLayout(ordered, layoutCols);
    const map: Record<string, Pos> = {};
    ordered.forEach((m, i) => {
      map[m.id] = serpentine[i] ?? { x: BOARD_PAD, y: BOARD_PAD };
    });
    return map;
  }, [ordered, layoutCols]);

  const defaultLayoutMap = useMemo(() => {
    if (!isDesktop) return serpentineMap;
    return resolveDefaultLayout(
      ordered,
      DESKTOP_COLS,
      canvasW,
      positionCanvasH,
    );
  }, [isDesktop, ordered, canvasW, positionCanvasH, serpentineMap]);

  const pixelOverrides = useMemo(() => {
    if (!isDesktop) return {} as Record<string, Pos>;
    const out: Record<string, Pos> = {};
    for (const [id, rel] of Object.entries(relativeOverrides)) {
      out[id] = relativeToPixel(rel.relX, rel.relY, canvasW, positionCanvasH);
    }
    return out;
  }, [isDesktop, relativeOverrides, canvasW, positionCanvasH]);

  const selected = useMemo(
    () => ordered.find((m) => m.id === selectedId) ?? null,
    [ordered, selectedId],
  );

  const effectiveSkipReveal = skipScrollReveal || reducedMotion;
  const animateReveal = boardReady && !effectiveSkipReveal;
  const fullyRevealed =
    effectiveSkipReveal ||
    maxRevealed >= ordered.length - 1 ||
    ordered.length === 0;

  const markSessionRevealed = useCallback(() => {
    try {
      sessionStorage.setItem(SESSION_REVEAL_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  const clearRevealTimers = useCallback(() => {
    revealTimersRef.current.forEach((id) => window.clearTimeout(id));
    revealTimersRef.current = [];
    pumpingRef.current = false;
  }, []);

  useEffect(() => {
    return () => clearRevealTimers();
  }, [clearRevealTimers]);

  useEffect(() => {
    if (effectiveSkipReveal && ordered.length > 0) {
      const last = ordered.length - 1;
      maxRevealedRef.current = last;
      revealTargetRef.current = last;
      setMaxRevealed(last);
    }
  }, [effectiveSkipReveal, ordered.length]);

  const handleSkipReveal = useCallback(() => {
    clearRevealTimers();
    const last = Math.max(0, ordered.length - 1);
    maxRevealedRef.current = last;
    revealTargetRef.current = last;
    setSkipScrollReveal(true);
    setMaxRevealed(last);
    markSessionRevealed();
    scheduleMeasureRef.current?.();
  }, [clearRevealTimers, ordered.length, markSessionRevealed]);

  const handleResetReveal = useCallback(() => {
    clearRevealTimers();
    try {
      sessionStorage.removeItem(SESSION_REVEAL_KEY);
    } catch {
      /* ignore */
    }
    maxRevealedRef.current = -1;
    revealTargetRef.current = -1;
    threadDrawnPinCountRef.current = 0;
    threadAnimTargetRef.current = 0;
    pumpingRef.current = false;
    setSkipScrollReveal(false);
    setMaxRevealed(-1);
    setThreadDrawnPinCount(0);
    setThread([]);
    setRevealEpoch((e) => e + 1);
    scheduleMeasureRef.current?.();
    boardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [clearRevealTimers]);

  const handleNoteEnterView = useCallback(
    (index: number) => {
      if (!boardReady || effectiveSkipReveal) return;
      if (index <= maxRevealedRef.current) return;

      revealTargetRef.current = Math.max(revealTargetRef.current, index);
      if (pumpingRef.current) return;

      const pump = () => {
        const next = maxRevealedRef.current + 1;
        if (next > revealTargetRef.current) {
          pumpingRef.current = false;
          return;
        }

        maxRevealedRef.current = next;
        setMaxRevealed(next);
        scheduleMeasureRef.current?.();

        if (next >= ordered.length - 1) {
          markSessionRevealed();
          setSkipScrollReveal(true);
          pumpingRef.current = false;
          return;
        }

        if (next < revealTargetRef.current) {
          const timerId = window.setTimeout(pump, REVEAL_STAGGER_MS);
          revealTimersRef.current.push(timerId);
        } else {
          pumpingRef.current = false;
        }
      };

      pumpingRef.current = true;
      pump();
    },
    [boardReady, effectiveSkipReveal, ordered.length, markSessionRevealed],
  );

  const handleThreadDrawComplete = useCallback((pinCount: number) => {
    const next = Math.max(threadDrawnPinCountRef.current, pinCount);
    threadDrawnPinCountRef.current = next;
    threadAnimTargetRef.current = next;
    setThreadDrawnPinCount(next);
  }, []);

  useEffect(() => {
    if (fullyRevealed && thread.length > 0) {
      threadDrawnPinCountRef.current = thread.length;
      threadAnimTargetRef.current = thread.length;
      setThreadDrawnPinCount(thread.length);
    }
  }, [fullyRevealed, thread.length]);

  const expectedThreadPinCount = useMemo(() => {
    let count = 0;
    for (let i = 0; i <= maxRevealed && i < ordered.length; i++) {
      if (isThreaded(ordered[i])) count++;
    }
    if (visitorNote && fullyRevealed) count++;
    return count;
  }, [ordered, maxRevealed, visitorNote, fullyRevealed]);

  const registerPin = useCallback(
    (id: string, el: HTMLSpanElement | null) => {
      if (el) pinRefs.current.set(id, el);
      else pinRefs.current.delete(id);
      if (id === VISITOR_NOTE_ID) scheduleMeasureRef.current?.();
    },
    [],
  );

  const measureCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setCanvasSize({
      w: canvas.clientWidth,
      h: Math.max(canvas.clientHeight, boardMinHeight),
    });
  }, [boardMinHeight]);

  const measure = useCallback(() => {
    const board = boardRef.current;
    if (!board) return;
    const b = board.getBoundingClientRect();
    const pts: { x: number; y: number }[] = [];
    ordered.forEach((m, i) => {
      if (!isThreaded(m)) return;
      if (!fullyRevealed && i > maxRevealed) return;
      const pin = pinRefs.current.get(m.id);
      if (!pin) return;
      const r = pin.getBoundingClientRect();
      pts.push({
        x: r.left - b.left + r.width / 2,
        y: r.top - b.top + r.height / 2,
      });
    });
    if (visitorNote && fullyRevealed) {
      const visitorPin = pinRefs.current.get(VISITOR_NOTE_ID);
      if (visitorPin) {
        const r = visitorPin.getBoundingClientRect();
        pts.push({
          x: r.left - b.left + r.width / 2,
          y: r.top - b.top + r.height / 2,
        });
      }
    }
    setThread((prev) => {
      if (pts.length < expectedThreadPinCount && pts.length < prev.length) {
        return prev;
      }
      return pts;
    });
    setBoardSize({ w: board.clientWidth, h: board.clientHeight });
    measureCanvas();
    setHasMeasured(true);
  }, [
    ordered,
    measureCanvas,
    fullyRevealed,
    maxRevealed,
    expectedThreadPinCount,
    visitorNote,
  ]);

  const rafRef = useRef(0);
  const scheduleMeasure = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      measure();
    });
  }, [measure]);
  const scheduleMeasureRef = useRef(scheduleMeasure);
  scheduleMeasureRef.current = scheduleMeasure;

  useEffect(() => {
    scheduleMeasure();
    const timers = [120, 500, 900].map((ms) => setTimeout(measure, ms));
    const onScroll = () => scheduleMeasure();
    window.addEventListener("resize", scheduleMeasure);
    window.addEventListener("scroll", onScroll, { passive: true });
    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined" && canvasRef.current) {
      ro = new ResizeObserver(() => scheduleMeasure());
      ro.observe(canvasRef.current);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      timers.forEach(clearTimeout);
      window.removeEventListener("resize", scheduleMeasure);
      window.removeEventListener("scroll", onScroll);
      ro?.disconnect();
    };
  }, [measure, scheduleMeasure, milestones, relativeOverrides, defaultLayoutMap, boardMinHeight]);

  useEffect(() => {
    if (!hasMeasured || canvasSize.w <= 0 || canvasSize.h <= 0) return;

    const elapsed = Date.now() - loaderMountTime.current;
    const remaining = Math.max(0, LOADER_MIN_MS - elapsed);
    const timer = window.setTimeout(() => {
      setBoardReady(true);
      scheduleMeasureRef.current();
    }, remaining);
    return () => window.clearTimeout(timer);
  }, [hasMeasured, canvasSize.w, canvasSize.h]);

  const commitPos = useCallback(
    (id: string, pos: Pos) => {
      const { relX, relY } = pixelToRelative(
        pos.x,
        pos.y,
        canvasW,
        positionCanvasH,
      );
      setRelativeOverrides((prev) => {
        const next = { ...prev, [id]: { relX, relY } };
        try {
          localStorage.setItem(POS_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    [canvasW, positionCanvasH],
  );

  const resetPositions = useCallback(() => {
    setRelativeOverrides({});
    try {
      localStorage.removeItem(POS_KEY);
      localStorage.removeItem("o365_story_note_pos_v3");
    } catch {
      /* ignore */
    }
    scheduleMeasure();
  }, [scheduleMeasure]);

  const hasCustomPositions = Object.keys(relativeOverrides).length > 0;

  const handleOpen = (id: string, el: HTMLElement) => {
    openerRef.current = el;
    setSelectedId(id);
  };
  const handleClose = () => setSelectedId(null);

  const handleVisitorPatchClick = useCallback(() => {
    setComposerOpen(true);
  }, []);

  const handleVisitorCardOpen = useCallback((el: HTMLElement) => {
    visitorOpenerRef.current = el;
    setComposerOpen(true);
  }, []);

  const handleVisitorSave = useCallback((note: VisitorNote) => {
    saveVisitorNote(note);
    setVisitorNote(note);
    setComposerOpen(false);
    scheduleMeasureRef.current?.();
  }, []);

  const handleVisitorRemove = useCallback(() => {
    removeVisitorNote();
    setVisitorNote(null);
    setComposerOpen(false);
    scheduleMeasureRef.current?.();
  }, []);

  const handleComposerClose = useCallback(() => {
    setComposerOpen(false);
    visitorOpenerRef.current?.focus?.();
  }, []);

  useEffect(() => {
    scheduleMeasureRef.current?.();
  }, [visitorZoneExtended, visitorNote, composerOpen]);

  useEffect(() => {
    if (selectedId) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const t = requestAnimationFrame(() => closeRef.current?.focus());
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setSelectedId(null);
      };
      window.addEventListener("keydown", onKey);
      return () => {
        document.body.style.overflow = prevOverflow;
        cancelAnimationFrame(t);
        window.removeEventListener("keydown", onKey);
        openerRef.current?.focus?.();
      };
    }
  }, [selectedId]);

  return (
    <section
      id="story"
      className="relative py-16 sm:py-24"
      style={{ background: "var(--bg)" }}
    >
      <div className="mx-auto max-w-[var(--max-width)] px-5 sm:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-12">
          <div className="max-w-3xl">
            <p className="mb-3 font-display text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
              Hành trình o365
            </p>
            <h1 className="mb-3 font-display text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
              Những cột mốc của CLB o365 - HUST
            </h1>
            <p className="text-sm leading-relaxed text-ink-light text-pretty sm:text-base">
              Bảng ghi chú hành trình CLB — chạm vào từng mẩu giấy để đọc chi
              tiết
              {isDesktop
                ? ", hoặc kéo thả tự do trên bảng để sắp xếp theo ý bạn."
                : "."}{" "}
              Bạn cũng có thể ghim một ghi chú của riêng mình trên bảng.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {!reducedMotion && ordered.length > 0 && fullyRevealed && (
              <button
                type="button"
                onClick={handleResetReveal}
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-ink-light transition-colors hover:border-accent/40 hover:text-ink"
              >
                Xem lại hiệu ứng
              </button>
            )}
            {isDesktop && hasCustomPositions && (
              <button
                type="button"
                onClick={resetPositions}
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-ink-light transition-colors hover:border-accent/40 hover:text-ink"
              >
                Đặt lại vị trí
              </button>
            )}
          </div>
        </div>

        {ordered.length === 0 ? (
          <div className="rounded-3xl border border-border bg-surface px-6 py-16 text-center">
            <p className="text-sm font-semibold text-ink">
              Chưa có cột mốc nào được cập nhật.
            </p>
          </div>
        ) : (
          <motion.div
            className="story-board-frame"
            animate={{ minHeight: boardMinHeight }}
            transition={
              reducedMotion
                ? { duration: 0.12 }
                : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
            }
            style={{ minHeight: boardMinHeight }}
          >
            <div
              ref={boardRef}
              className="story-board-surface relative p-4 sm:p-6"
              aria-busy={!boardReady}
              aria-live="polite"
              style={{
                minHeight: boardMinHeight,
                minWidth: boardMinWidth,
                transition: reducedMotion
                  ? undefined
                  : "min-height 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
            {!boardReady && (
              <div
                className="absolute inset-0 z-40 flex flex-col items-center justify-center rounded-[0.9rem] bg-[#c9a87c]/90 backdrop-blur-sm dark:bg-[#3f362b]/90"
                aria-hidden="true"
              >
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
                <p className="mt-3 text-xs font-semibold text-ink-light">
                  Đang sắp xếp bảng ghi chú…
                </p>
              </div>
            )}

            {debugReveal && (
              <div className="absolute left-3 top-3 z-30 max-w-[220px] rounded-md border border-amber-500/50 bg-black/85 px-2 py-1.5 font-mono text-[10px] leading-snug text-amber-100 shadow-sm">
                <div>maxRevealed: {maxRevealed} / {ordered.length - 1}</div>
                <div>thread pins: {thread.length} (expect {expectedThreadPinCount})</div>
                <div>thread drawn: {threadDrawnPinCount} · animTarget {threadAnimTargetRef.current}</div>
                <div>fullyRevealed: {String(fullyRevealed)}</div>
                <button
                  type="button"
                  onClick={handleResetReveal}
                  className="mt-1.5 rounded border border-amber-400/40 px-1.5 py-0.5 text-[9px] font-semibold text-amber-100 hover:bg-amber-400/10"
                >
                  Reset reveal
                </button>
              </div>
            )}

            {animateReveal && !fullyRevealed && (
              <button
                type="button"
                onClick={handleSkipReveal}
                className="absolute right-3 top-3 z-30 rounded-md border border-border bg-surface/90 px-2.5 py-1 text-[11px] font-semibold text-ink-light shadow-sm backdrop-blur-sm transition-colors hover:border-accent/40 hover:text-ink sm:right-4 sm:top-4"
              >
                Bỏ qua hiệu ứng
              </button>
            )}

            <AnimatedThread
              key={revealEpoch}
              points={thread}
              width={boardSize.w}
              height={boardSize.h}
              showFull={fullyRevealed}
              reducedMotion={reducedMotion}
              drawnPinCount={threadDrawnPinCount}
              onDrawComplete={handleThreadDrawComplete}
              animTargetRef={threadAnimTargetRef}
            />

            <ul
              ref={canvasRef}
              className="relative z-10 m-0 min-h-[inherit] list-none p-0"
              style={{ minHeight: boardMinHeight }}
            >
              {ordered.map((m, i) => (
                <Note
                  key={`${m.id}-${revealEpoch}`}
                  milestone={m}
                  noteIndex={i}
                  layout={
                    defaultLayoutMap[m.id] ?? { x: BOARD_PAD, y: BOARD_PAD }
                  }
                  savedPos={pixelOverrides[m.id]}
                  dragEnabled={isDesktop && boardReady && fullyRevealed}
                  reducedMotion={reducedMotion}
                  measureOnly={!boardReady}
                  isRevealed={i <= maxRevealed}
                  animateReveal={animateReveal}
                  debugReveal={debugReveal}
                  maxRevealed={maxRevealed}
                  constraintsRef={boardRef}
                  registerPin={registerPin}
                  onOpen={handleOpen}
                  onCommitPos={commitPos}
                  onMove={scheduleMeasure}
                  onEnterView={handleNoteEnterView}
                />
              ))}

              {visitorNoteHydrated && boardReady && visitorNote && (
                <VisitorNoteCard
                  note={visitorNote}
                  x={visitorSlot.x}
                  y={visitorSlot.y}
                  reducedMotion={reducedMotion}
                  registerPin={registerPin}
                  onOpen={handleVisitorCardOpen}
                />
              )}

              {visitorNoteHydrated &&
                boardReady &&
                fullyRevealed &&
                !visitorNote &&
                !composerOpen && (
                  <VisitorNotePatch
                    x={visitorCtaSlot.x}
                    y={visitorCtaSlot.y}
                    pulse={fullyRevealed}
                    reducedMotion={reducedMotion}
                    onClick={handleVisitorPatchClick}
                  />
                )}
            </ul>
          </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <NoteModalRouter
            milestone={selected}
            postsById={postsById}
            onClose={handleClose}
            reducedMotion={reducedMotion}
            closeRef={closeRef}
          />
        )}
      </AnimatePresence>

      <VisitorNoteComposer
        open={composerOpen}
        initial={visitorNote}
        reducedMotion={reducedMotion}
        onSave={handleVisitorSave}
        onRemove={handleVisitorRemove}
        onClose={handleComposerClose}
      />
    </section>
  );
}

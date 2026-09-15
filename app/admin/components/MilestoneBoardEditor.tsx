"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, useMotionValue } from "motion/react";
import { Link2, Link2Off, Loader2 } from "lucide-react";
import type { Milestone } from "@/app/types";
import {
  BOARD_PAD,
  BOARD_REF_WIDTH,
  DESKTOP_COLS,
  TYPE_CHIP,
  TYPE_LABELS,
  boardHeightFor,
  hasBoardPosition,
  hasRelativeBoardPosition,
  isThreaded,
  normalizeMilestoneType,
  noteSize,
  pixelToRelative,
  resolveDefaultLayout,
  sortMilestones,
  type BoardPos,
} from "@/app/lib/milestoneBoard";

interface MilestoneBoardEditorProps {
  milestones: Milestone[];
  onSavePosition: (id: string, relX: number, relY: number) => Promise<void>;
  onToggleThreaded: (m: Milestone) => Promise<void>;
  onClearPositions?: () => Promise<void>;
}

interface AdminNoteProps {
  milestone: Milestone;
  layout: BoardPos;
  savingId: string | null;
  togglingId: string | null;
  constraintsRef: React.RefObject<HTMLDivElement | null>;
  canvasSize: { w: number; h: number };
  registerPin: (id: string, el: HTMLSpanElement | null) => void;
  onSavePosition: (id: string, relX: number, relY: number) => Promise<void>;
  onToggleThreaded: (m: Milestone) => Promise<void>;
  onMove: () => void;
}

function AdminNote({
  milestone,
  layout,
  savingId,
  togglingId,
  constraintsRef,
  canvasSize,
  registerPin,
  onSavePosition,
  onToggleThreaded,
  onMove,
}: AdminNoteProps) {
  const type = normalizeMilestoneType(milestone.type);
  const { w, h } = noteSize(type);
  const threaded = isThreaded(milestone);
  const title =
    type === "alumni" && milestone.alumniName
      ? milestone.alumniName
      : milestone.title;
  const dateLabel = milestone.dateLabel || String(milestone.year);
  const cover = milestone.images?.[0];
  const isPhoto = type === "photo";
  const isSaving = savingId === milestone.id;
  const isToggling = togglingId === milestone.id;

  const x = useMotionValue(layout.x);
  const y = useMotionValue(layout.y);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    x.set(layout.x);
    y.set(layout.y);
  }, [layout.x, layout.y, x, y]);

  return (
    <motion.li
      className={`absolute list-none cursor-grab active:cursor-grabbing ${
        isDragging ? "z-50" : "z-10"
      }`}
      style={{ x, y, width: w }}
      drag
      dragConstraints={constraintsRef}
      dragMomentum={false}
      dragElastic={0.08}
      onDragStart={() => setIsDragging(true)}
      onDrag={onMove}
      onDragEnd={async () => {
        setIsDragging(false);
        const { relX, relY } = pixelToRelative(
          x.get(),
          y.get(),
          canvasSize.w,
          canvasSize.h,
        );
        await onSavePosition(milestone.id, relX, relY);
        onMove();
      }}
    >
      <span
        ref={(el) => registerPin(milestone.id, el)}
        aria-hidden="true"
        className="absolute left-1/2 top-0 z-20 h-3 w-3 -translate-x-1/2"
      />

      <div
        className={`relative rounded-sm border shadow-md ${
          TYPE_CHIP[type]
        } ${isDragging ? "scale-[1.02] shadow-lg" : ""}`}
        style={{ minHeight: h }}
      >
        <div className="absolute right-1 top-1 z-30 flex items-center gap-1">
          {isSaving && (
            <Loader2 className="h-3.5 w-3.5 animate-spin opacity-70" />
          )}
          <button
            type="button"
            disabled={isToggling}
            onClick={(e) => {
              e.stopPropagation();
              void onToggleThreaded(milestone);
            }}
            title={
              threaded
                ? "Đang nối vào đường chỉ — nhấn để tách"
                : "Không nối đường chỉ — nhấn để nối"
            }
            className={`flex h-6 w-6 items-center justify-center rounded-md border transition-colors cursor-pointer disabled:opacity-50 ${
              threaded
                ? "border-accent/40 bg-accent/15 text-accent"
                : "border-border bg-surface/80 text-ink-muted hover:text-ink"
            }`}
          >
            {isToggling ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : threaded ? (
              <Link2 className="h-3 w-3" />
            ) : (
              <Link2Off className="h-3 w-3" />
            )}
          </button>
        </div>

        {isPhoto ? (
          <div className="p-2 pt-7">
            <div className="aspect-[4/5] overflow-hidden rounded-sm bg-neutral-100">
              {cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cover}
                  alt={title}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[10px] text-neutral-400">
                  Chưa có ảnh
                </div>
              )}
            </div>
            <p className="mt-1.5 truncate px-0.5 text-center text-[11px] font-bold">
              {title}
            </p>
          </div>
        ) : (
          <div className="p-3 pt-7">
            <p className="mb-1 font-mono text-[9px] font-bold uppercase tabular-nums opacity-70">
              {dateLabel}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wide opacity-60">
              {TYPE_LABELS[type]}
            </p>
            <p className="mt-1 line-clamp-3 text-[12px] font-bold leading-snug">
              {title}
            </p>
          </div>
        )}

        {hasBoardPosition(milestone) && hasRelativeBoardPosition(milestone) && (
          <span className="absolute bottom-1 left-1 rounded bg-ink/5 px-1 py-0.5 font-mono text-[8px] tabular-nums opacity-60">
            {Math.round(milestone.boardRelX! * 100)}%×
            {Math.round(milestone.boardRelY! * 100)}%
          </span>
        )}
      </div>
    </motion.li>
  );
}

export default function MilestoneBoardEditor({
  milestones,
  onSavePosition,
  onToggleThreaded,
  onClearPositions,
}: MilestoneBoardEditorProps) {
  const ordered = useMemo(() => sortMilestones(milestones), [milestones]);
  const boardMinHeight = boardHeightFor(ordered.length, DESKTOP_COLS);

  const boardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLUListElement>(null);
  const pinRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
  const [thread, setThread] = useState<{ x: number; y: number }[]>([]);
  const [boardSize, setBoardSize] = useState({ w: 0, h: 0 });
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });
  const [savingId, setSavingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  const layoutMap = useMemo(
    () =>
      resolveDefaultLayout(
        ordered,
        DESKTOP_COLS,
        canvasSize.w || BOARD_REF_WIDTH,
        canvasSize.h || boardMinHeight,
      ),
    [ordered, canvasSize.w, canvasSize.h, boardMinHeight],
  );

  const registerPin = useCallback(
    (id: string, el: HTMLSpanElement | null) => {
      if (el) pinRefs.current.set(id, el);
      else pinRefs.current.delete(id);
    },
    [],
  );

  const measureCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const board = boardRef.current;
    if (!canvas || !board) return;

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
    for (const m of ordered) {
      if (!isThreaded(m)) continue;
      const pin = pinRefs.current.get(m.id);
      if (!pin) continue;
      const r = pin.getBoundingClientRect();
      pts.push({
        x: r.left - b.left + r.width / 2,
        y: r.top - b.top + r.height / 2,
      });
    }
    setThread(pts);
    setBoardSize({ w: board.clientWidth, h: board.clientHeight });
    measureCanvas();
  }, [ordered, measureCanvas]);

  const rafRef = useRef(0);
  const scheduleMeasure = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      measure();
    });
  }, [measure]);

  useEffect(() => {
    scheduleMeasure();
    const timers = [120, 400].map((ms) => setTimeout(measure, ms));
    window.addEventListener("resize", scheduleMeasure);

    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined" && canvasRef.current) {
      ro = new ResizeObserver(() => scheduleMeasure());
      ro.observe(canvasRef.current);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      timers.forEach(clearTimeout);
      window.removeEventListener("resize", scheduleMeasure);
      ro?.disconnect();
    };
  }, [measure, scheduleMeasure, milestones, layoutMap, boardMinHeight]);

  const handleSavePosition = async (id: string, relX: number, relY: number) => {
    setSavingId(id);
    try {
      await onSavePosition(id, relX, relY);
    } finally {
      setSavingId(null);
    }
  };

  const handleToggleThreaded = async (m: Milestone) => {
    setTogglingId(m.id);
    try {
      await onToggleThreaded(m);
      scheduleMeasure();
    } finally {
      setTogglingId(null);
    }
  };

  const handleClear = async () => {
    if (!onClearPositions) return;
    setClearing(true);
    try {
      await onClearPositions();
      scheduleMeasure();
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/40 px-4 py-3">
        <p className="text-xs text-ink-light">
          Kéo thả từng ghi chú để đặt vị trí mặc định trên bảng công khai (tỷ lệ
          tương đối theo kích thước bảng). Trên mobile, bảng công khai dùng bố
          cục zigzag tự động. Nút liên kết bật/tắt việc nối vào đường chỉ thời
          gian.
        </p>
        {onClearPositions && (
          <button
            type="button"
            onClick={() => void handleClear()}
            disabled={clearing}
            className="shrink-0 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-ink-light transition-colors hover:border-accent/40 hover:text-ink disabled:opacity-50 cursor-pointer"
          >
            {clearing ? "Đang xóa..." : "Xóa vị trí đã lưu"}
          </button>
        )}
      </div>

      <div
        ref={boardRef}
        className="relative overflow-x-auto rounded-2xl border border-border-strong bg-card p-4 sm:p-6"
        style={{
          minHeight: boardMinHeight,
          minWidth: BOARD_REF_WIDTH,
          backgroundImage:
            "radial-gradient(var(--border) 1px, transparent 1.6px)",
          backgroundSize: "22px 22px",
        }}
      >
        {thread.length > 1 && (
          <svg
            className="pointer-events-none absolute inset-0 z-0"
            width={boardSize.w}
            height={boardSize.h}
            aria-hidden="true"
          >
            <polyline
              points={thread.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={1.5}
              strokeOpacity={0.45}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        )}

        <ul
          ref={canvasRef}
          className="relative z-10 m-0 min-h-[inherit] list-none p-0"
          style={{ minHeight: boardMinHeight }}
        >
          {ordered.map((m) => (
            <AdminNote
              key={m.id}
              milestone={m}
              layout={layoutMap[m.id] ?? { x: BOARD_PAD, y: BOARD_PAD }}
              savingId={savingId}
              togglingId={togglingId}
              constraintsRef={boardRef}
              canvasSize={{
                w: canvasSize.w || BOARD_REF_WIDTH,
                h: canvasSize.h || boardMinHeight,
              }}
              registerPin={registerPin}
              onSavePosition={handleSavePosition}
              onToggleThreaded={handleToggleThreaded}
              onMove={scheduleMeasure}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

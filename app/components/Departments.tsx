"use client";

import { useRef, useState, useLayoutEffect, useCallback } from "react";
import { motion, useMotionValue, animate } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, LayoutGrid, Rows3 } from "lucide-react";
import { DEPARTMENTS } from "@/app/data/clubData";
import type { Department } from "@/app/types";

/** Ban Chủ nhiệm sits in the middle of the operating bans. */
const OPERATING_DEPARTMENTS = DEPARTMENTS.filter((d) => d.id !== "ban-chu-nhiem");
const LEADERSHIP_DEPT = DEPARTMENTS.find((d) => d.id === "ban-chu-nhiem");
const midInsert = Math.floor(OPERATING_DEPARTMENTS.length / 2);
const CAROUSEL_DEPARTMENTS = LEADERSHIP_DEPT
  ? [
      ...OPERATING_DEPARTMENTS.slice(0, midInsert),
      LEADERSHIP_DEPT,
      ...OPERATING_DEPARTMENTS.slice(midInsert),
    ]
  : OPERATING_DEPARTMENTS;

type ViewMode = "carousel" | "grid";

const DRAG_THRESHOLD_PX = 12;

interface DepartmentCardProps {
  dept: Department;
  onActivate?: (id: string) => void;
  priority?: boolean;
}

function DepartmentCard({ dept, onActivate, priority = false }: DepartmentCardProps) {
  const router = useRouter();

  return (
    <div
      data-dept-id={dept.id}
      role="link"
      tabIndex={0}
      aria-label={dept.name}
      onClick={() => onActivate?.(dept.id)}
      onAuxClick={(event) => {
        if (!onActivate || event.button !== 1) return;
        event.preventDefault();
        window.open(`/departments/${dept.id}`, "_blank", "noopener,noreferrer");
      }}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        if (onActivate) {
          onActivate(dept.id);
        } else {
          router.push(`/departments/${dept.id}`);
        }
      }}
      className="w-full flex flex-col rounded-xl bg-surface border border-border hover:border-accent/50 shadow-card transition-all duration-300 hover:shadow-md hover:-translate-y-1 group relative overflow-hidden focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 cursor-pointer select-none"
    >
      <div className="relative w-full aspect-[16/11] pointer-events-none bg-card">
        <Image
          src={dept.image}
          alt={dept.name}
          fill
          draggable={false}
          sizes="(max-width: 640px) 260px, (max-width: 1024px) 300px, 320px"
          className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.03] pointer-events-none"
          priority={priority}
        />
        <div className="absolute inset-x-0 top-0 flex items-center p-2.5 sm:p-3">
          <span className="font-mono text-[10px] sm:text-[11px] font-semibold tracking-widest text-white/90 drop-shadow-sm">
            {dept.index}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-3.5 sm:p-4 pointer-events-none">
        <h3 className="font-extrabold text-base sm:text-lg text-ink tracking-tight uppercase line-clamp-1 group-hover:text-accent transition-colors mb-1">
          {dept.name}
        </h3>
        <p className="text-xs sm:text-sm font-medium text-ink-light italic mb-2 line-clamp-1">
          {dept.tagline}
        </p>
        <p className="text-sm leading-relaxed text-ink-light line-clamp-2">
          {dept.description}
          {dept.id === "chuyen-mon" && (
            <span className="block mt-1 text-ink-muted not-italic">
              Gồm Kĩ năng mềm &amp; Kĩ thuật
            </span>
          )}
        </p>

        {dept.leader && (
          <div className="pt-3 mt-auto border-t border-border/70">
            <p className="font-semibold text-ink text-xs sm:text-sm leading-tight truncate m-0">
              {dept.leader.name}
            </p>
            <p className="text-[11px] sm:text-xs text-ink-muted leading-tight truncate m-0">
              {dept.leader.role}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function snapToNearest(value: number, points: number[]): number {
  if (points.length === 0) return value;

  let nearest = points[0];
  let minDistance = Math.abs(value - nearest);

  for (const point of points) {
    const distance = Math.abs(value - point);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = point;
    }
  }

  return nearest;
}

function indexOfNearest(value: number, points: number[]): number {
  if (points.length === 0) return 0;

  let nearestIndex = 0;
  let minDistance = Math.abs(value - points[0]);

  for (let i = 1; i < points.length; i += 1) {
    const distance = Math.abs(value - points[i]);
    if (distance < minDistance) {
      minDistance = distance;
      nearestIndex = i;
    }
  }

  return nearestIndex;
}

export default function Departments() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const snapPointsRef = useRef<number[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("carousel");
  const [constraints, setConstraints] = useState<{ left: number; right: number }>({
    left: -800,
    right: 800,
  });
  const x = useMotionValue(0);

  /** Blocks card navigation right after a drag gesture. */
  const didDragRef = useRef(false);

  const [canDrag, setCanDrag] = useState(true);

  const springSnap = useCallback(
    (target: number) => {
      animate(x, target, {
        type: "spring",
        stiffness: 320,
        damping: 34,
      });
    },
    [x],
  );

  const handleCardActivate = useCallback(
    (id: string) => {
      if (didDragRef.current) return;
      router.push(`/departments/${id}`);
    },
    [router],
  );

  useLayoutEffect(() => {
    if (viewMode !== "carousel") return;

    const calculateLayout = () => {
      if (!containerRef.current) return;

      const isMobile = window.innerWidth < 640;
      const isTablet = window.innerWidth < 1024;
      const cardW = isMobile ? 260 : isTablet ? 300 : 320;
      const gapW = isMobile ? 16 : 20;
      const padX = isMobile ? 20 : 24;
      const step = cardW + gapW;
      const count = CAROUSEL_DEPARTMENTS.length;
      if (count < 1) return;

      const containerW = containerRef.current.clientWidth;
      const trackW = count * cardW + (count - 1) * gapW;
      const contentW = trackW + padX;

      if (contentW <= containerW) {
        const offset = (containerW - trackW) / 2 - padX;
        setConstraints({ left: offset, right: offset });
        snapPointsRef.current = [offset];
        setCanDrag(false);
        x.set(offset);
        return;
      }

      setCanDrag(true);
      const screenCenter = containerW / 2;
      const centerIndex = Math.floor(count / 2);
      const cardCenter = padX + centerIndex * step + cardW / 2;
      const initialCenterOffset = screenCenter - cardCenter;

      const firstCenter = padX + cardW / 2;
      const lastCenter = padX + (count - 1) * step + cardW / 2;
      const clearance = isMobile ? 40 : 80;
      const maxRight = screenCenter - firstCenter + clearance;
      const minLeft = screenCenter - lastCenter - clearance;

      const snapPoints: number[] = [];
      for (let point = maxRight; point >= minLeft; point -= step) {
        snapPoints.push(point);
      }
      if (snapPoints[snapPoints.length - 1] !== minLeft) {
        snapPoints.push(minLeft);
      }

      snapPointsRef.current = snapPoints;
      setConstraints({ left: minLeft, right: maxRight });

      const current = x.get();
      const isOutOfBounds =
        current < minLeft - 1 || current > maxRight + 1 || current === 0;
      if (isOutOfBounds) {
        x.set(initialCenterOffset);
      }
    };

    calculateLayout();
    const timer = window.setTimeout(calculateLayout, 200);
    window.addEventListener("resize", calculateLayout);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", calculateLayout);
    };
  }, [viewMode, x]);

  const shiftCarousel = useCallback(
    (direction: -1 | 1) => {
      if (!canDrag || snapPointsRef.current.length === 0) return;

      const current = x.get();
      const currentIndex = indexOfNearest(current, snapPointsRef.current);
      const nextIndex = Math.min(
        snapPointsRef.current.length - 1,
        Math.max(0, currentIndex - direction),
      );

      springSnap(snapPointsRef.current[nextIndex]);
    },
    [canDrag, springSnap, x],
  );

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number } }) => {
      const dragged = Math.abs(info.offset.x) > DRAG_THRESHOLD_PX;

      if (dragged) {
        didDragRef.current = true;
        const target = snapToNearest(x.get(), snapPointsRef.current);
        springSnap(target);
        window.setTimeout(() => {
          didDragRef.current = false;
        }, 120);
      }
    },
    [springSnap, x],
  );

  return (
    <section
      id="departments"
      className="relative py-16 sm:py-24 overflow-hidden select-none"
      style={{ background: "var(--bg)" }}
    >
      <div className="relative max-w-[var(--max-width)] mx-auto px-5 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink tracking-tight">
              Bộ Máy Hoạt Động o365
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-ink-light max-w-xl text-pretty">
              {CAROUSEL_DEPARTMENTS.length} ban chuyên trách kiến tạo sân chơi
              công nghệ và kỹ năng số cho sinh viên Bách Khoa.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Chế độ hiển thị ban"
            className="inline-flex items-center gap-1 p-1 rounded-xl border border-border bg-card shrink-0 self-start md:self-auto"
          >
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "carousel"}
              onClick={() => setViewMode("carousel")}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
                viewMode === "carousel"
                  ? "bg-ink text-surface shadow-xs"
                  : "text-ink-light hover:text-ink hover:bg-surface-hover"
              }`}
            >
              <Rows3 className="w-3.5 h-3.5" aria-hidden="true" />
              Carousel
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "grid"}
              onClick={() => setViewMode("grid")}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
                viewMode === "grid"
                  ? "bg-ink text-surface shadow-xs"
                  : "text-ink-light hover:text-ink hover:bg-surface-hover"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
              Thẻ
            </button>
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-6 mt-5 sm:mt-6">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
            {CAROUSEL_DEPARTMENTS.map((dept) => (
              <div
                key={dept.id}
                className="w-full min-w-0 sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
              >
                <DepartmentCard
                  dept={dept}
                  onActivate={(id) => router.push(`/departments/${id}`)}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="relative w-full overflow-hidden mt-5 sm:mt-6 py-5 sm:py-6"
        >
          {canDrag && (
            <>
              <div
                className="absolute inset-y-0 left-0 z-10 pointer-events-none w-10 sm:w-16 md:w-24"
                style={{
                  background:
                    "linear-gradient(to right, var(--bg) 0%, var(--bg) 20%, transparent 100%)",
                }}
                aria-hidden="true"
              />
              <div
                className="absolute inset-y-0 right-0 z-10 pointer-events-none w-10 sm:w-16 md:w-24"
                style={{
                  background:
                    "linear-gradient(to left, var(--bg) 0%, var(--bg) 20%, transparent 100%)",
                }}
                aria-hidden="true"
              />

              <button
                type="button"
                onClick={() => shiftCarousel(1)}
                aria-label="Cuộn sang trái"
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-card/95 border border-border text-ink flex items-center justify-center shadow-card hover:bg-surface-hover active:scale-[0.96] transition-[background-color,scale] duration-150 focus-visible:outline-2 focus-visible:outline-accent"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => shiftCarousel(-1)}
                aria-label="Cuộn sang phải"
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-card/95 border border-border text-ink flex items-center justify-center shadow-card hover:bg-surface-hover active:scale-[0.96] transition-[background-color,scale] duration-150 focus-visible:outline-2 focus-visible:outline-accent"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
              </button>
            </>
          )}

          <motion.div
            drag={canDrag ? "x" : false}
            dragConstraints={constraints}
            dragElastic={canDrag ? 0.1 : 0}
            dragMomentum={canDrag}
            onPointerDown={() => {
              didDragRef.current = false;
            }}
            onDrag={(_, info) => {
              if (Math.abs(info.offset.x) > DRAG_THRESHOLD_PX) {
                didDragRef.current = true;
              }
            }}
            onDragEnd={handleDragEnd}
            dragTransition={{
              power: 0.2,
              timeConstant: 200,
              bounceStiffness: 300,
              bounceDamping: 30,
            }}
            style={{ x, touchAction: canDrag ? "none" : "auto" }}
            whileTap={canDrag ? { cursor: "grabbing" } : undefined}
            className={`flex gap-4 sm:gap-5 will-change-transform pl-5 sm:pl-6 ${
              canDrag ? "cursor-grab active:cursor-grabbing" : "cursor-default"
            }`}
          >
            {CAROUSEL_DEPARTMENTS.map((dept, index) => {
              const centerIndex = Math.floor(CAROUSEL_DEPARTMENTS.length / 2);
              const isInitiallyVisible = Math.abs(index - centerIndex) <= 1;

              return (
              <div
                key={dept.id}
                className="w-[260px] sm:w-[300px] lg:w-[320px] shrink-0"
              >
                <DepartmentCard
                  dept={dept}
                  onActivate={handleCardActivate}
                  priority={isInitiallyVisible}
                />
              </div>
              );
            })}
          </motion.div>
        </div>
      )}
    </section>
  );
}

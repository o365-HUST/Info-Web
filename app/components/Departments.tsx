"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { DEPARTMENTS } from "@/app/data/clubData";

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

export default function Departments() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState<{ left: number; right: number }>({
    left: -800,
    right: 800,
  });
  const x = useMotionValue(0);

  /** True only after a real pan — blocks navigation to the department page. */
  const didDragRef = useRef(false);
  const pressRef = useRef<{ x: number; y: number; id: string | null } | null>(
    null,
  );

  const DRAG_THRESHOLD_PX = 12;

  const tryOpenDepartment = (id: string | null | undefined) => {
    if (!id || didDragRef.current) return;
    router.push(`/departments/${id}`);
  };

  const [canDrag, setCanDrag] = useState(true);

  // Center the track on Ban Chủ nhiệm (middle card); lock when all cards fit
  useEffect(() => {
    const calculateLayout = () => {
      if (!containerRef.current) return;
      const isMobile = window.innerWidth < 640;
      const isTablet = window.innerWidth < 1024;

      // Keep in sync with card width classes below
      const cardW = isMobile ? 260 : isTablet ? 300 : 320;
      const gapW = isMobile ? 16 : 20;
      const padX = isMobile ? 20 : 24;
      const step = cardW + gapW;
      const count = CAROUSEL_DEPARTMENTS.length;
      if (count < 1) return;

      const containerW = containerRef.current.clientWidth;
      const trackW = count * cardW + (count - 1) * gapW;
      const contentW = trackW + padX;

      // Wide / zoomed-out: all cards fit — center and disable drag
      if (contentW <= containerW) {
        const offset = (containerW - trackW) / 2 - padX;
        setConstraints({ left: offset, right: offset });
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

      setConstraints({ left: minLeft, right: maxRight });
      x.set(initialCenterOffset);
    };

    calculateLayout();
    const timer = setTimeout(calculateLayout, 200);
    window.addEventListener("resize", calculateLayout);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calculateLayout);
    };
  }, [x]);

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
        </div>
      </div>

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
          </>
        )}

        <motion.div
          drag={canDrag ? "x" : false}
          dragConstraints={constraints}
          dragElastic={canDrag ? 0.12 : 0}
          dragMomentum={canDrag}
          onPointerDown={(event) => {
            didDragRef.current = false;
            const card = (event.target as HTMLElement).closest("[data-dept-id]");
            const id = card?.getAttribute("data-dept-id") ?? null;
            pressRef.current = {
              x: event.clientX,
              y: event.clientY,
              id,
            };
          }}
          onPointerUp={(event) => {
            if (event.button !== 0) return;
            const press = pressRef.current;
            pressRef.current = null;
            if (!press?.id || didDragRef.current) return;

            const moved = Math.hypot(
              event.clientX - press.x,
              event.clientY - press.y,
            );
            if (moved > DRAG_THRESHOLD_PX) return;

            tryOpenDepartment(press.id);
          }}
          onPointerCancel={() => {
            pressRef.current = null;
          }}
          onDragStart={() => {
            didDragRef.current = false;
          }}
          onDrag={(_, info) => {
            if (Math.abs(info.offset.x) > DRAG_THRESHOLD_PX) {
              didDragRef.current = true;
            }
          }}
          onDragEnd={(_, info) => {
            if (Math.abs(info.offset.x) > DRAG_THRESHOLD_PX) {
              didDragRef.current = true;
            }
            pressRef.current = null;
          }}
          dragTransition={{
            power: 0.22,
            timeConstant: 220,
            bounceStiffness: 280,
            bounceDamping: 28,
          }}
          style={{ x }}
          whileTap={canDrag ? { cursor: "grabbing" } : undefined}
          className={`flex gap-4 sm:gap-5 will-change-transform pl-5 sm:pl-6 ${
            canDrag ? "cursor-grab active:cursor-grabbing" : "cursor-default"
          }`}
        >
          {CAROUSEL_DEPARTMENTS.map((dept) => (
            <div
              key={dept.id}
              data-dept-id={dept.id}
              role="link"
              tabIndex={0}
              aria-label={dept.name}
              onAuxClick={(event) => {
                if (didDragRef.current || event.button !== 1) return;
                event.preventDefault();
                window.open(
                  `/departments/${dept.id}`,
                  "_blank",
                  "noopener,noreferrer",
                );
              }}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                router.push(`/departments/${dept.id}`);
              }}
              className="w-[260px] sm:w-[300px] lg:w-[320px] shrink-0 flex flex-col rounded-xl bg-surface border border-border hover:border-accent/50 shadow-card transition-all duration-300 hover:shadow-md hover:-translate-y-1 group select-none relative overflow-hidden focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              <div className="relative w-full aspect-[16/11] pointer-events-none bg-card">
                <Image
                  src={dept.image}
                  alt={dept.name}
                  fill
                  sizes="(max-width: 640px) 260px, (max-width: 1024px) 300px, 320px"
                  className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
                  priority={
                    dept.id === "ban-chu-nhiem" ||
                    dept.id === "truyen-thong" ||
                    dept.id === "chuyen-mon"
                  }
                />
                <div className="absolute inset-x-0 top-0 flex items-center p-2.5 sm:p-3">
                  <span className="font-mono text-[10px] sm:text-[11px] font-semibold tracking-widest text-white/90 drop-shadow-sm">
                    {dept.index}
                  </span>
                </div>
              </div>

              <div className="flex flex-col flex-1 p-3.5 sm:p-4">
                <h3 className="font-extrabold text-base sm:text-lg text-ink tracking-tight uppercase line-clamp-1 group-hover:text-accent transition-colors mb-1">
                  {dept.name}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-ink-light italic mb-2 line-clamp-1">
                  {dept.tagline}
                </p>
                <p className="text-sm leading-relaxed text-ink-light line-clamp-2">
                  {dept.description}
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
          ))}
        </motion.div>
      </div>
    </section>
  );
}

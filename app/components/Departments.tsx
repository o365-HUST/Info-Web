"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { DEPARTMENTS } from "@/app/data/clubData";
import type { Department } from "@/app/types";
import { ArrowRight, ExternalLink, X } from "lucide-react";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState<{ left: number; right: number }>({
    left: -800,
    right: 800,
  });
  const x = useMotionValue(0);

  const [previewDept, setPreviewDept] = useState<Department | null>(null);

  /** True only after a real pan — blocks click-to-preview. */
  const didDragRef = useRef(false);

  // Center the track on Ban Chủ nhiệm (middle card)
  useEffect(() => {
    const calculateLayout = () => {
      if (!containerRef.current) return;
      const isMobile = window.innerWidth < 640;
      const isTablet = window.innerWidth < 1024;

      const cardW = isMobile ? 340 : isTablet ? 440 : 520;
      const gapW = isMobile ? 20 : 28;
      const step = cardW + gapW;
      const count = CAROUSEL_DEPARTMENTS.length;
      if (count < 1) return;

      const containerW = containerRef.current.clientWidth;
      const screenCenter = containerW / 2;

      const centerIndex = Math.floor(count / 2);
      const cardCenter = centerIndex * step + cardW / 2;
      const initialCenterOffset = screenCenter - cardCenter;

      const firstCenter = cardW / 2;
      const lastCenter = (count - 1) * step + cardW / 2;
      const clearance = isMobile ? 60 : 120;
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

  const handleCardActivate = (dept: Department) => {
    if (didDragRef.current) return;
    setPreviewDept(dept);
  };

  // Close modal on Escape key
  useEffect(() => {
    if (!previewDept) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewDept(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewDept]);

  return (
    <section
      id="departments"
      className="relative py-16 sm:py-24 overflow-hidden select-none"
      style={{ background: "var(--bg)" }}
    >
      {/* Subtle background dot pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(var(--ink) 0.75px, transparent 0.75px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative max-w-[var(--max-width)] mx-auto px-5 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border/70">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink tracking-tight">
              Bộ Máy Hoạt Động o365
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-ink-light max-w-xl text-pretty">
              Khám phá {CAROUSEL_DEPARTMENTS.length} ban chuyên trách kiến tạo sân chơi công nghệ và kỹ năng số cho sinh viên Bách Khoa. Bấm vào từng ban để xem nhanh hoặc mở trang chi tiết.
            </p>
          </div>

        </div>
      </div>

      {/* Free-Dragging Carousel Track with Cinematic Edge Fades */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden mt-6 sm:mt-8 py-8 sm:py-10"
      >
        {/* Left & Right edge fades — wider on large screens so cropped cards don't look hard-cut */}
        <div
          className="absolute inset-y-0 left-0 z-10 pointer-events-none w-12 sm:w-24 md:w-32 lg:w-40 xl:w-52"
          style={{
            background:
              "linear-gradient(to right, var(--bg) 0%, var(--bg) 28%, transparent 100%)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-y-0 right-0 z-10 pointer-events-none w-12 sm:w-24 md:w-32 lg:w-40 xl:w-52"
          style={{
            background:
              "linear-gradient(to left, var(--bg) 0%, var(--bg) 28%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        {/* Draggable track — initially centered on Ban Chủ nhiệm */}
        <motion.div
          drag="x"
          dragConstraints={constraints}
          dragElastic={0.12}
          dragMomentum={true}
          onPointerDown={() => {
            didDragRef.current = false;
          }}
          onDragStart={() => {
            didDragRef.current = false;
          }}
          onDrag={(_, info) => {
            if (Math.abs(info.offset.x) > 12) {
              didDragRef.current = true;
            }
          }}
          onDragEnd={(_, info) => {
            if (Math.abs(info.offset.x) > 12) {
              didDragRef.current = true;
            }
          }}
          dragTransition={{
            power: 0.22,
            timeConstant: 220,
            bounceStiffness: 280,
            bounceDamping: 28,
          }}
          style={{ x }}
          whileTap={{ cursor: "grabbing" }}
          className="flex gap-5 sm:gap-7 cursor-grab active:cursor-grabbing will-change-transform pl-5 sm:pl-6"
        >
          {CAROUSEL_DEPARTMENTS.map((dept) => {
            return (
              <div
                key={dept.id}
                role="button"
                tabIndex={0}
                onPointerUp={() => handleCardActivate(dept)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCardActivate(dept);
                  }
                }}
                className="w-[340px] sm:w-[440px] lg:w-[520px] shrink-0 flex flex-col rounded-2xl bg-surface border border-border hover:border-accent/50 shadow-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1.5 group select-none cursor-pointer relative overflow-hidden focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              >
                {/* Wide group-photo band */}
                <div className="relative w-full aspect-[16/10] sm:aspect-[3/2] pointer-events-none bg-card">
                  <Image
                    src={dept.image}
                    alt={dept.name}
                    fill
                    sizes="(max-width: 640px) 340px, (max-width: 1024px) 440px, 520px"
                    className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
                    priority={
                      dept.id === "ban-chu-nhiem" ||
                      dept.id === "truyen-thong" ||
                      dept.id === "chuyen-mon"
                    }
                  />
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 sm:p-4">
                    <span className="font-mono text-[11px] sm:text-xs font-semibold tracking-widest text-white/90 drop-shadow-sm">
                      [&nbsp; {dept.index} &nbsp;]
                    </span>
                    <span className="inline-block w-2 h-2 rounded-full bg-white/70 group-hover:bg-accent transition-colors" />
                  </div>
                </div>

                <div className="flex flex-col flex-1 p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="font-extrabold text-xl sm:text-2xl text-ink tracking-tight uppercase line-clamp-1 group-hover:text-accent transition-colors">
                      {dept.name}
                    </h3>
                    <Link
                      href={`/departments/${dept.id}`}
                      onClick={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                      onPointerUp={(e) => e.stopPropagation()}
                      className="mt-1 p-1 rounded-lg text-ink-muted hover:text-accent hover:bg-card transition-colors focus-visible:outline-2 focus-visible:outline-accent shrink-0"
                      title="Mở trang ban riêng"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                  <p className="text-sm sm:text-base font-medium text-ink-light italic mb-3 line-clamp-1">
                    {dept.tagline}
                  </p>
                  <p className="text-base sm:text-[1.05rem] leading-relaxed text-ink-light line-clamp-3">
                    {dept.description}
                  </p>

                  <div className="pt-4 mt-auto border-t border-border/70 flex items-center">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-9 h-9 rounded-full text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-2xs"
                        style={{ backgroundColor: dept.accentColor }}
                      >
                        {dept.leader?.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-ink text-sm sm:text-base leading-tight truncate">
                          {dept.leader?.name}
                        </p>
                        <p className="text-xs sm:text-sm text-ink-muted leading-tight truncate">
                          {dept.leader?.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* ─── QUICK-PREVIEW MODAL ─── */}
      <AnimatePresence>
        {previewDept && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay backdrop-blur-xs"
            onClick={() => setPreviewDept(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`Xem nhanh ${previewDept.name}`}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md max-h-[90vh] flex flex-col rounded-2xl bg-surface border border-border shadow-lg overflow-hidden"
            >
              <div className="relative w-full aspect-[16/9] bg-card shrink-0">
                <Image
                  src={previewDept.image}
                  alt=""
                  fill
                  sizes="(max-width: 448px) 100vw, 448px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPreviewDept(null)}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-surface/90 border border-border text-ink flex items-center justify-center cursor-pointer transition-colors hover:bg-card focus-visible:outline-2 focus-visible:outline-accent active:scale-[0.96]"
                  aria-label="Đóng"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 sm:p-6 flex flex-col gap-4 overflow-y-auto">
                <header>
                  <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-accent mb-2 m-0">
                    Ban {previewDept.index}
                  </p>
                  <h3 className="font-display text-xl sm:text-2xl font-extrabold text-ink tracking-tight m-0 mb-1">
                    {previewDept.name}
                  </h3>
                  <p className="text-sm text-ink-muted italic m-0">
                    {previewDept.tagline}
                  </p>
                </header>

                <p className="text-sm sm:text-base text-ink-light leading-relaxed m-0">
                  {previewDept.description}
                </p>

                {previewDept.keyActivities &&
                  previewDept.keyActivities.length > 0 && (
                    <ul className="m-0 p-0 list-none space-y-2">
                      {previewDept.keyActivities.slice(0, 3).map((item) => (
                        <li
                          key={item.title}
                          className="flex gap-2.5 text-sm text-ink leading-snug"
                        >
                          <span
                            className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0"
                            aria-hidden
                          />
                          <span>{item.title}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                {previewDept.leader && (
                  <div className="flex items-center gap-3 pt-1">
                    <div className="w-9 h-9 rounded-full bg-accent text-accent-fg flex items-center justify-center font-bold text-sm shrink-0">
                      {previewDept.leader.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-ink truncate m-0">
                        {previewDept.leader.name}
                      </p>
                      <p className="text-xs text-ink-muted truncate m-0">
                        {previewDept.leader.role}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-5 border-t border-border bg-surface shrink-0">
                <Link
                  href={`/departments/${previewDept.id}`}
                  onClick={() => setPreviewDept(null)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent text-accent-fg text-sm font-semibold hover:bg-accent-hover transition-[background-color,scale] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-accent"
                >
                  <span>Xem trang ban</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

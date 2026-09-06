"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from "motion/react";
import Image from "next/image";
import { DEPARTMENTS } from "@/app/data/clubData";
import {
  ArrowDown,
  Sparkles,
  Lock,
  MoveHorizontal,
  Check,
} from "lucide-react";

export default function Departments() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState(1440);
  const [scrollStage, setScrollStage] = useState<"entering" | "sliding" | "leaving">("entering");

  // Track responsive screen width for exact mathematical travel
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate card layout geometry
  const cardWidth = windowWidth < 640 ? 300 : windowWidth < 1024 ? 350 : 390;
  const gap = windowWidth < 640 ? 20 : 28;
  const rightPadding = windowWidth < 640 ? 24 : windowWidth < 1024 ? 48 : 80;
  const totalTrackWidth = 5 * cardWidth + 4 * gap;

  // Start position: completely outside the right edge of the screen
  const startX = windowWidth;
  // End position: stops precisely when Card 05 (Ban Tài chính & Nhân sự) is fully visible
  const endX = windowWidth - rightPadding - totalTrackWidth;

  // Vertical scroll translates into horizontal motion
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Spring smoothed scroll progress for silky fluid animation
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 28,
    stiffness: 130,
    mass: 0.9,
  });

  // Smooth entrance and exit transitions for the sticky section
  const contentOpacity = useTransform(
    smoothProgress,
    [0, 0.05, 0.94, 1],
    [0.3, 1, 1, 0.3]
  );

  const contentScale = useTransform(
    smoothProgress,
    [0, 0.05, 0.94, 1],
    [0.98, 1, 1, 0.98]
  );

  const headerY = useTransform(
    smoothProgress,
    [0, 0.06],
    [-12, 0]
  );

  // Timeline with entry buffer (0.00-0.10), active slide (0.10-0.78), and generous exit buffer (0.78-1.00)
  const x = useTransform(
    smoothProgress,
    [0, 0.10, 0.78, 1],
    [startX, startX, endX, endX]
  );

  // Progress bar width (fills from 15% to 100% during the active slide phase)
  const progressWidth = useTransform(
    smoothProgress,
    [0.10, 0.78],
    ["15%", "100%"]
  );

  // Track scroll stage reactively for minimal icon cues
  useMotionValueEvent(smoothProgress, "change", (latest) => {
    if (latest < 0.12) {
      setScrollStage("entering");
    } else if (latest < 0.78) {
      setScrollStage("sliding");
    } else {
      setScrollStage("leaving");
    }
  });

  return (
    <section
      id="departments"
      ref={containerRef}
      className="relative h-[340vh] sm:h-[380vh]"
      style={{ background: "var(--bg)" }}
    >
      {/* Sticky Viewport Container with Smooth In/Out Transition */}
      <motion.div
        style={{ opacity: contentOpacity, scale: contentScale }}
        className="sticky top-0 h-screen flex flex-col justify-between overflow-hidden py-6 sm:py-10 will-change-transform"
      >
        {/* Subtle dot pattern background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(var(--ink) 0.75px, transparent 0.75px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Section Header with Subtle Slide-in */}
        <motion.div
          style={{ y: headerY }}
          className="relative max-w-[var(--max-width)] mx-auto px-5 sm:px-6 w-full pt-2 sm:pt-4 shrink-0 z-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-border/70">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-mono font-medium uppercase tracking-wider mb-2 bg-surface border border-border text-ink-light shadow-2xs">
                <Sparkles className="w-3 h-3 text-accent" />
                <span>CƠ CẤU TỔ CHỨC</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink tracking-tight">
                Bộ Máy Hoạt Động o365
              </h2>
            </div>

            {/* Minimalist Icon Indicator & Progress Bar */}
            <div className="flex items-center gap-3 text-xs">
              {/* Minimal status icon pill */}
              <div
                className="flex items-center justify-center w-7 h-7 rounded-full bg-surface border border-border text-ink shadow-2xs transition-colors"
                title={
                  scrollStage === "entering"
                    ? "Khóa cuộn để lướt ngang"
                    : scrollStage === "sliding"
                    ? "Đang lướt ngang"
                    : "Sẵn sàng cuộn tiếp xuống Blog"
                }
              >
                {scrollStage === "entering" && (
                  <Lock className="w-3.5 h-3.5 text-accent animate-pulse" />
                )}
                {scrollStage === "sliding" && (
                  <MoveHorizontal className="w-3.5 h-3.5 text-ink animate-pulse" />
                )}
                {scrollStage === "leaving" && (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                )}
              </div>

              {/* Progress track bar */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-ink-muted text-[11px]">[ 01</span>
                <div className="w-24 sm:w-32 h-1.5 rounded-full bg-border overflow-hidden">
                  <motion.div
                    style={{ width: progressWidth }}
                    className="h-full bg-ink rounded-full"
                  />
                </div>
                <span className="font-mono text-ink-muted text-[11px]">05 ]</span>
              </div>

              {/* Quick skip down to blog */}
              <a
                href="#blog"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .querySelector("#blog")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-7 h-7 rounded-full bg-surface hover:bg-card border border-border text-ink-muted hover:text-ink flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                title="Xuống thẳng Blog"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Horizontal Sliding Track with Cinematic Edge Fades */}
        <div className="relative w-full flex-1 flex items-center overflow-hidden my-auto">
          {/* Left & Right gradient edge fades */}
          <div className="absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-[var(--bg)] to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-[var(--bg)] to-transparent pointer-events-none z-10" />

          <motion.div
            className="flex will-change-transform"
            style={{
              x,
              gap: `${gap}px`,
            }}
          >
            {DEPARTMENTS.map((dept) => {
              const isLast = dept.index === "05";
              return (
                <div
                  key={dept.id}
                  style={{ width: `${cardWidth}px` }}
                  className={`shrink-0 flex flex-col justify-between rounded-2xl bg-surface border p-6 sm:p-7 shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1.5 group select-none ${
                    isLast ? "border-accent ring-1 ring-accent/30" : "border-border"
                  }`}
                >
                  {/* Top Bracketed Index */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs sm:text-sm font-semibold tracking-widest text-ink-muted/80">
                      [&nbsp; {dept.index} &nbsp;]
                    </span>
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${
                        isLast ? "bg-emerald-500 animate-pulse" : "bg-accent/60 group-hover:bg-accent"
                      } transition-colors`}
                    />
                  </div>

                  {/* Isometric Line-Art Illustration */}
                  <div className="relative w-full aspect-square max-w-[210px] sm:max-w-[230px] mx-auto my-3 flex items-center justify-center">
                    <Image
                      src={dept.image}
                      alt={dept.name}
                      fill
                      sizes="(max-width: 768px) 240px, 300px"
                      className="object-contain p-1 transition-transform duration-300 group-hover:scale-105"
                      priority={dept.index === "01" || dept.index === "02"}
                    />
                  </div>

                  {/* Title & Slogan */}
                  <div className="mt-2">
                    <h3 className="font-extrabold text-lg sm:text-xl text-ink tracking-tight uppercase mb-1 line-clamp-1">
                      {dept.name}
                    </h3>
                    <p className="text-xs font-medium text-ink-light italic mb-2.5 line-clamp-1">
                      {dept.tagline}
                    </p>
                    <p className="text-xs sm:text-sm leading-relaxed text-ink-light/90 line-clamp-3">
                      {dept.description}
                    </p>
                  </div>

                  {/* Leader Info Chip */}
                  <div className="pt-4 mt-4 border-t border-border/70 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-accent/25 text-ink font-bold flex items-center justify-center text-xs shrink-0">
                        {dept.leader?.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-ink text-[12px] leading-tight">
                          {dept.leader?.name}
                        </p>
                        <p className="text-[10px] text-ink-muted leading-tight">
                          {dept.leader?.role}
                        </p>
                      </div>
                    </div>

                    <span className="font-mono text-[11px] text-ink-muted font-medium">
                      {dept.index} / 05
                    </span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

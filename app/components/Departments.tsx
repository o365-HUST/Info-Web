"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "motion/react";
import Image from "next/image";
import { DEPARTMENTS } from "@/app/data/clubData";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Departments() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Vertical scroll translates into horizontal motion
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Spring smoothed scroll progress for silky fluid animation
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 26,
    stiffness: 140,
    mass: 0.8,
  });

  // Transform scroll progress to horizontal translation (from 0% to -66%)
  const x = useTransform(smoothProgress, [0, 1], ["0%", "-66%"]);
  // Progress bar width
  const progressWidth = useTransform(smoothProgress, [0, 1], ["20%", "100%"]);

  return (
    <section
      id="departments"
      ref={containerRef}
      className="relative h-[280vh] sm:h-[320vh]"
      style={{ background: "var(--bg)" }}
    >
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 h-screen flex flex-col justify-between overflow-hidden py-8 sm:py-12">
        {/* Subtle dot pattern background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(var(--ink) 0.75px, transparent 0.75px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Section Header */}
        <div className="relative max-w-[var(--max-width)] mx-auto px-5 sm:px-6 w-full pt-4 sm:pt-6 shrink-0 z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-border/70">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-mono font-medium uppercase tracking-wider mb-2 bg-surface border border-border text-ink-light">
                <Sparkles className="w-3 h-3 text-accent" />
                <span>CƠ CẤU TỔ CHỨC</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-ink tracking-tight">
                Bộ Máy Hoạt Động o365
              </h2>
            </div>

            {/* Scroll Progress & Instruction */}
            <div className="flex items-center gap-4 text-xs">
              <div className="hidden sm:flex items-center gap-1.5 text-ink-muted">
                <span>Cuộn chuột để lướt</span>
                <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
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
            </div>
          </div>
        </div>

        {/* Horizontal Sliding Track (Desktop & Tablet) */}
        <div className="relative w-full flex-1 flex items-center overflow-hidden my-auto">
          <motion.div
            style={{ x }}
            className="flex gap-6 sm:gap-8 px-6 sm:px-12 lg:px-20 will-change-transform"
          >
            {DEPARTMENTS.map((dept) => {
              return (
                <div
                  key={dept.id}
                  className="w-[300px] sm:w-[350px] lg:w-[390px] shrink-0 flex flex-col justify-between rounded-2xl bg-surface border border-border p-6 sm:p-7 shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1.5 group select-none"
                >
                  {/* Top Bracketed Index */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs sm:text-sm font-semibold tracking-widest text-ink-muted/80">
                      [&nbsp; {dept.index} &nbsp;]
                    </span>
                    <span className="inline-block w-2 h-2 rounded-full bg-accent/60 group-hover:bg-accent transition-colors" />
                  </div>

                  {/* Isometric Line-Art Illustration */}
                  <div className="relative w-full aspect-square max-w-[220px] sm:max-w-[240px] mx-auto my-3 flex items-center justify-center">
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
                    <p className="text-xs font-medium text-ink-light italic mb-3 line-clamp-1">
                      {dept.tagline}
                    </p>
                    <p className="text-xs sm:text-sm leading-relaxed text-ink-light/90 line-clamp-3">
                      {dept.description}
                    </p>
                  </div>

                  {/* Leader Info Chip */}
                  <div className="pt-4 mt-5 border-t border-border/70 flex items-center justify-between text-xs">
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

        {/* Bottom subtle note */}
        <div className="relative max-w-[var(--max-width)] mx-auto px-5 sm:px-6 w-full text-center pb-2 shrink-0">
          <p className="text-[11px] text-ink-muted">
            Đại học Bách khoa Hà Nội • Ban Chuyển đổi số sinh viên o365
          </p>
        </div>
      </div>
    </section>
  );
}

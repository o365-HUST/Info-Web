"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue } from "motion/react";
import Image from "next/image";
import { DEPARTMENTS } from "@/app/data/clubData";
import { Sparkles, MoveHorizontal } from "lucide-react";

export default function Departments() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState<{ left: number; right: number }>({
    left: -800,
    right: 800,
  });
  const x = useMotionValue(0);

  // Center the cards range on Card 3 and calculate balanced drag constraints
  useEffect(() => {
    const calculateLayout = () => {
      if (!containerRef.current) return;
      const isMobile = window.innerWidth < 640;
      const isTablet = window.innerWidth < 1024;
      
      const cardW = isMobile ? 300 : isTablet ? 350 : 390;
      const gapW = isMobile ? 20 : 28;
      const step = cardW + gapW;

      // Center coordinate of the viewport / carousel container
      const containerW = containerRef.current.clientWidth;
      const screenCenter = containerW / 2;

      // Center of Card 3 (index 2: Card 1, Card 2, [Card 3], Card 4, Card 5)
      const card3Center = 2 * step + cardW / 2;
      const initialCenterOffset = screenCenter - card3Center;

      // Card 1 center and Card 5 center
      const card1Center = cardW / 2;
      const card5Center = 4 * step + cardW / 2;

      // Generous drag constraints so both Card 1 and Card 5 can be dragged smoothly into center
      const clearance = isMobile ? 60 : 120;
      const maxRight = screenCenter - card1Center + clearance;
      const minLeft = screenCenter - card5Center - clearance;

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
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-mono font-medium uppercase tracking-wider mb-2 bg-surface border border-border text-ink-light shadow-2xs">
              <Sparkles className="w-3 h-3 text-accent" />
              <span>CƠ CẤU TỔ CHỨC</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink tracking-tight">
              Bộ Máy Hoạt Động o365
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-ink-light max-w-xl">
              Khám phá 5 ban chuyên trách kiến tạo sân chơi công nghệ và kỹ năng số cho sinh viên Bách Khoa.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-border text-xs font-mono text-ink-muted shadow-2xs self-start md:self-end">
            <MoveHorizontal className="w-3.5 h-3.5 text-accent animate-pulse" />
            <span>Kéo tự do 2 bên</span>
          </div>
        </div>
      </div>

      {/* Free-Dragging Carousel Track with Cinematic Edge Fades */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden mt-6 sm:mt-8 py-4 sm:py-6"
      >
        {/* Left & Right gradient edge fades */}
        <div className="absolute inset-y-0 left-0 w-8 sm:w-20 bg-gradient-to-r from-[var(--bg)] to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-8 sm:w-20 bg-gradient-to-l from-[var(--bg)] to-transparent pointer-events-none z-10" />

        {/* Free-Moving Draggable Track centered at Card 3 */}
        <motion.div
          drag="x"
          dragConstraints={constraints}
          dragElastic={0.14}
          dragTransition={{
            power: 0.28,
            timeConstant: 240,
            bounceStiffness: 280,
            bounceDamping: 26,
          }}
          style={{ x }}
          whileTap={{ cursor: "grabbing" }}
          className="flex gap-5 sm:gap-7 cursor-grab active:cursor-grabbing will-change-transform pl-5 sm:pl-6"
        >
          {DEPARTMENTS.map((dept) => {
            const isCard3 = dept.index === "03";
            return (
              <div
                key={dept.id}
                className={`w-[300px] sm:w-[350px] lg:w-[390px] shrink-0 flex flex-col justify-between rounded-2xl bg-surface border p-6 sm:p-7 shadow-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1.5 group select-none ${
                  isCard3
                    ? "border-accent/80 ring-1 ring-accent/30"
                    : "border-border hover:border-accent/50"
                }`}
              >
                {/* Top Bracketed Index */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs sm:text-sm font-semibold tracking-widest text-ink-muted/80">
                    [&nbsp; {dept.index} &nbsp;]
                  </span>
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${
                      isCard3
                        ? "bg-accent scale-110 shadow-2xs"
                        : "bg-border group-hover:bg-accent/70"
                    } transition-colors`}
                  />
                </div>

                {/* Isometric Line-Art Illustration */}
                <div className="relative w-full aspect-square max-w-[210px] sm:max-w-[230px] mx-auto my-3 flex items-center justify-center pointer-events-none">
                  <Image
                    src={dept.image}
                    alt={dept.name}
                    fill
                    sizes="(max-width: 768px) 240px, 390px"
                    className="object-contain p-1 transition-transform duration-300 group-hover:scale-105"
                    priority={dept.index === "02" || dept.index === "03" || dept.index === "04"}
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
    </section>
  );
}

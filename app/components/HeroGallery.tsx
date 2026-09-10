"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

export interface GallerySlide {
  src: string;
  alt: string;
  title: string;
  badge: string;
}

export const GALLERY_SLIDES: GallerySlide[] = [
  {
    src: "/assets/hero/hero-campus.svg",
    alt: "Không gian hoạt động CLB o365 HUST (ảnh sẽ cập nhật)",
    title: "Không gian học tập & kết nối",
    badge: "01 • Campus & cộng đồng",
  },
  {
    src: "/assets/about/about-support.svg",
    alt: "Trạm hỗ trợ Office 365 (ảnh sẽ cập nhật)",
    title: "Trạm hỗ trợ sinh viên",
    badge: "02 • Microsoft 365",
  },
  {
    src: "/assets/about/about-event.svg",
    alt: "Kỹ thuật sự kiện CLB (ảnh sẽ cập nhật)",
    title: "Sự kiện & kỹ thuật",
    badge: "03 • Hội trường & workshop",
  },
];

interface HeroGalleryProps {
  slides?: GallerySlide[];
  intervalMs?: number;
  className?: string;
}

export default function HeroGallery({
  slides = GALLERY_SLIDES,
  intervalMs = 4500,
  className = "",
}: HeroGalleryProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Mouse tilt variables
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 24, stiffness: 180 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsPaused(false);
  };

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = (idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };

  // Interval timer for swapping
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isPaused, intervalMs, nextSlide]);

  const activeSlide = slides[current];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full select-none ${className}`}
      style={{ perspective: 1000 }}
    >
      <motion.div
        style={{ rotateX, rotateY }}
        className="relative w-full rounded-2xl bg-surface border border-border p-3 sm:p-4 shadow-card overflow-hidden group"
      >
        {/* Top Status Bar with Badge and Pause Indicator */}
        <div className="flex items-center justify-between gap-2 pb-2 sm:pb-3 px-1 border-b border-border/60 text-xs font-medium text-ink-muted">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-ink font-semibold tracking-wide">
              {activeSlide.badge}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px]">
            {isPaused ? (
              <span className="inline-flex items-center gap-1 text-ink-light bg-card px-2 py-0.5 rounded-full">
                <Pause className="w-2.5 h-2.5" /> Đã tạm dừng
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-ink-muted opacity-80">
                <Play className="w-2.5 h-2.5 opacity-60" /> Tự động đổi
              </span>
            )}
          </div>
        </div>

        {/* Gallery Image Display Area */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-bg/50 mt-2">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={activeSlide.src}
              custom={direction}
              initial={{
                opacity: 0,
                x: direction > 0 ? 30 : -30,
                scale: 0.98,
              }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{
                opacity: 0,
                x: direction > 0 ? -30 : 30,
                scale: 0.98,
              }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex items-center justify-center p-2"
            >
              <Image
                src={activeSlide.src}
                alt={activeSlide.alt}
                fill
                sizes="(max-width: 768px) 100vw, 550px"
                className="object-contain"
                priority={current === 0}
                unoptimized={activeSlide.src.endsWith(".svg")}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Overlay Buttons (appear on group hover) */}
          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              aria-label="Hình trước"
              className="pointer-events-auto w-8 h-8 rounded-full bg-surface/90 hover:bg-surface border border-border text-ink flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              aria-label="Hình kế tiếp"
              className="pointer-events-auto w-8 h-8 rounded-full bg-surface/90 hover:bg-surface border border-border text-ink flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Pagination & Caption Footer */}
        <div className="flex items-center justify-between gap-3 pt-3 px-1">
          <p className="text-xs sm:text-sm font-medium text-ink truncate">
            {activeSlide.title}
          </p>

          {/* Interactive slide indicators */}
          <div className="flex items-center gap-1.5 shrink-0">
            {slides.map((_, idx) => {
              const isActive = idx === current;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  aria-label={`Chuyển đến hình ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? "w-6 bg-ink"
                      : "w-2 bg-border hover:bg-ink-muted"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

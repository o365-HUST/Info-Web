"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play, Award, Sparkles } from "lucide-react";

export interface GallerySlide {
  src: string;
  alt: string;
  title: string;
  badge: string;
  desc: string;
}

export const GALLERY_SLIDES: GallerySlide[] = [
  {
    src: "/assets/hero/hero-campus.svg",
    alt: "Không gian hoạt động CLB o365 HUST (ảnh sẽ cập nhật)",
    title: "Không gian học tập & kết nối",
    badge: "01 • Campus & cộng đồng",
    desc: "Ảnh thật đang được thu thập — trạm hỗ trợ, workshop và sự kiện CLB.",
  },
  {
    src: "/assets/about/about-support.svg",
    alt: "Trạm hỗ trợ Office 365 (ảnh sẽ cập nhật)",
    title: "Trạm hỗ trợ sinh viên",
    badge: "02 • Microsoft 365",
    desc: "Tư vấn tài khoản và công cụ số cho sinh viên toàn trường.",
  },
  {
    src: "/assets/about/about-event.svg",
    alt: "Kỹ thuật sự kiện CLB (ảnh sẽ cập nhật)",
    title: "Sự kiện & kỹ thuật",
    badge: "03 • Hội trường & workshop",
    desc: "Đồng hành kỹ thuật các sự kiện lớn và hoạt động đào tạo.",
  },
];

interface GallerySectionProps {
  slides?: GallerySlide[];
  intervalMs?: number;
}

export default function GallerySection({
  slides = GALLERY_SLIDES,
  intervalMs = 4500,
}: GallerySectionProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Mouse tilt variables
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 24, stiffness: 180 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), springConfig);

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
    <section
      id="gallery"
      className="relative pb-16 sm:pb-24 pt-0"
      style={{ background: "var(--bg)" }}
    >
      <div className="relative max-w-5xl mx-auto px-5 sm:px-6 w-full">
        {/* Top Notion-style Tab Navigation Bar */}
        <div className="flex items-center justify-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-none">
          {slides.map((slide, idx) => {
            const isActive = idx === current;
            return (
              <button
                key={slide.badge}
                type="button"
                onClick={() => goToSlide(idx)}
                className={`relative px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer select-none ${
                  isActive
                    ? "bg-surface text-ink border border-border shadow-xs font-semibold"
                    : "text-ink-muted hover:text-ink hover:bg-surface/50 border border-transparent"
                }`}
              >
                {slide.badge}
                {isActive && (
                  <motion.span
                    layoutId="active-gallery-tab"
                    className="absolute inset-0 rounded-full border border-ink/20 pointer-events-none"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Gallery Showcase Card with 3D Tilt */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={handleMouseLeave}
          className="relative w-full select-none"
          style={{ perspective: 1200 }}
        >
          <motion.div
            style={{ rotateX, rotateY }}
            className="relative w-full rounded-2xl bg-surface border border-border p-4 sm:p-6 shadow-card overflow-hidden group transition-shadow duration-300 hover:shadow-lg"
          >
            {/* Top Status Bar inside Card */}
            <div className="flex items-center justify-between gap-2 pb-3 px-1 border-b border-border/60 text-xs font-medium text-ink-muted">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-accent" />
                <span className="text-ink font-semibold tracking-wide">
                  {activeSlide.badge}
                </span>
              </div>

              <div className="flex items-center gap-3 text-[11px]">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-card/60 text-ink-light border border-border/40">
                  <Award className="w-3 h-3 text-accent" />
                  <span>MOSWC HUST</span>
                </span>
                {isPaused ? (
                  <span className="inline-flex items-center gap-1 text-ink-light bg-card px-2.5 py-0.5 rounded-full">
                    <Pause className="w-2.5 h-2.5" /> Đã tạm dừng
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-ink-muted opacity-80">
                    <Play className="w-2.5 h-2.5 opacity-60" /> Tự động đổi
                  </span>
                )}
              </div>
            </div>

            {/* Gallery Image Display Area with image-depth outline */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] max-h-[500px] w-full overflow-hidden rounded-xl bg-bg/40 mt-3 image-depth">
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.div
                  key={activeSlide.src}
                  custom={direction}
                  initial={{
                    opacity: 0,
                    x: direction > 0 ? 30 : -30,
                    scale: 0.99,
                  }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    x: direction > 0 ? -30 : 30,
                    scale: 0.99,
                  }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 flex items-center justify-center p-4 sm:p-6"
                >
                  <Image
                    src={activeSlide.src}
                    alt={activeSlide.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 1000px"
                    className="object-contain"
                    priority={current === 0}
                    unoptimized={activeSlide.src.endsWith(".svg")}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Overlay Buttons (accessible on focus & hover) */}
              <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevSlide();
                  }}
                  aria-label="Hình trước"
                  className="pointer-events-auto w-9 h-9 rounded-full bg-surface/95 hover:bg-surface border border-border text-ink flex items-center justify-center shadow-card hover:scale-105 active:scale-[0.96] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-accent"
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
                  className="pointer-events-auto w-9 h-9 rounded-full bg-surface/95 hover:bg-surface border border-border text-ink flex items-center justify-center shadow-card hover:scale-105 active:scale-[0.96] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-accent"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom Caption & Interactive Pagination Dots */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 px-1">
              <div>
                <p className="text-sm sm:text-base font-semibold text-ink">
                  {activeSlide.title}
                </p>
                <p className="text-xs text-ink-light mt-0.5">
                  {activeSlide.desc}
                </p>
              </div>

              {/* Interactive slide indicators */}
              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                {slides.map((_, idx) => {
                  const isActive = idx === current;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => goToSlide(idx)}
                      aria-label={`Chuyển đến hình ${idx + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        isActive
                          ? "w-7 bg-ink"
                          : "w-2 bg-border hover:bg-ink-muted"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { DepartmentGallerySlide } from "@/app/types";

const INTERVAL_MS = 5000;

interface DepartmentGalleryProps {
  slides: DepartmentGallerySlide[];
  departmentName: string;
}

export default function DepartmentGallery({
  slides,
  departmentName,
}: DepartmentGalleryProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(true);
  const canCycle = slides.length > 1;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPaused(reduce || !canCycle);
  }, [canCycle]);

  const go = useCallback(
    (next: number) => {
      if (!canCycle) return;
      setIndex((next + slides.length) % slides.length);
    },
    [canCycle, slides.length],
  );

  useEffect(() => {
    if (paused || !canCycle) return;
    const timer = window.setInterval(() => go(index + 1), INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [paused, canCycle, go, index]);

  if (slides.length === 0) return null;

  const slide = slides[index];

  return (
    <div className="w-full mb-12">
      <div className="flex items-end justify-between gap-4 mb-5">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-ink tracking-tight m-0">
          Điểm nhấn {departmentName}
        </h2>
        {canCycle && (
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            aria-pressed={paused}
            aria-label={
              paused
                ? `Phát thư viện ảnh ${departmentName}`
                : `Tạm dừng thư viện ảnh ${departmentName}`
            }
            className="shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-ink border border-border bg-card hover:bg-surface-hover active:scale-[0.96] transition-[background-color,scale] duration-150 focus-visible:outline-2 focus-visible:outline-accent"
          >
            {paused ? (
              <Play className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <Pause className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            <span>{paused ? "Phát" : "Tạm dừng"}</span>
          </button>
        )}
      </div>

      <figure className="m-0">
        <div className="photo-slot image-depth relative aspect-[16/9] bg-card">
          {slides.map((item, i) => (
            <div
              key={item.src}
              className={`absolute inset-0 motion-safe:transition-opacity motion-safe:duration-500 ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden={i !== index}
            >
              <Image
                src={item.src}
                alt={i === index ? item.alt : ""}
                fill
                sizes="(max-width: 1120px) 100vw, 1120px"
                className={item.fit === "cover" ? "object-cover" : "object-contain"}
                priority={i === 0}
              />
            </div>
          ))}

          {canCycle && (
            <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none">
              <button
                type="button"
                onClick={() => {
                  setPaused(true);
                  go(index - 1);
                }}
                aria-label="Hình trước"
                className="pointer-events-auto w-10 h-10 rounded-lg bg-card/95 border border-border text-ink flex items-center justify-center shadow-card hover:bg-surface-hover active:scale-[0.96] transition-[background-color,scale] duration-150 focus-visible:outline-2 focus-visible:outline-accent"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setPaused(true);
                  go(index + 1);
                }}
                aria-label="Hình kế tiếp"
                className="pointer-events-auto w-10 h-10 rounded-lg bg-card/95 border border-border text-ink flex items-center justify-center shadow-card hover:bg-surface-hover active:scale-[0.96] transition-[background-color,scale] duration-150 focus-visible:outline-2 focus-visible:outline-accent"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        <figcaption className="mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div className="min-w-0">
            <p className="text-base sm:text-lg font-bold text-ink m-0">
              {slide.title}
            </p>
            {slide.caption && (
              <p className="text-sm text-ink-light leading-relaxed mt-1 mb-0">
                {slide.caption}
              </p>
            )}
          </div>
          {canCycle && (
            <div className="flex items-center gap-1.5 shrink-0">
              {slides.map((item, i) => (
                <button
                  key={item.src}
                  type="button"
                  onClick={() => {
                    setPaused(true);
                    setIndex(i);
                  }}
                  aria-label={`Hình ${i + 1}: ${item.title}`}
                  aria-current={i === index ? true : undefined}
                  className={`h-2 rounded-full transition-[width,background-color] duration-200 focus-visible:outline-2 focus-visible:outline-accent ${
                    i === index
                      ? "w-7 bg-ink"
                      : "w-2 bg-border hover:bg-ink-muted"
                  }`}
                />
              ))}
            </div>
          )}
        </figcaption>
      </figure>
    </div>
  );
}

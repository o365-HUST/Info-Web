"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Pause, Play } from "lucide-react";
import SimpleMarquee from "@/app/components/fancy/SimpleMarquee";

const SHOWCASE_IMAGES = Array.from({ length: 20 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return {
    src: `/assets/marquee/marquee-${n}.jpg`,
    alt: `Khoảnh khắc CLB o365 HUST ${n}`,
  };
});

const third = Math.floor(SHOWCASE_IMAGES.length / 3);
const firstRow = SHOWCASE_IMAGES.slice(0, third);
const secondRow = SHOWCASE_IMAGES.slice(third, third * 2);
const thirdRow = SHOWCASE_IMAGES.slice(third * 2);

const MARQUEE_SHARED = {
  className: "w-full",
  baseVelocity: 6,
  repeat: 3,
  draggable: false,
  scrollSpringConfig: { damping: 50, stiffness: 400 },
  slowDownFactor: 0.1,
  slowdownOnHover: true,
  slowDownSpringConfig: { damping: 60, stiffness: 300 },
  scrollAwareDirection: true,
  useScrollVelocity: true,
} as const;

function MarqueeItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-2 sm:mx-3 md:mx-4 motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-in-out motion-safe:hover:scale-105">
      {children}
    </div>
  );
}

function ShowcaseFrame({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={192}
      height={128}
      loading="lazy"
      className="h-20 w-32 sm:h-24 sm:w-40 md:h-32 md:w-48 object-cover rounded-lg outline outline-1 outline-[var(--image-outline)] outline-offset-[-1px]"
      unoptimized={src.endsWith(".JPG") || src.endsWith(".jpg")}
    />
  );
}

export default function EventsTeaser() {
  const [paused, setPaused] = useState(true);
  const [motionOk, setMotionOk] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMotionOk(!reduce);
    setPaused(reduce);
  }, []);

  return (
    <section
      id="events-teaser"
      className="relative overflow-hidden bg-[var(--bg)] py-16 sm:py-20 scroll-mt-[var(--nav-height)]"
      aria-labelledby="events-showcase-heading"
    >
      <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-8 mb-8 sm:mb-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, ease: [0.2, 0, 0, 1] }}
            className="max-w-xl"
          >
            <p className="font-display text-[11px] font-semibold tracking-[0.28em] uppercase text-accent mb-3">
              Khoảnh khắc CLB
            </p>
            <h2
              id="events-showcase-heading"
              className="font-display text-3xl sm:text-4xl font-extrabold text-ink tracking-tight leading-tight mb-3"
            >
              Sự kiện nổi bật
            </h2>
            <p className="text-sm sm:text-base text-ink-light leading-relaxed text-pretty">
              Các sự kiện hỗ trợ, tập huấn, MOSWC và những chương trình đã đi cùng hành
              trình Đại sứ số học đường.
            </p>
          </motion.div>

          {motionOk && (
            <button
              type="button"
              onClick={() => setPaused((value) => !value)}
              aria-pressed={paused}
              aria-label={
                paused
                  ? "Phát slideshow ảnh sự kiện"
                  : "Tạm dừng slideshow ảnh sự kiện"
              }
              className="self-start sm:self-end inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-ink border border-border bg-card hover:bg-surface-hover active:scale-[0.96] transition-[background-color,scale] duration-150 focus-visible:outline-2 focus-visible:outline-accent"
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
      </div>

      <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
        <SimpleMarquee
          {...MARQUEE_SHARED}
          paused={paused}
          direction="left"
        >
          {firstRow.map((img) => (
            <MarqueeItem key={img.src}>
              <ShowcaseFrame src={img.src} alt={img.alt} />
            </MarqueeItem>
          ))}
        </SimpleMarquee>

        <SimpleMarquee
          {...MARQUEE_SHARED}
          paused={paused}
          direction="right"
        >
          {secondRow.map((img) => (
            <MarqueeItem key={img.src}>
              <ShowcaseFrame src={img.src} alt={img.alt} />
            </MarqueeItem>
          ))}
        </SimpleMarquee>

        <SimpleMarquee
          {...MARQUEE_SHARED}
          paused={paused}
          direction="left"
        >
          {thirdRow.map((img) => (
            <MarqueeItem key={img.src}>
              <ShowcaseFrame src={img.src} alt={img.alt} />
            </MarqueeItem>
          ))}
        </SimpleMarquee>
      </div>
    </section>
  );
}

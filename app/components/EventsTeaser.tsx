"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Pause, Play, X } from "lucide-react";
import SimpleMarquee from "@/app/components/fancy/SimpleMarquee";

type ShowcaseImage = {
  src: string;
  alt: string;
  index: number;
};

const SHOWCASE_IMAGE_COUNT = 12;

const SHOWCASE_IMAGES: ShowcaseImage[] = Array.from(
  { length: SHOWCASE_IMAGE_COUNT },
  (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return {
    src: `/assets/marquee/marquee-${n}.jpg`,
    alt: `Khoảnh khắc CLB o365-HUST ${n}`,
    index: i,
  };
});

const third = Math.floor(SHOWCASE_IMAGES.length / 3);
const firstRow = SHOWCASE_IMAGES.slice(0, third);
const secondRow = SHOWCASE_IMAGES.slice(third, third * 2);
const thirdRow = SHOWCASE_IMAGES.slice(third * 2);

const MARQUEE_SHARED = {
  className: "w-full",
  baseVelocity: 6,
  repeat: 2,
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
  img,
  selected,
  onSelect,
}: {
  img: ShowcaseImage;
  selected: ShowcaseImage | null;
  onSelect: (img: ShowcaseImage) => void;
}) {
  const isActive = selected?.src === img.src;

  return (
    <button
      type="button"
      onClick={() => onSelect(img)}
      aria-pressed={isActive}
      aria-label={`Xem ${img.alt}`}
      className={`relative block cursor-pointer rounded-lg transition-[transform,box-shadow] duration-300 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
        isActive
          ? "ring-2 ring-accent ring-offset-2 ring-offset-[var(--bg)] scale-105 z-10"
          : "hover:brightness-110"
      }`}
    >
      <Image
        src={img.src}
        alt={img.alt}
        width={192}
        height={128}
        loading="lazy"
        draggable={false}
        className="h-20 w-32 sm:h-24 sm:w-40 md:h-32 md:w-48 object-cover rounded-lg outline outline-1 outline-[var(--image-outline)] outline-offset-[-1px]"
        unoptimized={img.src.endsWith(".JPG") || img.src.endsWith(".jpg")}
      />
    </button>
  );
}

function CinematicSpotlight({
  img,
  motionOk,
  onClose,
}: {
  img: ShowcaseImage;
  motionOk: boolean;
  onClose: () => void;
}) {
  return (
    <motion.div
      key={img.src}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: motionOk ? 0.3 : 0.12 }}
    >
      <button
        type="button"
        aria-label="Đóng ảnh chiếu"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={img.alt}
        initial={motionOk ? { opacity: 0, scale: 0.92 } : false}
        animate={{ opacity: 1, scale: 1 }}
        exit={motionOk ? { opacity: 0, scale: 0.96 } : { opacity: 0 }}
        transition={
          motionOk
            ? { type: "spring", damping: 32, stiffness: 280, mass: 0.8 }
            : { duration: 0.12 }
        }
        className="pointer-events-none relative z-[71] w-[min(92vw,640px)]"
      >
        <div className="pointer-events-auto relative overflow-hidden rounded-xl bg-black shadow-[0_20px_50px_rgba(0,0,0,0.45)] ring-1 ring-white/10">
          <div className="relative aspect-video w-full overflow-hidden">
            <motion.div
              className="absolute inset-0"
              animate={motionOk ? { scale: [1, 1.05] } : { scale: 1 }}
              transition={
                motionOk
                  ? {
                      duration: 18,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "linear",
                    }
                  : undefined
              }
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                priority
                sizes="(max-width: 640px) 92vw, 640px"
                className="object-cover"
                unoptimized={img.src.endsWith(".JPG") || img.src.endsWith(".jpg")}
              />
            </motion.div>

            <div
              className="pointer-events-none absolute inset-0 z-10"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.08) 45%, transparent 100%)",
              }}
            />
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-4 pb-4 pt-10 sm:px-5 sm:pb-4">
            <p className="m-0 mb-1 font-mono text-[10px] font-semibold tracking-[0.3em] text-white/55 uppercase">
              {String(img.index + 1).padStart(2, "0")} /{" "}
              {String(SHOWCASE_IMAGES.length).padStart(2, "0")}
            </p>
            <p className="m-0 font-display text-sm sm:text-base font-bold tracking-tight text-white text-balance">
              {img.alt}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng ảnh chiếu"
            className="absolute right-2.5 top-2.5 z-30 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/45 text-white/90 backdrop-blur-sm transition-colors hover:bg-black/65 focus-visible:outline-2 focus-visible:outline-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function EventsTeaser() {
  const [paused, setPaused] = useState(true);
  const [motionOk, setMotionOk] = useState(false);
  const [selected, setSelected] = useState<ShowcaseImage | null>(null);
  const [portalReady, setPortalReady] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMotionOk(!reduce);
    setPaused(reduce);
    setPortalReady(true);
  }, []);

  const handleSelect = useCallback((img: ShowcaseImage) => {
    setSelected((current) => (current?.src === img.src ? null : img));
  }, []);

  const handleClose = useCallback(() => {
    setSelected(null);
  }, []);

  useEffect(() => {
    if (!selected) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected, handleClose]);

  const renderRow = (row: ShowcaseImage[]) =>
    row.map((img) => (
      <MarqueeItem key={img.src}>
        <ShowcaseFrame img={img} selected={selected} onSelect={handleSelect} />
      </MarqueeItem>
    ));

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

      {portalReady &&
        createPortal(
          <AnimatePresence>
            {selected && (
              <CinematicSpotlight
                img={selected}
                motionOk={motionOk}
                onClose={handleClose}
              />
            )}
          </AnimatePresence>,
          document.body,
        )}

      <motion.div
        animate={
          selected
            ? motionOk
              ? { opacity: 0.28, scale: 0.985, filter: "blur(5px)" }
              : { opacity: 0.45, scale: 1, filter: "blur(0px)" }
            : { opacity: 1, scale: 1, filter: "blur(0px)" }
        }
        transition={{ duration: motionOk ? 0.55 : 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-2 sm:gap-3 md:gap-4 origin-center"
      >
        <SimpleMarquee {...MARQUEE_SHARED} paused={paused || !!selected} direction="left">
          {renderRow(firstRow)}
        </SimpleMarquee>

        <SimpleMarquee {...MARQUEE_SHARED} paused={paused || !!selected} direction="right">
          {renderRow(secondRow)}
        </SimpleMarquee>

        <SimpleMarquee {...MARQUEE_SHARED} paused={paused || !!selected} direction="left">
          {renderRow(thirdRow)}
        </SimpleMarquee>
      </motion.div>
    </section>
  );
}

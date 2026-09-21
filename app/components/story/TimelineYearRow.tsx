"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
  ALTERNATING_YEAR_ROW_HEIGHT,
  type AlternatingYearRow,
  timelineLayoutTransition,
} from "@/app/lib/alternatingTimeline";
import TimelineYearBadge from "@/app/components/story/TimelineYearBadge";

interface TimelineYearRowProps {
  row: AlternatingYearRow;
  isRevealed: boolean;
  animateReveal: boolean;
  reducedMotion: boolean;
  onToggleYear: (year: number) => void;
  onEnterView: (revealIndex: number) => void;
}

export default function TimelineYearRow({
  row,
  isRevealed,
  animateReveal,
  reducedMotion,
  onToggleYear,
  onEnterView,
}: TimelineYearRowProps) {
  const ref = useRef<HTMLLIElement>(null);
  const controlsId = `story-year-${row.year}-milestones`;
  const layoutT = timelineLayoutTransition(reducedMotion);

  useEffect(() => {
    if (!animateReveal || isRevealed) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([observed]) => {
        if (observed?.isIntersecting) {
          onEnterView(row.revealIndex);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animateReveal, isRevealed, row.revealIndex, onEnterView]);

  const hidden = animateReveal && !isRevealed;

  return (
    <motion.li
      ref={ref}
      id={row.collapsed ? controlsId : undefined}
      className="absolute left-0 right-0 list-none"
      initial={false}
      animate={{
        top: row.rowTop,
        opacity: hidden ? 0 : 1,
        y: hidden ? (reducedMotion ? 0 : 12) : 0,
      }}
      transition={{
        top: layoutT,
        opacity: layoutT,
        y: reducedMotion
          ? { duration: 0.12 }
          : { type: "spring", damping: 28, stiffness: 320 },
      }}
      style={{ height: ALTERNATING_YEAR_ROW_HEIGHT }}
    >
      <div className="grid h-full grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
        <div aria-hidden="true" />
        <div className="flex justify-center">
          <TimelineYearBadge
            year={row.year}
            expanded={!row.collapsed}
            milestoneCount={row.milestoneCount}
            onToggle={() => onToggleYear(row.year)}
            controlsId={controlsId}
          />
        </div>
        <div aria-hidden="true" />
      </div>
    </motion.li>
  );
}

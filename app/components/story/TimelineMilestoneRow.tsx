"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import type { StoryTimelineEntry } from "@/app/data/storyTimeline";
import type { AlternatingMilestoneRow } from "@/app/lib/alternatingTimeline";
import { timelineLayoutTransition } from "@/app/lib/alternatingTimeline";
import TimelineDateLabel from "@/app/components/story/TimelineDateLabel";
import TimelineIconPill from "@/app/components/story/TimelineIconPill";
import DefaultMilestoneCard from "@/app/components/story/cards/DefaultMilestoneCard";
import AchievementMilestoneCard from "@/app/components/story/cards/AchievementMilestoneCard";
import AlumniMilestoneCard from "@/app/components/story/cards/AlumniMilestoneCard";
import PhotoMilestoneCard from "@/app/components/story/cards/PhotoMilestoneCard";
import {
  MILESTONE_TILE_BUTTON,
  milestoneTileMaxWidthClass,
} from "@/app/components/story/cards/milestoneTileStyles";

interface TimelineMilestoneRowProps {
  row: AlternatingMilestoneRow;
  isRevealed: boolean;
  animateReveal: boolean;
  reducedMotion: boolean;
  isCollapsing?: boolean;
  onOpen: (id: string, el: HTMLElement) => void;
  onEnterView: (revealIndex: number) => void;
}

function MilestoneCard({ entry }: { entry: StoryTimelineEntry }) {
  switch (entry.variant) {
    case "achievement":
      return <AchievementMilestoneCard entry={entry} iconOnRight={false} />;
    case "alumni":
      return <AlumniMilestoneCard entry={entry} iconOnRight={false} />;
    case "photo":
      return <PhotoMilestoneCard entry={entry} iconOnRight={false} />;
    case "founding":
    case "default":
    default:
      return <DefaultMilestoneCard entry={entry} iconOnRight={false} />;
  }
}

export default function TimelineMilestoneRow({
  row,
  isRevealed,
  animateReveal,
  reducedMotion,
  isCollapsing = false,
  onOpen,
  onEnterView,
}: TimelineMilestoneRowProps) {
  const ref = useRef<HTMLLIElement>(null);
  const { entry, side, revealIndex, rowHeight } = row;
  const layoutT = timelineLayoutTransition(reducedMotion);
  const dateLabel = entry.dateLabel ?? String(entry.year);

  useEffect(() => {
    if (!animateReveal || isRevealed) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([observed]) => {
        if (observed?.isIntersecting) {
          onEnterView(revealIndex);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animateReveal, isRevealed, revealIndex, onEnterView]);

  const hiddenByReveal = animateReveal && !isRevealed;

  const cardBlock = (
    <div
      className={`flex flex-col ${milestoneTileMaxWidthClass(entry.variant)} ${
        side === "left" ? "items-end" : "items-start"
      }`}
    >
      <TimelineDateLabel
        dateLabel={dateLabel}
        side={side}
        variant={entry.variant}
      />
      <button
        type="button"
        onClick={(e) => onOpen(entry.id, e.currentTarget)}
        className={`group w-full cursor-pointer ${MILESTONE_TILE_BUTTON}`}
        aria-label={`${entry.title}. Nhấn để xem chi tiết.`}
      >
        <MilestoneCard entry={entry} />
        <span
          className={`mt-1 block text-[10px] font-semibold text-accent opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 ${
            side === "left" ? "text-right" : "text-left"
          }`}
        >
          Xem chi tiết →
        </span>
      </button>
    </div>
  );

  return (
    <motion.li
      ref={ref}
      id={row.yearControlsId}
      className={`absolute left-0 right-0 list-none [content-visibility:auto] [contain-intrinsic-size:auto_220px] ${isCollapsing ? "overflow-hidden" : "overflow-visible"}`}
      initial={false}
      animate={{
        top: row.rowTop,
        height: isCollapsing ? 0 : rowHeight,
        opacity: hiddenByReveal ? 0 : isCollapsing ? 0 : 1,
        scale: isCollapsing ? 0.96 : 1,
        y: hiddenByReveal ? (reducedMotion ? 0 : 16) : 0,
      }}
      transition={{
        top: layoutT,
        height: layoutT,
        opacity: layoutT,
        scale: layoutT,
        y: reducedMotion
          ? { duration: 0.12 }
          : { type: "spring", damping: 26, stiffness: 280 },
      }}
    >
      <div className="grid h-full grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
        <div
          className={`flex flex-col justify-center ${
            side === "left" ? "items-end pr-1 sm:pr-3" : ""
          }`}
        >
          {side === "left" && cardBlock}
        </div>

        <div className="flex justify-center">
          <TimelineIconPill icon={entry.icon} accentClass={entry.accentClass} />
        </div>

        <div
          className={`flex flex-col justify-center ${
            side === "right" ? "items-start pl-1 sm:pl-3" : ""
          }`}
        >
          {side === "right" && cardBlock}
        </div>
      </div>
    </motion.li>
  );
}

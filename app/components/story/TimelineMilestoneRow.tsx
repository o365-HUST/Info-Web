"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import type { StoryTimelineEntry } from "@/app/data/storyTimeline";
import type { AlternatingRow } from "@/app/lib/alternatingTimeline";
import TimelineDateLabel from "@/app/components/story/TimelineDateLabel";
import TimelineIconPill from "@/app/components/story/TimelineIconPill";
import DefaultMilestoneCard from "@/app/components/story/cards/DefaultMilestoneCard";
import AchievementMilestoneCard from "@/app/components/story/cards/AchievementMilestoneCard";
import AlumniMilestoneCard from "@/app/components/story/cards/AlumniMilestoneCard";
import PhotoMilestoneCard from "@/app/components/story/cards/PhotoMilestoneCard";

interface TimelineMilestoneRowProps {
  row: AlternatingRow;
  isRevealed: boolean;
  animateReveal: boolean;
  reducedMotion: boolean;
  onOpen: (id: string, el: HTMLElement) => void;
  onEnterView: (index: number) => void;
}

function MilestoneCard({
  entry,
  iconOnRight,
}: {
  entry: StoryTimelineEntry;
  iconOnRight: boolean;
}) {
  switch (entry.variant) {
    case "achievement":
      return <AchievementMilestoneCard entry={entry} iconOnRight={iconOnRight} />;
    case "alumni":
      return <AlumniMilestoneCard entry={entry} iconOnRight={iconOnRight} />;
    case "photo":
      return <PhotoMilestoneCard entry={entry} iconOnRight={iconOnRight} />;
    case "founding":
    case "default":
    default:
      return <DefaultMilestoneCard entry={entry} iconOnRight={iconOnRight} />;
  }
}

export default function TimelineMilestoneRow({
  row,
  isRevealed,
  animateReveal,
  reducedMotion,
  onOpen,
  onEnterView,
}: TimelineMilestoneRowProps) {
  const ref = useRef<HTMLLIElement>(null);
  const { entry, side, index } = row;
  const iconOnRight = side === "left";

  useEffect(() => {
    if (!animateReveal || isRevealed) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([observed]) => {
        if (observed?.isIntersecting) {
          onEnterView(index);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animateReveal, isRevealed, index, onEnterView]);

  const hidden = animateReveal && !isRevealed;

  const cardBlock = (
    <button
      type="button"
      onClick={(e) => onOpen(entry.id, e.currentTarget)}
      className="group w-full max-w-[17.5rem] cursor-pointer rounded-full transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4 sm:max-w-[19rem]"
      aria-label={`${entry.title}. Nhấn để xem chi tiết.`}
    >
      <MilestoneCard entry={entry} iconOnRight={iconOnRight} />
      <span className="mt-1 block text-[10px] font-semibold text-accent opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        Xem chi tiết →
      </span>
    </button>
  );

  return (
    <motion.li
      ref={ref}
      className="absolute left-0 right-0 list-none"
      style={{ top: row.rowTop, height: row.iconY - row.rowTop + 110 }}
      initial={false}
      animate={
        hidden
          ? { opacity: 0, y: reducedMotion ? 0 : 16 }
          : { opacity: 1, y: 0 }
      }
      transition={
        reducedMotion
          ? { duration: 0.12 }
          : { type: "spring", damping: 26, stiffness: 280 }
      }
    >
      <div className="grid h-full grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
        <div
          className={`flex flex-col justify-center ${
            side === "left" ? "items-end pr-1 sm:pr-3" : ""
          }`}
        >
          {side === "left" && (
            <>
              <TimelineDateLabel dateLabel={entry.dateLabel ?? String(entry.year)} side={side} />
              {cardBlock}
            </>
          )}
        </div>

        <div className="flex justify-center">
          <TimelineIconPill icon={entry.icon} accentClass={entry.accentClass} />
        </div>

        <div
          className={`flex flex-col justify-center ${
            side === "right" ? "items-start pl-1 sm:pl-3" : ""
          }`}
        >
          {side === "right" && (
            <>
              <TimelineDateLabel dateLabel={entry.dateLabel ?? String(entry.year)} side={side} />
              {cardBlock}
            </>
          )}
        </div>
      </div>
    </motion.li>
  );
}

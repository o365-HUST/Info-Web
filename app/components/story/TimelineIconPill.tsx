"use client";

import type { StoryTimelineIcon } from "@/app/data/storyTimeline";
import { TIMELINE_RAIL_ICON_TACTILE } from "@/app/components/story/cards/milestoneTileStyles";
import {
  Award,
  Flag,
  GraduationCap,
  Heart,
  Image,
  Megaphone,
  Rocket,
  Sparkles,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<StoryTimelineIcon, LucideIcon> = {
  flag: Flag,
  trophy: Trophy,
  "graduation-cap": GraduationCap,
  image: Image,
  sparkles: Sparkles,
  users: Users,
  heart: Heart,
  rocket: Rocket,
  award: Award,
  megaphone: Megaphone,
};

interface TimelineIconPillProps {
  icon: StoryTimelineIcon;
  accentClass?: string;
  className?: string;
}

export default function TimelineIconPill({
  icon,
  accentClass = "bg-accent text-ink",
  className = "",
}: TimelineIconPillProps) {
  const Icon = ICON_MAP[icon] ?? Flag;

  return (
    <span
      className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${accentClass} ${TIMELINE_RAIL_ICON_TACTILE} ${className}`}
      aria-hidden="true"
    >
      <Icon className="h-5 w-5" strokeWidth={2.25} />
    </span>
  );
}

export { ICON_MAP };

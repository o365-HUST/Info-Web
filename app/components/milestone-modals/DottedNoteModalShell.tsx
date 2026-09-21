"use client";

import ModalShell from "./ModalShell";
import type { Milestone } from "@/app/types";
import {
  DOTTED_MODAL_CLOSE,
  dottedModalShellClass,
  milestoneDatePopClass,
  MODAL_OVERLAY_CLASS,
  STORY_MODAL_DATE_SHADOW,
} from "@/app/components/story/cards/milestoneTileStyles";
import { storyVariantForMilestone } from "./milestoneModalUtils";

interface DottedNoteModalShellProps {
  milestone: Milestone;
  titleId: string;
  dateLabel: string;
  title: string;
  maxWidthClass?: string;
  children: React.ReactNode;
  onClose: () => void;
  reducedMotion: boolean;
  closeRef: React.RefObject<HTMLButtonElement | null>;
}

export default function DottedNoteModalShell({
  milestone,
  titleId,
  dateLabel,
  title,
  maxWidthClass = "max-w-lg",
  children,
  onClose,
  reducedMotion,
  closeRef,
}: DottedNoteModalShellProps) {
  const variant = storyVariantForMilestone(milestone);
  const dateTint = milestoneDatePopClass(variant);

  return (
    <ModalShell
      onClose={onClose}
      reducedMotion={reducedMotion}
      closeRef={closeRef}
      ariaLabelledBy={titleId}
      overlayClassName={MODAL_OVERLAY_CLASS}
      closeButtonClassName={DOTTED_MODAL_CLOSE}
      dialogClassName={dottedModalShellClass(variant, maxWidthClass)}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-6 pt-11">
        <p
          className={`mb-2 font-display text-lg font-extrabold uppercase leading-none tracking-[0.14em] sm:text-xl ${dateTint} ${STORY_MODAL_DATE_SHADOW}`}
        >
          {dateLabel}
        </p>
        <h2
          id={titleId}
          className="mb-4 font-display text-xl font-extrabold leading-tight tracking-tight text-ink text-pretty sm:text-2xl"
        >
          {title}
        </h2>
        {children}
      </div>
    </ModalShell>
  );
}

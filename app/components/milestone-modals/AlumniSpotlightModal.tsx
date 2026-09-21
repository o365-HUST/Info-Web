"use client";

import { ExternalLink, Quote } from "lucide-react";
import MarkdownRenderer from "@/app/components/MarkdownRenderer";
import type { BlogPost, Milestone } from "@/app/types";
import DottedNoteModalShell from "./DottedNoteModalShell";
import RelatedPostLink from "./RelatedPostLink";
import {
  alumniInitials,
  modalDateLabel,
  modalTitle,
} from "./milestoneModalUtils";

interface AlumniSpotlightModalProps {
  milestone: Milestone;
  postsById: Record<string, BlogPost>;
  onClose: () => void;
  reducedMotion: boolean;
  closeRef: React.RefObject<HTMLButtonElement | null>;
}

export default function AlumniSpotlightModal({
  milestone,
  postsById,
  onClose,
  reducedMotion,
  closeRef,
}: AlumniSpotlightModalProps) {
  const title = modalTitle(milestone);
  const dateLabel = modalDateLabel(milestone);
  const initials = alumniInitials(title);

  return (
    <DottedNoteModalShell
      milestone={milestone}
      titleId="alumni-modal-title"
      dateLabel={dateLabel}
      title={title}
      maxWidthClass="max-w-2xl"
      onClose={onClose}
      reducedMotion={reducedMotion}
      closeRef={closeRef}
    >
      <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
        <div className="relative shrink-0">
          {milestone.alumniAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={milestone.alumniAvatar}
              alt={title}
              className="h-24 w-24 rounded-full border-2 border-dashed border-emerald-500/50 object-cover [box-shadow:var(--timeline-chunky-shadow)]"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-emerald-400/50 bg-[var(--story-pastel-green)] font-display text-2xl font-bold text-[var(--story-pop-alumni-strong)] [box-shadow:var(--timeline-chunky-shadow)]">
              {initials || "?"}
            </div>
          )}
        </div>

        <div className="mt-4 min-w-0 sm:mt-0 sm:ml-5 sm:flex-1">
          {milestone.alumniRole && (
            <p className="text-sm font-medium text-[var(--story-pop-alumni)]">
              {milestone.alumniRole}
            </p>
          )}
        </div>
      </div>

      {milestone.alumniQuote && (
        <blockquote className="relative mt-6 rounded-[var(--radius-2xl)] border-2 border-dashed border-emerald-400/40 bg-[var(--story-pastel-green)] px-5 py-4">
          <Quote
            className="absolute left-3 top-3 h-5 w-5 text-[var(--story-pop-alumni)] opacity-30"
            aria-hidden="true"
          />
          <p className="relative z-10 pl-6 text-base italic leading-relaxed text-ink text-pretty">
            {milestone.alumniQuote}
          </p>
        </blockquote>
      )}

      {milestone.description && (
        <div className="prose-o365 mt-5 text-sm text-ink-light">
          <MarkdownRenderer content={milestone.description} />
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {milestone.alumniLink && (
          <a
            href={milestone.alumniLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-dashed border-emerald-500/50 bg-[var(--story-pastel-green)] px-4 py-2.5 text-sm font-semibold text-[var(--story-pop-alumni-strong)] transition-[transform,box-shadow] hover:-translate-y-0.5 [box-shadow:var(--timeline-chunky-shadow)] active:shadow-[var(--timeline-chunky-shadow-press)]"
          >
            Xem hồ sơ
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>

      {milestone.relatedPostId && (
        <div className="mt-5 border-t border-dashed border-border/80 pt-4">
          <RelatedPostLink
            postId={milestone.relatedPostId}
            postsById={postsById}
          />
        </div>
      )}
    </DottedNoteModalShell>
  );
}

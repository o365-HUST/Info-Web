"use client";

import { ExternalLink, Quote } from "lucide-react";
import MarkdownRenderer from "@/app/components/MarkdownRenderer";
import type { BlogPost, Milestone } from "@/app/types";
import ModalShell from "./ModalShell";
import RelatedPostLink from "./RelatedPostLink";
import { MODAL_THEMES } from "./modalTheme";
import {
  alumniInitials,
  modalDateLabel,
  modalTitle,
  modalTypeLabel,
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
  const theme = MODAL_THEMES.alumni;
  const title = modalTitle(milestone);
  const dateLabel = modalDateLabel(milestone);
  const typeLabel = modalTypeLabel(milestone);
  const initials = alumniInitials(title);

  return (
    <ModalShell
      onClose={onClose}
      reducedMotion={reducedMotion}
      closeRef={closeRef}
      ariaLabelledBy="alumni-modal-title"
      overlayClassName="bg-[#071525]/75"
      closeButtonClassName="bg-surface text-ink-muted hover:bg-card hover:text-ink"
      dialogClassName="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl border border-emerald-500/25 bg-surface shadow-lg"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-emerald-500/15 to-transparent"
        aria-hidden="true"
      />

      <div className="relative overflow-y-auto px-6 pb-6 pt-14">
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
          <div className="relative shrink-0">
            {milestone.alumniAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={milestone.alumniAvatar}
                alt={title}
                className="h-24 w-24 rounded-full border-4 border-emerald-400/40 object-cover shadow-md ring-4 ring-emerald-500/10"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-emerald-400/40 bg-emerald-100 font-display text-2xl font-bold text-emerald-800 shadow-md ring-4 ring-emerald-500/10 dark:bg-emerald-900/40 dark:text-emerald-200">
                {initials || "?"}
              </div>
            )}
          </div>

          <div className="mt-4 min-w-0 sm:mt-0 sm:ml-5 sm:flex-1">
            <div className="mb-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span
                className={`inline-flex items-center rounded-md border-2 px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider tabular-nums ${theme.stamp} ${theme.stampBorder}`}
              >
                {dateLabel}
              </span>
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider ${theme.chip}`}
              >
                {typeLabel}
              </span>
            </div>
            <h2
              id="alumni-modal-title"
              className="font-display text-2xl font-extrabold leading-tight tracking-tight text-ink text-pretty"
            >
              {title}
            </h2>
            {milestone.alumniRole && (
              <p className="mt-1 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                {milestone.alumniRole}
              </p>
            )}
          </div>
        </div>

        {milestone.alumniQuote && (
          <blockquote className="relative mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-4">
            <Quote
              className="absolute left-3 top-3 h-5 w-5 text-emerald-500/30"
              aria-hidden="true"
            />
            <p className="relative z-10 pl-6 text-base italic leading-relaxed text-ink text-pretty">
              {milestone.alumniQuote}
            </p>
          </blockquote>
        )}

        {milestone.description && (
          <div className="prose-o365 mt-5 text-sm">
            <MarkdownRenderer content={milestone.description} />
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {milestone.alumniLink && (
            <a
              href={milestone.alumniLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Xem hồ sơ
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>

        {milestone.relatedPostId && (
          <div className="mt-5 border-t border-border/60 pt-4">
            <RelatedPostLink
              postId={milestone.relatedPostId}
              postsById={postsById}
            />
          </div>
        )}
      </div>
    </ModalShell>
  );
}

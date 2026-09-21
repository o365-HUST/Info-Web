"use client";

import MarkdownRenderer from "@/app/components/MarkdownRenderer";
import type { BlogPost, Milestone } from "@/app/types";
import DottedNoteModalShell from "./DottedNoteModalShell";
import RelatedPostLink from "./RelatedPostLink";
import { modalDateLabel, modalTitle } from "./milestoneModalUtils";

interface MocNoteModalProps {
  milestone: Milestone;
  postsById: Record<string, BlogPost>;
  onClose: () => void;
  reducedMotion: boolean;
  closeRef: React.RefObject<HTMLButtonElement | null>;
}

export default function MocNoteModal({
  milestone,
  postsById,
  onClose,
  reducedMotion,
  closeRef,
}: MocNoteModalProps) {
  const title = modalTitle(milestone);
  const dateLabel = modalDateLabel(milestone);
  const hasImages =
    Array.isArray(milestone.images) && milestone.images.length > 0;

  return (
    <DottedNoteModalShell
      milestone={milestone}
      titleId="moc-modal-title"
      dateLabel={dateLabel}
      title={title}
      onClose={onClose}
      reducedMotion={reducedMotion}
      closeRef={closeRef}
    >
      {milestone.description && (
        <div className="prose-o365 text-sm text-ink-light">
          <MarkdownRenderer content={milestone.description} />
        </div>
      )}

      {hasImages && (
        <div className="mt-4 flex snap-x gap-3 overflow-x-auto pb-1">
          {milestone.images!.map((src, idx) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`${src}-${idx}`}
              src={src}
              alt={`${title} - hình ${idx + 1}`}
              className="aspect-[4/3] w-48 shrink-0 snap-start rounded-2xl border-2 border-dashed border-ink/25 object-cover [box-shadow:var(--timeline-chunky-shadow)]"
            />
          ))}
        </div>
      )}

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

"use client";

import MarkdownRenderer from "@/app/components/MarkdownRenderer";
import type { BlogPost, Milestone } from "@/app/types";
import ModalShell from "./ModalShell";
import RelatedPostLink from "./RelatedPostLink";
import { MODAL_THEMES, PAPER_GRAIN } from "./modalTheme";
import {
  modalDateLabel,
  modalTitle,
  modalTypeLabel,
} from "./milestoneModalUtils";

interface ThanhTichNoteModalProps {
  milestone: Milestone;
  postsById: Record<string, BlogPost>;
  onClose: () => void;
  reducedMotion: boolean;
  closeRef: React.RefObject<HTMLButtonElement | null>;
}

export default function ThanhTichNoteModal({
  milestone,
  postsById,
  onClose,
  reducedMotion,
  closeRef,
}: ThanhTichNoteModalProps) {
  const theme = MODAL_THEMES.thanh_tich;
  const title = modalTitle(milestone);
  const dateLabel = modalDateLabel(milestone);
  const typeLabel = modalTypeLabel(milestone);
  const hasImages =
    Array.isArray(milestone.images) && milestone.images.length > 0;

  return (
    <ModalShell
      onClose={onClose}
      reducedMotion={reducedMotion}
      closeRef={closeRef}
      ariaLabelledBy="thanh-tich-modal-title"
      overlayClassName="bg-black/45"
      closeButtonClassName="bg-[#fff5f9] text-[#831843] hover:bg-[#fce7f3]"
      dialogClassName="relative w-full max-w-lg max-h-[85vh] overflow-hidden rounded-2xl shadow-lg"
    >
      <div
        className="flex max-h-[85vh] flex-col p-3"
        style={{
          backgroundColor: theme.outer,
          backgroundImage: PAPER_GRAIN,
        }}
      >
        <div
          className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl p-4"
          style={{
            backgroundColor: theme.inner,
            backgroundImage: PAPER_GRAIN,
          }}
        >
          <div
            className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-lg px-1 py-2"
            style={{
              backgroundImage: `${PAPER_GRAIN}, repeating-linear-gradient(transparent, transparent 17px, ${theme.lineColor} 17px, ${theme.lineColor} 18px)`,
            }}
          >
            <div className="mb-3 flex flex-wrap items-center gap-2 pr-8">
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
              id="thanh-tich-modal-title"
              className={`mb-4 font-display text-xl font-extrabold leading-tight tracking-tight text-pretty ${theme.ink}`}
            >
              {title}
            </h2>

            {milestone.description && (
              <div className={`prose-o365 text-sm ${theme.inkMuted}`}>
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
                    alt={`${title} — hình ${idx + 1}`}
                    className="aspect-[4/3] w-48 shrink-0 snap-start rounded-lg border border-black/10 object-cover shadow-sm"
                  />
                ))}
              </div>
            )}

            {milestone.relatedPostId && (
              <div className="mt-5 border-t border-black/8 pt-4">
                <RelatedPostLink
                  postId={milestone.relatedPostId}
                  postsById={postsById}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

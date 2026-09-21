"use client";

import { useState, type KeyboardEvent, type MouseEvent } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import MarkdownRenderer from "@/app/components/MarkdownRenderer";
import type { BlogPost, Milestone } from "@/app/types";
import {
  PHOTO_FRAME_IMAGE_CLASS,
  PHOTO_FRAME_PADDING_CLASS,
} from "@/app/lib/milestoneBoard";
import {
  DOTTED_MODAL_CLOSE,
  dottedSurfaceClass,
  milestoneDatePopClass,
} from "@/app/components/story/cards/milestoneTileStyles";
import RelatedPostLink from "./RelatedPostLink";
import { modalDateLabel, modalTitle } from "./milestoneModalUtils";

interface PhotoFrameModalProps {
  milestone: Milestone;
  postsById: Record<string, BlogPost>;
  onClose: () => void;
  reducedMotion: boolean;
  closeRef: React.RefObject<HTMLButtonElement | null>;
}

export default function PhotoFrameModal({
  milestone,
  postsById,
  onClose,
  reducedMotion,
  closeRef,
}: PhotoFrameModalProps) {
  const title = modalTitle(milestone);
  const dateLabel = modalDateLabel(milestone);
  const cover = milestone.images?.[0];
  const [showBack, setShowBack] = useState(false);
  const dateTint = milestoneDatePopClass("photo");
  const panelClass = `${dottedSurfaceClass("photo")} overflow-hidden p-3`;

  const toggleSide = () => setShowBack((value) => !value);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="absolute inset-0 bg-black/45"
        onClick={onClose}
        aria-hidden="true"
      />

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Đóng"
        className={`absolute right-4 top-4 z-[70] ${DOTTED_MODAL_CLOSE}`}
      >
        <X className="h-4 w-4" />
      </button>

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="photo-modal-title"
        className="relative z-[61] w-full max-w-[min(100%,23rem)]"
        initial={reducedMotion ? false : { scale: 0.96, y: 8, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={reducedMotion ? { opacity: 0 } : { scale: 0.98, opacity: 0 }}
        transition={{ type: "spring", duration: 0.3, bounce: 0 }}
      >
        <p
          className={`mb-2 text-center font-display text-lg font-extrabold uppercase tracking-[0.14em] sm:text-xl ${dateTint}`}
        >
          {dateLabel}
        </p>

        <div
          className="w-full"
          style={{
            perspective: reducedMotion ? undefined : "1400px",
          }}
        >
          <div
            className={`relative grid w-full [grid-template-areas:'stack'] ${
              reducedMotion
                ? ""
                : "transition-transform duration-500 [transform-style:preserve-3d]"
            }`}
            style={{
              transform: reducedMotion
                ? undefined
                : showBack
                  ? "rotateY(180deg)"
                  : "rotateY(0deg)",
            }}
            aria-live="polite"
          >
            {reducedMotion ? (
              showBack ? (
                <FrameBack
                  milestone={milestone}
                  postsById={postsById}
                  panelClass={panelClass}
                  onFlip={toggleSide}
                />
              ) : (
                <FrameFront
                  title={title}
                  cover={cover}
                  panelClass={panelClass}
                  onFlip={toggleSide}
                />
              )
            ) : (
              <>
                <div
                  className="[grid-area:stack] [backface-visibility:hidden]"
                  aria-hidden={showBack}
                >
                  <FrameFront
                    title={title}
                    cover={cover}
                    panelClass={panelClass}
                    onFlip={toggleSide}
                  />
                </div>
                <div
                  className="[grid-area:stack] [backface-visibility:hidden]"
                  style={{ transform: "rotateY(180deg)" }}
                  aria-hidden={!showBack}
                >
                  <FrameBack
                    milestone={milestone}
                    postsById={postsById}
                    panelClass={panelClass}
                    onFlip={toggleSide}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <h2 id="photo-modal-title" className="sr-only">
          {title}
        </h2>
      </motion.div>
    </motion.div>
  );
}

function FrameFront({
  title,
  cover,
  panelClass,
  onFlip,
}: {
  title: string;
  cover?: string;
  panelClass: string;
  onFlip: () => void;
}) {
  return (
    <FramePanel panelClass={panelClass}>
      <FlipPhotoZone
        onFlip={onFlip}
        label={cover ? `Lật khung ảnh: ${title}` : "Lật khung ảnh"}
      >
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={title}
            className="h-full w-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-ink-muted">
            Chưa có ảnh
          </div>
        )}
      </FlipPhotoZone>

      <div className="flex shrink-0 flex-col items-center px-1 pt-2 pb-0.5">
        <p className="text-center font-display text-sm font-bold leading-snug text-ink">
          {title}
        </p>
      </div>
    </FramePanel>
  );
}

function FrameBack({
  milestone,
  postsById,
  panelClass,
  onFlip,
}: {
  milestone: Milestone;
  postsById: Record<string, BlogPost>;
  panelClass: string;
  onFlip: () => void;
}) {
  return (
    <FramePanel panelClass={panelClass}>
      <FlipPhotoZone onFlip={onFlip} label="Xem mặt trước khung ảnh">
        <div className="flex h-full min-h-0 flex-col overflow-y-auto px-2 py-2 text-left">
          {milestone.description ? (
            <div className="prose-o365 text-sm text-ink-light">
              <MarkdownRenderer content={milestone.description} />
            </div>
          ) : (
            <p className="text-sm italic text-ink-muted">
              Chưa có ghi chú ở mặt sau khung.
            </p>
          )}

          {milestone.relatedPostId && (
            <div className="mt-3 border-t border-dashed border-border/80 pt-3">
              <RelatedPostLink
                postId={milestone.relatedPostId}
                postsById={postsById}
              />
            </div>
          )}
        </div>
      </FlipPhotoZone>

      <div className="flex shrink-0 flex-col items-center px-1 pt-2 pb-0.5">
        <p className="mt-0.5 text-center text-[11px] text-ink-muted">
          Chạm ảnh để lật
        </p>
      </div>
    </FramePanel>
  );
}

function FlipPhotoZone({
  children,
  onFlip,
  label,
}: {
  children: React.ReactNode;
  onFlip: () => void;
  label: string;
}) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if ((event.target as HTMLElement).closest("a")) return;
    onFlip();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onFlip();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={label}
      className={`${PHOTO_FRAME_IMAGE_CLASS} relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-violet-500/45 bg-violet-100 outline-none transition-[filter] hover:brightness-[0.97] focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 dark:bg-violet-950`}
    >
      {children}
    </button>
  );
}

function FramePanel({
  children,
  panelClass,
}: {
  children: React.ReactNode;
  panelClass: string;
}) {
  return (
    <div className={`flex w-full flex-col ${PHOTO_FRAME_PADDING_CLASS} ${panelClass}`}>
      {children}
    </div>
  );
}

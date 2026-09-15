"use client";

import { useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import MarkdownRenderer from "@/app/components/MarkdownRenderer";
import type { BlogPost, Milestone } from "@/app/types";
import {
  PHOTO_FRAME_IMAGE_CLASS,
  PHOTO_FRAME_PADDING_CLASS,
} from "@/app/lib/milestoneBoard";
import RelatedPostLink from "./RelatedPostLink";
import { MODAL_THEMES, PAPER_GRAIN } from "./modalTheme";
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
  const theme = MODAL_THEMES.photo;
  const title = modalTitle(milestone);
  const dateLabel = modalDateLabel(milestone);
  const cover = milestone.images?.[0];
  const [showBack, setShowBack] = useState(false);

  const toggleSide = () => setShowBack((value) => !value);

  const frameStyle = {
    backgroundColor: theme.inner,
    backgroundImage: PAPER_GRAIN,
    boxShadow:
      "1px 2px 0 rgba(0,0,0,0.06), 4px 10px 24px rgba(0,0,0,0.18)",
  } as const;

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        aria-hidden="true"
      />

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Đóng"
        className="absolute right-4 top-4 z-[70] flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-neutral-700 shadow-md transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-white"
      >
        <X className="h-4 w-4" />
      </button>

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="photo-modal-title"
        className="relative z-[61] w-full max-w-[340px]"
        initial={reducedMotion ? false : { scale: 0.96, y: 8, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={reducedMotion ? { opacity: 0 } : { scale: 0.98, opacity: 0 }}
        transition={{ type: "spring", duration: 0.3, bounce: 0 }}
      >
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
                  theme={theme}
                  frameStyle={frameStyle}
                  onFlip={toggleSide}
                />
              ) : (
                <FrameFront
                  title={title}
                  dateLabel={dateLabel}
                  cover={cover}
                  theme={theme}
                  frameStyle={frameStyle}
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
                    dateLabel={dateLabel}
                    cover={cover}
                    theme={theme}
                    frameStyle={frameStyle}
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
                    theme={theme}
                    frameStyle={frameStyle}
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
  dateLabel,
  cover,
  theme,
  frameStyle,
  onFlip,
}: {
  title: string;
  dateLabel: string;
  cover?: string;
  theme: (typeof MODAL_THEMES)["photo"];
  frameStyle: CSSProperties;
  onFlip: () => void;
}) {
  return (
    <FramePanel frameStyle={frameStyle}>
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
          <div className="flex h-full items-center justify-center text-sm text-neutral-400">
            Chưa có ảnh
          </div>
        )}
      </FlipPhotoZone>

      <div className="flex shrink-0 flex-col items-center px-1 pt-2 pb-0.5">
        <p
          className={`text-center font-display text-sm font-bold leading-snug ${theme.ink}`}
        >
          {title}
        </p>
        <p
          className={`mt-0.5 text-center font-mono text-[11px] tabular-nums ${theme.inkMuted}`}
        >
          {dateLabel}
        </p>
      </div>
    </FramePanel>
  );
}

function FrameBack({
  milestone,
  postsById,
  theme,
  frameStyle,
  onFlip,
}: {
  milestone: Milestone;
  postsById: Record<string, BlogPost>;
  theme: (typeof MODAL_THEMES)["photo"];
  frameStyle: CSSProperties;
  onFlip: () => void;
}) {
  return (
    <FramePanel frameStyle={frameStyle}>
      <FlipPhotoZone onFlip={onFlip} label="Xem mặt trước khung ảnh">
        <div className="flex h-full min-h-0 flex-col overflow-y-auto px-2 py-2 text-left">
          {milestone.description ? (
            <div className={`prose-o365 text-sm ${theme.ink}`}>
              <MarkdownRenderer content={milestone.description} />
            </div>
          ) : (
            <p className={`text-sm italic ${theme.inkMuted}`}>
              Chưa có ghi chú ở mặt sau khung.
            </p>
          )}

          {milestone.relatedPostId && (
            <div className="mt-3 border-t border-black/10 pt-3">
              <RelatedPostLink
                postId={milestone.relatedPostId}
                postsById={postsById}
              />
            </div>
          )}
        </div>
      </FlipPhotoZone>

      <div className="flex shrink-0 flex-col items-center px-1 pt-2 pb-0.5">
        <p className={`mt-0.5 text-center text-[11px] ${theme.inkMuted}`}>
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
      className={`${PHOTO_FRAME_IMAGE_CLASS} relative cursor-pointer overflow-hidden bg-neutral-100 outline outline-1 outline-black/8 transition-[filter] hover:brightness-[0.97] focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2`}
    >
      {children}
    </button>
  );
}

function FramePanel({
  children,
  frameStyle,
}: {
  children: React.ReactNode;
  frameStyle: CSSProperties;
}) {
  return (
    <div
      className={`flex w-full flex-col overflow-hidden rounded-sm border-2 border-white/90 dark:border-[#e8e4dc]/20 ${PHOTO_FRAME_PADDING_CLASS}`}
      style={frameStyle}
    >
      {children}
    </div>
  );
}

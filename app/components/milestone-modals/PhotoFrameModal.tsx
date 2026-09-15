"use client";

import { useState, type CSSProperties } from "react";
import { motion } from "motion/react";
import { RotateCw, X } from "lucide-react";
import MarkdownRenderer from "@/app/components/MarkdownRenderer";
import type { BlogPost, Milestone } from "@/app/types";
import RelatedPostLink from "./RelatedPostLink";
import { MODAL_THEMES, PAPER_GRAIN } from "./modalTheme";
import { modalDateLabel, modalTitle } from "./milestoneModalUtils";

/** Fixed frame height so front and back match during flip. */
const FRAME_HEIGHT_PX = 468;
const PHOTO_HEIGHT_PX = 280;

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

  const toggleSide = () => setShowBack((v) => !v);

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
            className={`relative w-full ${reducedMotion ? "" : "transition-transform duration-500 [transform-style:preserve-3d]"}`}
            style={{
              height: FRAME_HEIGHT_PX,
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
                  frameStyle={frameStyle}
                  onToggle={toggleSide}
                  showBack={showBack}
                />
              ) : (
                <FrameFront
                  title={title}
                  dateLabel={dateLabel}
                  cover={cover}
                  theme={theme}
                  frameStyle={frameStyle}
                  onToggle={toggleSide}
                  showBack={showBack}
                />
              )
            ) : (
              <>
                <div
                  className="absolute inset-0 [backface-visibility:hidden]"
                  aria-hidden={showBack}
                >
                  <FrameFront
                    title={title}
                    dateLabel={dateLabel}
                    cover={cover}
                    theme={theme}
                    frameStyle={frameStyle}
                    onToggle={toggleSide}
                    showBack={showBack}
                  />
                </div>
                <div
                  className="absolute inset-0 [backface-visibility:hidden]"
                  style={{ transform: "rotateY(180deg)" }}
                  aria-hidden={!showBack}
                >
                  <FrameBack
                    milestone={milestone}
                    postsById={postsById}
                    frameStyle={frameStyle}
                    onToggle={toggleSide}
                    showBack={showBack}
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
  onToggle,
  showBack,
}: {
  title: string;
  dateLabel: string;
  cover?: string;
  theme: (typeof MODAL_THEMES)["photo"];
  frameStyle: CSSProperties;
  onToggle: () => void;
  showBack: boolean;
}) {
  return (
    <FramePanel frameStyle={frameStyle}>
      <div
        className="w-full shrink-0 overflow-hidden bg-neutral-100 outline outline-1 outline-black/8"
        style={{ height: PHOTO_HEIGHT_PX }}
      >
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-neutral-400">
            Chưa có ảnh
          </div>
        )}
      </div>
      <div className="flex shrink-0 flex-col items-center px-1 pt-3 pb-1">
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
      <FlipButton onToggle={onToggle} showBack={showBack} label="Lật khung" />
    </FramePanel>
  );
}

function FrameBack({
  milestone,
  postsById,
  frameStyle,
  onToggle,
  showBack,
}: {
  milestone: Milestone;
  postsById: Record<string, BlogPost>;
  frameStyle: CSSProperties;
  onToggle: () => void;
  showBack: boolean;
}) {
  return (
    <FramePanel
      frameStyle={{
        ...frameStyle,
        backgroundColor: "#c9a87c",
        boxShadow:
          "inset 0 0 0 1px rgba(255,255,255,0.12), 4px 10px 24px rgba(0,0,0,0.18)",
      }}
    >
      <p className="mb-2 shrink-0 text-[10px] font-semibold uppercase tracking-wider text-[#5c4030]">
        Mặt sau khung
      </p>

      <div
        className="min-h-0 flex-1 overflow-y-auto pr-0.5"
        style={{ maxHeight: PHOTO_HEIGHT_PX + 52 }}
      >
        {milestone.description ? (
          <div className="prose-o365 text-sm text-[#431407]">
            <MarkdownRenderer content={milestone.description} />
          </div>
        ) : (
          <p className="text-sm italic text-[#7c2d12]/80">
            Chưa có ghi chú ở mặt sau khung.
          </p>
        )}

        {milestone.relatedPostId && (
          <div className="mt-3 border-t border-[#7c2d12]/15 pt-3">
            <RelatedPostLink
              postId={milestone.relatedPostId}
              postsById={postsById}
              className="border-[#7c2d12]/15 bg-[#fffaf5]/80 hover:border-[#c2410c]/30"
            />
          </div>
        )}
      </div>

      <FlipButton
        onToggle={onToggle}
        showBack={showBack}
        label="Xem ảnh"
        variant="back"
      />
    </FramePanel>
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
      className="flex h-full w-full flex-col overflow-hidden rounded-sm border-2 border-white/95 p-3 dark:border-[#e8e4dc]/25"
      style={frameStyle}
    >
      {children}
    </div>
  );
}

function FlipButton({
  onToggle,
  showBack,
  label,
  variant = "front",
}: {
  onToggle: () => void;
  showBack: boolean;
  label: string;
  variant?: "front" | "back";
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={showBack}
      className={`mt-auto flex w-full shrink-0 items-center justify-center gap-1.5 rounded-md border py-2 text-xs font-semibold transition-colors ${
        variant === "back"
          ? "border-[#5c4030]/20 bg-[#5c4030]/10 text-[#431407] hover:bg-[#5c4030]/15"
          : "border-black/10 bg-black/5 text-[#431407] hover:bg-black/10"
      }`}
    >
      <RotateCw className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

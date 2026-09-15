"use client";

import { motion } from "motion/react";
import { X } from "lucide-react";

interface ModalShellProps {
  children: React.ReactNode;
  onClose: () => void;
  reducedMotion: boolean;
  closeRef: React.RefObject<HTMLButtonElement | null>;
  ariaLabelledBy: string;
  overlayClassName: string;
  dialogClassName?: string;
  closeButtonClassName?: string;
  showClose?: boolean;
}

export default function ModalShell({
  children,
  onClose,
  reducedMotion,
  closeRef,
  ariaLabelledBy,
  overlayClassName,
  dialogClassName = "relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden",
  closeButtonClassName = "bg-surface text-ink-muted hover:bg-card hover:text-ink",
  showClose = true,
}: ModalShellProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`absolute inset-0 ${overlayClassName}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        className={dialogClassName}
        initial={reducedMotion ? false : { scale: 0.96, y: 10, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={reducedMotion ? { opacity: 0 } : { scale: 0.98, opacity: 0 }}
        transition={{ type: "spring", duration: 0.3, bounce: 0 }}
      >
        {showClose && (
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className={`absolute right-3 top-3 z-20 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-accent ${closeButtonClassName}`}
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {children}
      </motion.div>
    </motion.div>
  );
}

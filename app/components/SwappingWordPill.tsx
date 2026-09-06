"use client";

import { motion, AnimatePresence } from "motion/react";

export interface SwappingPhrase {
  text: string;
  bg: string;
  border: string;
  dotColor: string;
  textColor: string;
}

export const HERO_PHRASES: SwappingPhrase[] = [
  {
    text: "Sáng tạo cùng công nghệ",
    bg: "#F7EEDD", // Soft warm amber
    border: "#EADDC6",
    dotColor: "#C98A2C",
    textColor: "#5E3B0C",
  },
  {
    text: "Bứt phá kỹ năng số",
    bg: "#ECE7F9", // Soft lavender
    border: "#DCD5F0",
    dotColor: "#7C52CE",
    textColor: "#3A2275",
  },
  {
    text: "Học hỏi chuẩn quốc tế",
    bg: "#DCF2E7", // Soft sage mint
    border: "#C7E6D6",
    dotColor: "#2D8A58",
    textColor: "#13492D",
  },
  {
    text: "Kết nối cộng đồng số",
    bg: "#E3EDF9", // Soft azure blue
    border: "#CDE0F3",
    dotColor: "#26406B",
    textColor: "#172A47",
  },
  {
    text: "Chinh phục MOSWC đỉnh cao",
    bg: "#FCEBE6", // Soft peach rose
    border: "#F1D4CD",
    dotColor: "#C95A40",
    textColor: "#6B2717",
  },
];

interface SwappingWordPillProps {
  phrases?: SwappingPhrase[];
  currentIndex: number;
  onNext: () => void;
  className?: string;
}

export default function SwappingWordPill({
  phrases = HERO_PHRASES,
  currentIndex,
  onNext,
  className = "",
}: SwappingWordPillProps) {
  const current = phrases[currentIndex] || phrases[0];

  return (
    <motion.button
      type="button"
      onClick={onNext}
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.96 }}
      layout
      transition={{ layout: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
      className={`inline-flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-5 py-1 sm:py-1.5 rounded-full border shadow-sm select-none cursor-pointer transition-colors duration-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink align-middle ${className}`}
      style={{
        backgroundColor: current.bg,
        borderColor: current.border,
        color: current.textColor,
      }}
      aria-label={`Đổi khẩu hiệu. Đang hiển thị: ${current.text}. Bấm để chuyển tiếp`}
      title="Bấm để đổi ngay"
    >
      {/* Pulsing indicator dot */}
      <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3 items-center justify-center shrink-0">
        <span
          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
          style={{ backgroundColor: current.dotColor }}
        />
        <span
          className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 transition-colors duration-400"
          style={{ backgroundColor: current.dotColor }}
        />
      </span>

      {/* Swapping Text */}
      <span className="relative overflow-hidden inline-flex items-center min-h-[1.4em]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={current.text}
            initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 28,
              mass: 0.8,
            }}
            className="inline-block whitespace-nowrap font-bold tracking-tight text-lg sm:text-2xl lg:text-3xl"
          >
            {current.text}
          </motion.span>
        </AnimatePresence>
      </span>
    </motion.button>
  );
}

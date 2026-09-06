"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import SwappingWordPill, { HERO_PHRASES } from "./SwappingWordPill";
import { Users, Sparkles, ArrowRight } from "lucide-react";

export default function Hero() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isPhraseHovered, setIsPhraseHovered] = useState(false);

  // Auto-swap phrases every 3.5s unless hovered
  useEffect(() => {
    if (isPhraseHovered) return;
    const timer = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % HERO_PHRASES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isPhraseHovered]);

  const handleNextPhrase = () => {
    setPhraseIndex((prev) => (prev + 1) % HERO_PHRASES.length);
  };

  return (
    <section
      id="top"
      className="relative pt-28 sm:pt-36 pb-12 sm:pb-16 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(var(--ink) 0.75px, transparent 0.75px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-5 sm:px-6 w-full flex flex-col items-center text-center z-10">
        {/* Top mini club tag */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-6 border border-border/80 bg-surface/80 text-ink-light backdrop-blur-xs shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>Đại sứ Chuyển đổi số • ĐHBK Hà Nội</span>
        </motion.div>

        {/* Main Headline spanning fully */}
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-extrabold text-4xl sm:text-6xl lg:text-[4rem] text-ink tracking-tight leading-[1.25] sm:leading-[1.2]"
          >
            Nơi sinh viên{" "}
            <span className="relative inline-block text-[#C41230] font-extrabold tracking-tight">
              Bách Khoa
              <svg
                aria-hidden="true"
                viewBox="0 0 160 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute -bottom-1 sm:-bottom-1.5 left-0 w-full h-2 sm:h-2.5 text-[#F3C409] select-none pointer-events-none"
              >
                <path
                  d="M 3 8.5 C 45 3.5, 115 3.5, 157 7.5"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            ,
          </motion.h1>

          {/* Second line with inline swapping pill + doodle annotation */}
          <motion.div
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.1,
              layout: { type: "spring", stiffness: 180, damping: 24, mass: 0.8 },
            }}
            className="relative mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
            onMouseEnter={() => setIsPhraseHovered(true)}
            onMouseLeave={() => setIsPhraseHovered(false)}
          >
            <SwappingWordPill
              currentIndex={phraseIndex}
              onNext={handleNextPhrase}
            />

            {/* Hand-drawn SVG doodle arrow + Dancing Script annotation (Notion style) */}
            <motion.div
              layout
              transition={{
                layout: { type: "spring", stiffness: 180, damping: 24, mass: 0.8 },
              }}
              className="hidden sm:inline-flex items-center gap-1.5 ml-1 select-none pointer-events-none"
            >
              <svg
                width="36"
                height="26"
                viewBox="0 0 38 28"
                fill="none"
                className="text-ink-muted/70 -rotate-3"
              >
                <path
                  d="M3 14 C 14 6, 24 16, 32 18"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeDasharray="1 0"
                />
                <path
                  d="M24 13 L 33 19 L 26 23"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-display text-lg lg:text-xl text-ink-light font-medium tracking-wide rotate-[-3deg]">
                thử click vào đây nè ✦
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Interactive Word Progress Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex items-center justify-center gap-1.5 mt-4 mb-6"
          aria-label="Chọn cụm từ khẩu hiệu"
        >
          {HERO_PHRASES.map((phrase, idx) => {
            const isActive = idx === phraseIndex;
            return (
              <button
                key={phrase.text}
                type="button"
                onClick={() => setPhraseIndex(idx)}
                title={phrase.text}
                aria-label={`Chuyển đến: ${phrase.text}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "w-7 bg-ink"
                    : "w-2 bg-border hover:bg-ink-muted"
                }`}
              />
            );
          })}
        </motion.div>

        {/* Centered Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto mb-8"
          style={{ color: "var(--ink-light)" }}
        >
          Một chỗ đứng cho những ai muốn học, làm, và kết nối cùng nhau tại Đại học Bách khoa Hà Nội. Đồng hành bồi dưỡng kỹ năng tin học văn phòng quốc tế và chuẩn bị cho MOSWC.
        </motion.p>

        {/* Centered CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto"
        >
          <a
            href="#events"
            onClick={(e) => {
              e.preventDefault();
              document
                .querySelector("#events")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--ink)",
            }}
          >
            <span>Xem sự kiện sắp tới</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#departments"
            onClick={(e) => {
              e.preventDefault();
              document
                .querySelector("#departments")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center justify-center px-7 py-3 rounded-lg text-sm font-semibold transition-all hover:bg-card/70 hover:border-ink-muted/50"
            style={{
              backgroundColor: "transparent",
              color: "var(--ink-light)",
              border: "1px solid var(--border)",
            }}
          >
            Tìm hiểu các ban
          </a>
        </motion.div>
      </div>
    </section>
  );
}

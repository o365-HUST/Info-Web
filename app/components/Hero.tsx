"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import {
  RECRUITMENT_INFO,
  HERO_TAGLINE,
  HERO_ROLE_LINE,
} from "@/app/data/clubData";
import { PHOTO_ASSETS } from "@/app/data/photoAssets";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[100svh] flex items-end overflow-hidden bg-[var(--bg)]"
    >
      <div className="hero-media" aria-hidden="true">
        <Image
          src={PHOTO_ASSETS.heroCampus}
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-105"
          unoptimized={PHOTO_ASSETS.heroCampus.endsWith(".svg")}
        />
        <div className="photo-scrim" />
        <div className="photo-scrim-bottom" />
      </div>

      <div className="relative z-10 w-full max-w-[var(--max-width)] mx-auto px-5 sm:px-8 pb-16 sm:pb-20 pt-[calc(var(--nav-height)+3rem)]">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.2, 0, 0, 1] }}
          className="font-display text-[11px] sm:text-xs font-semibold tracking-[0.28em] uppercase text-accent mb-5"
        >
          Câu lạc bộ · Đại học Bách khoa Hà Nội
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.2, 0, 0, 1] }}
          className="font-display font-extrabold tracking-tight leading-[0.92] text-ink mb-6"
        >
          <span className="block text-[clamp(3.25rem,12vw,7.5rem)]">o365</span>
          <span className="block text-[clamp(2.5rem,9vw,5.5rem)] text-accent">
            HUST
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18, ease: [0.2, 0, 0, 1] }}
          className="max-w-xl"
        >
          <h2 className="text-xl sm:text-2xl lg:text-[1.75rem] font-bold text-ink leading-snug mb-3">
            {HERO_ROLE_LINE}
          </h2>
          <p className="text-[15px] sm:text-base text-ink-light leading-relaxed mb-8 max-w-lg">
            {HERO_TAGLINE}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a
              href={RECRUITMENT_INFO.formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg text-[15px] font-semibold text-accent-fg bg-accent hover:bg-accent-hover active:scale-[0.96] transition-[background-color,scale] duration-150 focus-visible:outline-2 focus-visible:outline-accent shadow-card"
              aria-label="Tham gia ngay CLB o365 (mở trong tab mới)"
            >
              <span>Tham gia ngay</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-lg text-[15px] font-semibold text-ink border border-border hover:border-border-strong hover:bg-surface/80 active:scale-[0.96] transition-[border-color,background-color,scale] duration-150 focus-visible:outline-2 focus-visible:outline-accent"
            >
              Về chúng tôi
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

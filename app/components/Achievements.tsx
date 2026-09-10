"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ADVISORS } from "@/app/data/clubData";
import { PHOTO_ASSETS } from "@/app/data/photoAssets";
import type { Advisor } from "@/app/types";

const APP_THEME: Record<
  Advisor["app"],
  { color: string; icon: string; aria: string }
> = {
  excel: {
    color: "#217346",
    icon: "/assets/icon/excel.svg",
    aria: "Microsoft Excel",
  },
  powerpoint: {
    color: "#C43E1C",
    icon: "/assets/icon/ppt.svg",
    aria: "Microsoft PowerPoint",
  },
  word: {
    color: "#2B579A",
    icon: "/assets/icon/word.svg",
    aria: "Microsoft Word",
  },
};

const MEDAL_THEME: Record<
  Advisor["medalTier"],
  { color: string; label: string }
> = {
  gold: { color: "#C9A227", label: "HCV" },
  bronze: { color: "#B87333", label: "HCĐ" },
};

function AppMark({ app }: { app: Advisor["app"] }) {
  const theme = APP_THEME[app];
  return (
    <Image
      src={theme.icon}
      alt=""
      width={18}
      height={18}
      className="shrink-0 w-[18px] h-[18px] object-contain"
      aria-hidden="true"
      unoptimized
    />
  );
}

export default function Achievements() {
  return (
    <section
      id="achievements"
      className="relative py-20 sm:py-28"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mb-10 sm:mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
            className="font-display text-[11px] font-semibold tracking-[0.28em] uppercase text-accent mb-4"
          >
            Thành tích
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: 0.05, ease: [0.2, 0, 0, 1] }}
            className="font-display text-3xl sm:text-4xl font-extrabold text-ink tracking-tight leading-tight mb-3"
          >
            Cố vấn chuyên môn của CLB o365 - HUST
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.2, 0, 0, 1] }}
            className="text-base text-ink-light leading-relaxed m-0"
          >
            Những thành tích trên đấu trường Tin học văn phòng thế giới (MOSWC)
            đồng hành cùng hành trình đào tạo của câu lạc bộ.
          </motion.p>
        </div>

        <motion.figure
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.12, ease: [0.2, 0, 0, 1] }}
          className="relative w-full mb-16 sm:mb-8 m-0 overflow-hidden rounded-2xl border border-border shadow-card image-depth"
        >
          <div className="relative w-full aspect-[16/9] sm:aspect-[2.2/1]">
            <Image
              src={PHOTO_ASSETS.advisorsBanner}
              alt="Cố vấn chuyên môn CLB o365 - HUST tại MOSWC: Nguyễn Minh Dương, Nguyễn Duy Phong, Bùi Công Minh"
              fill
              sizes="(max-width: 1120px) 100vw, 1120px"
              className="object-cover object-[center_10%]"
              priority={false}
            />
          </div>
        </motion.figure>

        <ol className="m-0 p-0 list-none grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {ADVISORS.map((advisor, i) => {
            const medal = MEDAL_THEME[advisor.medalTier];
            const app = APP_THEME[advisor.app];

            return (
              <motion.li
                key={advisor.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.08,
                  ease: [0.2, 0, 0, 1],
                }}
                className="border-t border-border pt-6"
              >
                <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-accent mb-4 m-0">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-ink tracking-tight mb-4 m-0">
                  {advisor.name}
                </h3>

                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide"
                    style={{
                      color: medal.color,
                      backgroundColor: `${medal.color}1A`,
                      border: `1px solid ${medal.color}40`,
                    }}
                  >
                    {medal.label}
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide"
                    style={{
                      color: app.color,
                      backgroundColor: `${app.color}1A`,
                      border: `1px solid ${app.color}40`,
                    }}
                    aria-label={`${app.aria}: ${advisor.subjectLabel}`}
                  >
                    <AppMark app={advisor.app} />
                    {advisor.subjectLabel}
                  </span>
                </div>

                <p className="text-sm text-ink-light leading-relaxed mb-1.5 m-0">
                  {advisor.event}
                </p>
                <p className="text-xs text-ink-muted leading-relaxed m-0">
                  {advisor.medal}
                </p>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

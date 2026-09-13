"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import {
  HERO_TAGLINE,
  HERO_ROLE_LINE,
} from "@/app/data/clubData";
import { useRecruitment } from "@/app/hooks/useRecruitment";
import { PHOTO_ASSETS } from "@/app/data/photoAssets";
import HighlightedText from "@/app/components/HighlightedText";

const EASE = [0.2, 0, 0, 1] as const;
const ROLE_KEEP = "Đại học";
const ROLE_FOCUS = "Đại sứ số học đường";

function titleVariants(instant: boolean) {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: instant ? 0 : 0.08 },
    },
  };
}

function itemVariants(instant: boolean) {
  return {
    hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: instant ? 0 : 0.45, ease: EASE },
    },
  };
}

function RoleHeading() {
  const keepIndex = HERO_ROLE_LINE.indexOf(ROLE_KEEP);
  const focusIndex = HERO_ROLE_LINE.indexOf(ROLE_FOCUS);

  if (keepIndex === -1) return HERO_ROLE_LINE;

  const keep = <span className="whitespace-nowrap">{ROLE_KEEP}</span>;
  const afterKeep = HERO_ROLE_LINE.slice(keepIndex + ROLE_KEEP.length);

  if (focusIndex === -1) {
    return (
      <>
        {HERO_ROLE_LINE.slice(0, keepIndex)}
        {keep}
        {afterKeep}
      </>
    );
  }

  return (
    <>
      {HERO_ROLE_LINE.slice(0, focusIndex)}
      <HighlightedText delay={0.35}>{ROLE_FOCUS}</HighlightedText>
      {HERO_ROLE_LINE.slice(focusIndex + ROLE_FOCUS.length, keepIndex)}
      {keep}
      {afterKeep}
    </>
  );
}

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const recruitment = useRecruitment();
  const instant = reduceMotion === true;
  const titleMotion = titleVariants(instant);
  const itemMotion = itemVariants(instant);

  return (
    <section
      id="top"
      className="relative min-h-[100svh] flex items-end overflow-hidden bg-[var(--bg)]"
    >
      <div className="hero-media" aria-hidden="true">
        <Image
          src={PHOTO_ASSETS.heroAllClub}
          alt=""
          fill
          priority
          sizes="100vw"
          unoptimized={PHOTO_ASSETS.heroAllClub.endsWith(".jpg")}
        />
        <div className="photo-scrim" />
        <div className="photo-scrim-bottom" />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-[var(--max-width)] mx-auto px-5 sm:px-8 pb-16 sm:pb-20 pt-[calc(var(--nav-height)+3rem)]"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: instant ? 0 : 0.1 },
          },
        }}
      >
        <motion.p
          variants={itemMotion}
          className="font-display text-xs font-semibold tracking-[0.28em] uppercase text-accent mb-3 sm:mb-4"
        >
          CLB
        </motion.p>

        <motion.h1
          variants={titleMotion}
          className="font-display font-extrabold tracking-tight leading-[0.95] text-ink mb-6 whitespace-nowrap text-[clamp(2.5rem,8vw,5.75rem)]"
        >
          <motion.span variants={itemMotion}>o365</motion.span>{" "}
          <motion.span variants={itemMotion} className="text-accent">
            HUST
          </motion.span>
        </motion.h1>

        <motion.div variants={itemMotion} className="max-w-2xl">
          <h2 className="text-xl sm:text-2xl lg:text-[1.75rem] font-bold text-ink leading-snug text-pretty mb-3">
            <RoleHeading />
          </h2>
          <p className="text-[15px] sm:text-base text-ink-light leading-relaxed mb-8 max-w-lg">
            {HERO_TAGLINE}
          </p>
        </motion.div>

        <motion.div
          variants={itemMotion}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          {recruitment.visible && (
          <a
            href={recruitment.formUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg text-[15px] font-semibold text-accent-fg bg-accent hover:bg-accent-hover active:scale-[0.96] transition-[background-color,scale] duration-150 focus-visible:outline-2 focus-visible:outline-accent shadow-card"
            aria-label="Tham gia ngay CLB o365 (mở trong tab mới)"
          >
            <span>Tham gia ngay</span>
            <ArrowRight
              className="w-4 h-4 motion-safe:transition-transform motion-safe:duration-150 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
          )}
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
        </motion.div>
      </motion.div>
    </section>
  );
}

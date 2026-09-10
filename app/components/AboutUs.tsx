"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { PHOTO_ASSETS } from "@/app/data/photoAssets";
import {
  ABOUT_COPY,
  CORE_MISSIONS,
  DEVELOPMENT_GOALS,
  CLUB_INFO,
} from "@/app/data/clubData";

export default function AboutUs() {
  return (
    <section
      id="about"
      className="relative py-20 sm:py-28"
      style={{ background: "var(--surface)" }}
    >
      <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start mb-16 sm:mb-20">
          <div className="lg:col-span-6">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
              className="font-display text-xs font-semibold tracking-[0.28em] uppercase text-accent mb-4"
            >
              Giới thiệu
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: 0.05, ease: [0.2, 0, 0, 1] }}
              className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-ink tracking-tight leading-[1.15] mb-4"
            >
              {CLUB_INFO.officialTitle}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, ease: [0.2, 0, 0, 1] }}
              className="space-y-5 flex flex-col"
            >
              <p className="text-base sm:text-lg text-ink-light leading-relaxed m-0">
                {ABOUT_COPY.position}
              </p>
              <p className="text-base sm:text-lg text-ink-light leading-relaxed m-0">
                {ABOUT_COPY.future}
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: 0.08, ease: [0.2, 0, 0, 1] }}
            className="lg:col-span-6 grid grid-cols-2 gap-3 sm:gap-4 lg:pt-24"
          >
            <figure className="photo-slot image-depth aspect-[4/5] sm:aspect-[3/4]">
              <Image
                src={PHOTO_ASSETS.aboutSupport}
                alt="Không gian hỗ trợ sinh viên Office 365 (ảnh placeholder)"
                fill
                sizes="(max-width: 1024px) 45vw, 280px"
                className="object-cover"
                unoptimized={PHOTO_ASSETS.aboutSupport.endsWith(".svg")}
              />
              <figcaption className="absolute bottom-0 inset-x-0 p-3 text-xs text-ink/80 bg-gradient-to-t from-bg/80 to-transparent">
                Hỗ trợ
              </figcaption>
            </figure>
            <figure className="photo-slot image-depth aspect-[4/5] sm:aspect-[3/4] mt-4 sm:mt-6">
              <Image
                src={PHOTO_ASSETS.aboutEvent}
                alt="Kỹ thuật sự kiện và hoạt động CLB (ảnh placeholder)"
                fill
                sizes="(max-width: 1024px) 45vw, 280px"
                className="object-cover"
                unoptimized={PHOTO_ASSETS.aboutEvent.endsWith(".svg")}
              />
              <figcaption className="absolute bottom-0 inset-x-0 p-3 text-xs text-ink/80 bg-gradient-to-t from-bg/80 to-transparent">
                Sự kiện &amp; kỹ thuật
              </figcaption>
            </figure>
          </motion.div>
        </div>

        <div className="mb-16 sm:mb-20">
          <h3 className="font-display text-xl sm:text-2xl font-bold text-ink tracking-tight mb-8">
            Nhiệm vụ cốt lõi
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8 list-none m-0 p-0">
            {CORE_MISSIONS.map((role, i) => (
              <motion.li
                key={role.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.05,
                  ease: [0.2, 0, 0, 1],
                }}
                className="border-t border-border pt-4"
              >
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent mb-2 m-0">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h4 className="text-lg sm:text-xl font-bold text-ink mb-2 m-0">
                  {role.title}
                </h4>
                <p className="text-base text-ink-light leading-relaxed m-0">
                  {role.detail}
                </p>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="mb-16 sm:mb-20">
          <h3 className="font-display text-xl sm:text-2xl font-bold text-ink tracking-tight mb-6">
            Mục tiêu phát triển
          </h3>
          <ul className="m-0 p-0 list-none space-y-4 max-w-3xl">
            {DEVELOPMENT_GOALS.map((goal, i) => (
              <li
                key={goal}
                className="flex gap-4 text-base sm:text-lg text-ink-light leading-relaxed border-l-2 border-accent/40 pl-4"              >
                <span className="text-accent font-semibold shrink-0 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

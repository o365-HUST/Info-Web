"use client";

/**
 * @deprecated This component's functionality and compact stat cards have been
 * moved directly into `app/components/Hero.tsx` as a docked bottom strip.
 */

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "motion/react";
import { STATS } from "@/app/data/clubData";
import { Users, Calendar, Award } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users,
  Calendar,
  Award,
};

const STAT_THEMES: Record<
  string,
  { bg: string; color: string }
> = {
  Users: {
    bg: "#E6F1FB",
    color: "#185FA5",
  },
  Calendar: {
    bg: "#E1F5EE",
    color: "#0F6E56",
  },
  Award: {
    bg: "#FAEEDA",
    color: "#854F0B",
  },
};

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const steps = 35;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

export default function AboutStats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="about"
      ref={ref}
      className="py-16 sm:py-20 lg:py-24"
      style={{ background: "var(--surface)" }}
    >
      <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-10"
        >
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-2 sm:mb-3"
            style={{ color: "var(--ink-muted)" }}
          >
            Về chúng tôi
          </p>
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-tight mb-3"
            style={{ color: "var(--ink)" }}
          >
            CLB o365 — Đại Sứ Chuyển Đổi Số HUST
          </h2>
          <div className="text-center max-w-[480px] mx-auto">
            <p
              className="text-sm leading-relaxed m-0"
              style={{ color: "var(--ink-light)" }}
            >
              Từ một nhóm bạn cùng đam mê công nghệ, CLB o365 giờ là nơi hơn một trăm sinh viên HUST học và làm chuyển đổi số mỗi năm.
            </p>
          </div>
        </motion.div>

        {/* Refined Stat cards: Horizontal compact layout from about_stats_refined.html */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-[14px]">
          {STATS.map((stat, i) => {
            const Icon = iconMap[stat.icon] || Users;
            const theme = STAT_THEMES[stat.icon] || STAT_THEMES.Users;

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="rounded-[12px] border transition-all hover:shadow-md"
                style={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  padding: "1.1rem 1.25rem",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div className="flex items-center gap-3 sm:gap-3.5">
                  {/* Circular icon container */}
                  <div
                    className="w-[38px] h-[38px] rounded-full flex items-center justify-center shrink-0 shadow-2xs"
                    style={{
                      backgroundColor: theme.bg,
                      color: theme.color,
                    }}
                  >
                    <Icon className="w-[18px] h-[18px]" />
                  </div>

                  {/* Counter & Label */}
                  <div>
                    <p
                      className="text-[26px] font-bold tracking-tight m-0 leading-[1.1]"
                      style={{ color: "var(--ink)" }}
                    >
                      <CountUp target={stat.value} suffix={stat.suffix} />
                    </p>
                    <p
                      className="text-[13px] mt-0.5 m-0"
                      style={{ color: "var(--ink-light)" }}
                    >
                      {stat.label}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

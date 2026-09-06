"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "motion/react";
import { STATS } from "@/app/data/clubData";
import { Users, Calendar, Award } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users,
  Calendar,
  Award,
};

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const steps = 40;
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
      className="py-20 lg:py-28"
      style={{ background: "var(--surface)" }}
    >
      <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: "var(--ink-muted)" }}
          >
            Về chúng tôi
          </p>
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-tight"
            style={{ color: "var(--ink)" }}
          >
            CLB o365 — Đại Sứ Chuyển Đổi Số HUST
          </h2>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {STATS.map((stat, i) => {
            const Icon = iconMap[stat.icon] || Users;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="flex flex-col items-center text-center p-8 rounded-2xl border"
                style={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    backgroundColor: "var(--accent)",
                    color: "var(--ink)",
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className="text-4xl sm:text-5xl font-bold tracking-tight mb-1"
                  style={{ color: "var(--ink)" }}
                >
                  <CountUp target={stat.value} suffix={stat.suffix} />
                </span>
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--ink-light)" }}
                >
                  {stat.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

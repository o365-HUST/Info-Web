"use client";

import Link from "next/link";
import { motion, useInView } from "motion/react";
import { useMemo, useRef } from "react";
import { EVENTS } from "@/app/data/clubData";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";

export default function EventsTeaser() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const spotlight = useMemo(() => {
    const active = EVENTS.filter(
      (e) => e.status === "ongoing" || e.status === "upcoming",
    );
    const sorted = [...active].sort((a, b) => {
      if (a.isHighlight !== b.isHighlight) return a.isHighlight ? -1 : 1;
      const da = a.targetDate ?? "";
      const db = b.targetDate ?? "";
      return da.localeCompare(db);
    });
    return sorted.slice(0, 2);
  }, []);

  return (
    <section
      id="events-teaser"
      ref={ref}
      className="py-16 sm:py-20 bg-surface"
    >
      <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4"
        >
          <div>
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] text-accent uppercase opacity-90 block mb-1">
              Lịch hoạt động
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Sự Kiện Nổi Bật
            </h2>
            <p className="mt-1.5 text-sm text-ink-light max-w-lg text-pretty">
              Workshop, MOSWC và các chương trình tích lũy ĐRL đang mở đăng ký.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg border border-border bg-card/60 hover:bg-card text-ink text-sm font-semibold transition-all shadow-xs hover:shadow-sm active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-accent shrink-0"
          >
            <span>Xem lịch sự kiện</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {spotlight.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.4,
                delay: i * 0.08,
                ease: [0.2, 0, 0, 1],
              }}
            >
              <a
                href={event.linkUrl || "/events"}
                target={
                  event.linkUrl?.startsWith("http") ? "_blank" : undefined
                }
                rel={
                  event.linkUrl?.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="group block h-full rounded-2xl border border-border bg-[var(--bg)] p-5 sm:p-6 transition-all duration-200 hover:shadow-card hover:border-accent/40 focus-visible:outline-2 focus-visible:outline-accent"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${
                      event.status === "ongoing"
                        ? "bg-accent/15 text-accent"
                        : "bg-card text-ink-muted border border-border"
                    }`}
                  >
                    {event.status === "ongoing" ? "Đang diễn ra" : "Sắp tới"}
                  </span>
                  {event.drl && (
                    <span className="text-[11px] font-semibold text-ink-muted">
                      {event.drl}
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-ink leading-snug mb-2 group-hover:text-accent transition-colors line-clamp-2">
                  {event.title}
                </h3>

                {event.description && (
                  <p className="text-sm text-ink-light leading-relaxed line-clamp-2 mb-4">
                    {event.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted mt-auto">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                    {event.month}
                  </span>
                  {event.location && (
                    <span className="inline-flex items-center gap-1.5 min-w-0">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </span>
                  )}
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

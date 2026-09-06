"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { EVENTS } from "@/app/data/clubData";
import { ArrowRight, CalendarDays } from "lucide-react";

export default function EventsTimeline() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="events"
      ref={ref}
      className="py-20 lg:py-28"
      style={{ background: "var(--bg)" }}
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
            Lịch hoạt động
          </p>
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-tight"
            style={{ color: "var(--ink)" }}
          >
            Lịch Sự Kiện &amp; Công Tác SV
          </h2>
        </motion.div>

        {/* Event rows */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          {EVENTS.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -16 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 px-6 py-5"
              style={{
                borderBottom:
                  i < EVENTS.length - 1
                    ? "1px solid var(--border)"
                    : "none",
              }}
            >
              <div className="flex items-center gap-4">
                {/* Month badge */}
                <span
                  className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold"
                  style={{
                    backgroundColor: "var(--warm)",
                    color: "var(--ink)",
                  }}
                >
                  <CalendarDays
                    className="w-3.5 h-3.5 inline-block mr-1"
                    style={{ verticalAlign: "-2px" }}
                  />
                  {event.month}
                </span>

                {/* Event title */}
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--ink)" }}
                >
                  {event.title}
                </span>
              </div>

              {/* Action link */}
              <a
                href={event.linkUrl}
                target={event.linkUrl.startsWith("http") ? "_blank" : undefined}
                rel={
                  event.linkUrl.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors shrink-0"
                style={{ color: "var(--ink-light)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "var(--ink)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "var(--ink-light)";
                }}
              >
                {event.linkLabel}
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

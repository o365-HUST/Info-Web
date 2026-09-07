"use client";

import Image from "next/image";
import type { DepartmentBentoItem } from "@/app/types";
import { Sparkles, Quote, CheckCircle2, TrendingUp, Compass } from "lucide-react";

interface DepartmentBentoGridProps {
  items: DepartmentBentoItem[];
  departmentName: string;
  accentColor?: string;
}

export default function DepartmentBentoGrid({
  items,
  departmentName,
  accentColor = "#0078D4",
}: DepartmentBentoGridProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-4 h-4 text-accent" />
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-ink">
          Góc Nhìn Thực Tế &amp; Điểm Nhấn {departmentName}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {items.map((item) => {
          const colSpan = item.colSpan || "col-span-1";

          // Photo Tile
          if (item.type === "photo" && item.image) {
            return (
              <div
                key={item.id}
                className={`${colSpan} group relative min-h-[280px] sm:min-h-[320px] rounded-3xl overflow-hidden border border-border shadow-card flex flex-col justify-end p-6 sm:p-7 transition-all duration-300 hover:shadow-xl hover:border-accent/40`}
              >
                {/* Background Image */}
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 650px"
                />

                {/* Gradient Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

                {/* Content */}
                <div className="relative z-10 space-y-1.5 text-white">
                  {item.badge && (
                    <span
                      className="inline-block text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-white/20 bg-white/15 backdrop-blur-xs mb-1"
                      style={{ color: "#fff" }}
                    >
                      {item.badge}
                    </span>
                  )}
                  <h4 className="text-lg sm:text-xl font-bold tracking-tight leading-snug text-white drop-shadow-sm">
                    {item.title}
                  </h4>
                  {item.subtitle && (
                    <p className="text-xs text-white/80 line-clamp-2 leading-relaxed drop-shadow-xs">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </div>
            );
          }

          // Stat Tile
          if (item.type === "stat") {
            return (
              <div
                key={item.id}
                className={`${colSpan} rounded-3xl bg-surface border border-border p-6 sm:p-7 shadow-card flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-ink-muted">
                    {item.title}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-card border border-border flex items-center justify-center text-accent">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <div
                    className="text-3xl sm:text-4xl font-black tracking-tight mb-1.5"
                    style={{ color: item.accent || accentColor }}
                  >
                    {item.statValue}
                  </div>
                  <h5 className="text-xs sm:text-sm font-bold text-ink mb-1">
                    {item.statLabel}
                  </h5>
                  {item.description && (
                    <p className="text-xs text-ink-light leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            );
          }

          // Quote Tile
          if (item.type === "quote") {
            return (
              <div
                key={item.id}
                className={`${colSpan} rounded-3xl bg-gradient-to-br from-card/80 via-surface to-surface border border-border p-6 sm:p-7 shadow-card flex flex-col justify-between hover:shadow-md transition-all relative`}
              >
                <Quote className="w-8 h-8 text-accent/30 mb-3 shrink-0" />

                <div className="space-y-3">
                  <p className="text-xs sm:text-sm text-ink italic font-medium leading-relaxed">
                    “{item.description}”
                  </p>
                  {item.quoteAuthor && (
                    <p className="text-[11px] font-bold text-ink-muted tracking-wide font-mono">
                      — {item.quoteAuthor}
                    </p>
                  )}
                </div>
              </div>
            );
          }

          // Skills Cloud Tile
          if (item.type === "skills" && item.skills) {
            return (
              <div
                key={item.id}
                className={`${colSpan} rounded-3xl bg-surface border border-border p-6 sm:p-7 shadow-card flex flex-col justify-between hover:shadow-md transition-all`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Compass className="w-4 h-4 text-accent" />
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-ink-muted">
                    {item.title}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {item.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border/80 text-xs font-semibold text-ink hover:border-accent/50 hover:bg-surface transition-colors shadow-2xs"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}

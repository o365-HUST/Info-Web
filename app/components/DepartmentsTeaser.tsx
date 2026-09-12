"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { DEPARTMENTS } from "@/app/data/clubData";
import { ArrowRight } from "lucide-react";

/** Ban Chủ nhiệm centered among operating bans — same order as full carousel. */
const OPERATING = DEPARTMENTS.filter((d) => d.id !== "ban-chu-nhiem");
const LEADERSHIP = DEPARTMENTS.find((d) => d.id === "ban-chu-nhiem");
const mid = Math.floor(OPERATING.length / 2);
const TEASER_DEPTS = LEADERSHIP
  ? [...OPERATING.slice(0, mid), LEADERSHIP, ...OPERATING.slice(mid)]
  : OPERATING;

export default function DepartmentsTeaser() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="departments-teaser"
      ref={ref}
      className="py-16 sm:py-20 bg-[var(--bg)]"
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
              Cơ cấu tổ chức
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Bộ Máy Hoạt Động o365
            </h2>
            <p className="mt-1.5 text-sm text-ink-light max-w-lg text-pretty">
              {TEASER_DEPTS.length} ban chuyên trách kiến tạo sân chơi công nghệ
              và kỹ năng số cho sinh viên Bách Khoa.
            </p>
          </div>

          <Link
            href="/departments"
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg border border-border bg-card/60 hover:bg-card text-ink text-sm font-semibold transition-all shadow-xs hover:shadow-sm active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-accent shrink-0"
          >
            <span>Xem cơ cấu ban</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {TEASER_DEPTS.map((dept, i) => (
            <motion.div
              key={dept.id}
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.4,
                delay: i * 0.05,
                ease: [0.2, 0, 0, 1],
              }}
            >
              <Link
                href={`/departments/${dept.id}`}
                className="group flex flex-col h-full rounded-xl border border-border bg-surface overflow-hidden transition-all duration-200 hover:shadow-card hover:border-accent/40 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-accent"
              >
                <div className="relative aspect-[4/3] bg-card">
                  <Image
                    src={dept.image}
                    alt={dept.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-3 flex flex-col flex-1 gap-0.5">
                  <span className="font-mono text-[10px] text-ink-muted font-semibold">
                    [{dept.index}]
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-ink uppercase tracking-tight line-clamp-2 group-hover:text-accent transition-colors">
                    {dept.name}
                  </h3>
                  <p className="text-[11px] text-ink-muted line-clamp-1 mt-auto pt-1">
                    {dept.leader?.name}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

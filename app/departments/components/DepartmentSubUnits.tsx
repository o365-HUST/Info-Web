"use client";

import type { DepartmentSubUnit } from "@/app/types";

interface DepartmentSubUnitsProps {
  units: DepartmentSubUnit[];
  departmentName: string;
}

function headerStripClass(accent: DepartmentSubUnit["accent"]) {
  if (accent === "warm") return "bg-warm border-b border-border";
  if (accent === "cool") return "bg-surface border-b border-border";
  return "bg-card border-b border-border";
}

function SubUnitCard({ unit }: { unit: DepartmentSubUnit }) {
  return (
    <article className="flex flex-col rounded-lg border border-border bg-card overflow-hidden">
      <header className={`px-4 py-3 sm:px-5 sm:py-3.5 ${headerStripClass(unit.accent)}`}>
        <p className="font-mono text-[11px] font-semibold tracking-[0.2em] uppercase text-ink-muted m-0 mb-1">
          {unit.index}
        </p>
        <h3 className="font-display text-lg sm:text-xl font-bold text-ink tracking-tight m-0">
          {unit.name}
        </h3>
        <p className="text-sm text-ink-light leading-snug m-0 mt-1">{unit.tagline}</p>
      </header>

      <div className="flex flex-col flex-1 px-4 py-4 sm:px-5 sm:py-5 gap-5">
        <div className="border-l-2 border-accent/40 pl-4">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-accent mb-1.5 m-0">
            Nhiệm vụ
          </p>
          <p className="text-sm sm:text-base text-ink leading-relaxed m-0">
            {unit.mission}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-accent mb-2 m-0">
            Công cụ
          </p>
          <p className="text-sm sm:text-base text-ink leading-relaxed m-0">
            {unit.tools.join(" · ")}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-accent mb-2 m-0">
            Đào tạo
          </p>
          <ul className="m-0 p-0 list-none space-y-2">
            {unit.trainingFocus.map((item) => (
              <li
                key={item}
                className="text-sm text-ink-light leading-relaxed pl-3 border-l border-border"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export default function DepartmentSubUnits({
  units,
  departmentName,
}: DepartmentSubUnitsProps) {
  if (!units.length) return null;

  return (
    <section
      className="py-12 sm:py-16 border-b border-border"
      aria-labelledby="department-subunits-heading"
    >
      <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-8">
        <h2
          id="department-subunits-heading"
          className="font-display text-xl sm:text-2xl font-bold text-ink tracking-tight mb-2"
        >
          Hai mảng trong {departmentName}
        </h2>
        <p className="text-sm text-ink-light leading-relaxed max-w-2xl mb-8 m-0">
          KNM dạy sinh viên dùng công cụ — Kĩ thuật build những gì CLB và trường
          triển khai.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative">
          {units.map((unit) => (
            <SubUnitCard key={unit.id} unit={unit} />
          ))}
        </div>
      </div>
    </section>
  );
}

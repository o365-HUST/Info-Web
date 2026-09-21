"use client";

import {
  getHardcodedSubUnits,
  type HardcodedSubUnitCard,
  type SubUnitAccent,
} from "./departmentSubUnitsContent";

interface DepartmentSubUnitsProps {
  departmentId: string;
  departmentName: string;
}

function headerStripClass(accent: SubUnitAccent) {
  if (accent === "warm") return "bg-warm border-b border-border";
  if (accent === "cool") return "bg-surface border-b border-border";
  return "bg-card border-b border-border";
}

function subgridRowCount(cards: HardcodedSubUnitCard[]): 3 | 4 {
  const unit = cards[0];
  if (unit.scopeBody) return 4;
  return 3;
}

function subgridLayoutClasses(rowCount: 3 | 4) {
  if (rowCount === 4) {
    return {
      grid: "md:[grid-template-rows:repeat(4,minmax(0,auto))]",
      card: "md:[grid-row:span_4/span_4]",
    };
  }
  return {
    grid: "md:[grid-template-rows:repeat(3,minmax(0,auto))]",
    card: "md:[grid-row:span_3/span_3]",
  };
}

function SubUnitCard({
  unit,
  subgridCardClass,
}: {
  unit: HardcodedSubUnitCard;
  subgridCardClass: string;
}) {
  const aboutLabel = unit.aboutLabel;

  return (
    <article
      className={`flex flex-col rounded-lg border border-border bg-card overflow-hidden md:grid md:grid-rows-subgrid md:gap-0 md:min-h-0 ${subgridCardClass}`}
    >
      <header
        className={`px-4 py-3 sm:px-5 sm:py-3.5 ${headerStripClass(unit.accent ?? "warm")}`}
      >
        <p className="font-mono text-[11px] font-semibold tracking-[0.2em] uppercase text-ink-muted m-0 mb-1">
          {unit.index}
        </p>
        <h3 className="font-display text-lg sm:text-xl font-bold text-ink tracking-tight m-0">
          {unit.name}
        </h3>
        <p className="text-sm text-ink-light leading-snug m-0 mt-1">{unit.tagline}</p>
      </header>

      {unit.about ? (
        <div className="px-4 pt-4 sm:px-5 sm:pt-5 md:pt-4 md:pb-0">
          <div className="border-l-2 border-accent/40 pl-4 h-full">
            {aboutLabel ? (
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-accent mb-1.5 m-0">
                {aboutLabel}
              </p>
            ) : null}
            <p className="text-sm sm:text-base text-ink leading-relaxed m-0">
              {unit.about}
            </p>
          </div>
        </div>
      ) : null}

      {unit.scopeBody ? (
        <div className="px-4 pt-5 sm:px-5 md:pt-5 md:pb-0">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-accent mb-2 m-0">
            {unit.scopeLabel}
          </p>
          <p className="text-sm sm:text-base text-ink leading-relaxed m-0">
            {unit.scopeBody}
          </p>
        </div>
      ) : null}

      {unit.focusItems?.length ? (
        <div className="px-4 py-4 sm:px-5 sm:py-5 md:pt-5">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-accent mb-2 m-0">
            {unit.focusLabel}
          </p>
          <ul className="m-0 p-0 list-none space-y-2">
            {unit.focusItems.map((item) => (
              <li
                key={item}
                className="text-sm text-ink-light leading-relaxed pl-3 border-l border-border"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}

export default function DepartmentSubUnits({
  departmentId,
  departmentName,
}: DepartmentSubUnitsProps) {
  const section = getHardcodedSubUnits(departmentId);
  if (!section) return null;

  const rowCount = subgridRowCount(section.cards);
  const { grid: subgridParentClass, card: subgridCardClass } =
    subgridLayoutClasses(rowCount);

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
          {section.intro}
        </p>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 md:items-stretch ${subgridParentClass}`}
        >
          {section.cards.map((unit) => (
            <SubUnitCard
              key={unit.index}
              unit={unit}
              subgridCardClass={subgridCardClass}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

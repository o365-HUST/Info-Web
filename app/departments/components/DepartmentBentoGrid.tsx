"use client";

import type { DepartmentBentoItem } from "../../types";

interface DepartmentBentoGridProps {
  items: DepartmentBentoItem[];
}

export default function DepartmentBentoGrid({ items }: DepartmentBentoGridProps) {
  if (!items || items.length === 0) return null;

  const quotes = items.filter((item) => item.type === "quote");
  const stats = items.filter((item) => item.type === "stat");
  const skillSets = items.filter(
    (item) => item.type === "skills" && item.skills?.length,
  );

  if (quotes.length === 0 && stats.length === 0 && skillSets.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {stats.length > 0 && (
        <dl className="m-0 mb-12 grid grid-cols-1 sm:grid-cols-2 gap-8">
          {stats.map((item) => (
            <div key={item.id}>
              <dt className="text-[11px] font-semibold tracking-[0.2em] uppercase text-ink-muted mb-2">
                {item.title}
              </dt>
              <dd className="m-0">
                <p className="font-display text-2xl sm:text-3xl font-extrabold text-ink tracking-tight mb-1">
                  {item.statValue}
                </p>
                {item.statLabel && (
                  <p className="text-sm font-semibold text-ink mb-1 m-0">
                    {item.statLabel}
                  </p>
                )}
                {item.description && (
                  <p className="text-sm text-ink-light leading-relaxed m-0">
                    {item.description}
                  </p>
                )}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {quotes.map((item) => (
        <blockquote
          key={item.id}
          className="m-0 mb-12 border-l-2 border-accent/50 pl-4 max-w-2xl"
        >
          <p className="text-base sm:text-lg text-ink leading-relaxed m-0">
            {item.description}
          </p>
          {item.quoteAuthor && (
            <footer className="mt-2 text-sm text-ink-muted">
              {item.quoteAuthor}
            </footer>
          )}
        </blockquote>
      ))}

      {skillSets.map((item) => (
        <div key={item.id} className="mb-4 max-w-2xl">
          <h3 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-accent mb-2">
            {item.title}
          </h3>
          <p className="text-base text-ink leading-relaxed m-0">
            {item.skills!.join(" · ")}
          </p>
        </div>
      ))}
    </div>
  );
}

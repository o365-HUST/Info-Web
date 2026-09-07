"use client";

export default function PostContentSkeleton() {
  return (
    <div className="w-full max-w-[var(--max-width)] mx-auto px-5 sm:px-6 py-8 sm:py-12 animate-pulse">
      {/* Top Breadcrumbs & Back button */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-24 h-4 rounded bg-border/60" />
        <div className="w-3 h-3 rounded bg-border/40" />
        <div className="w-16 h-4 rounded bg-border/60" />
        <div className="w-3 h-3 rounded bg-border/40" />
        <div className="w-32 h-4 rounded bg-border/40" />
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Badges / Meta row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-20 h-6 rounded-full bg-card" />
          <div className="w-24 h-4 rounded bg-border/50" />
          <div className="w-16 h-4 rounded bg-border/50" />
        </div>

        {/* Title skeleton */}
        <div className="space-y-3 mb-6">
          <div className="w-full h-8 sm:h-10 rounded-xl bg-card" />
          <div className="w-3/4 h-8 sm:h-10 rounded-xl bg-card" />
        </div>

        {/* Author & Info bar */}
        <div className="flex items-center gap-3 py-4 border-y border-border/70 mb-8">
          <div className="w-9 h-9 rounded-full bg-card" />
          <div className="space-y-1.5 flex-1">
            <div className="w-32 h-4 rounded bg-card" />
            <div className="w-20 h-3 rounded bg-border/50" />
          </div>
          <div className="w-24 h-8 rounded-xl bg-card" />
        </div>

        {/* Cover image hero skeleton */}
        <div className="aspect-[16/9] sm:aspect-[21/9] w-full rounded-3xl bg-card mb-10 overflow-hidden" />

        {/* Excerpt callout skeleton */}
        <div className="p-5 rounded-2xl bg-card/60 border border-border/60 space-y-2 mb-10">
          <div className="w-full h-4 rounded bg-card" />
          <div className="w-5/6 h-4 rounded bg-card" />
        </div>

        {/* Body content lines */}
        <div className="space-y-4 mb-12">
          <div className="w-full h-4 rounded bg-card/80" />
          <div className="w-full h-4 rounded bg-card/80" />
          <div className="w-11/12 h-4 rounded bg-card/80" />
          <div className="w-4/5 h-4 rounded bg-card/80" />
          <div className="w-1/2 h-6 rounded-lg bg-card my-6" />
          <div className="w-full h-4 rounded bg-card/80" />
          <div className="w-full h-4 rounded bg-card/80" />
          <div className="w-9/12 h-4 rounded bg-card/80" />
        </div>
      </div>
    </div>
  );
}

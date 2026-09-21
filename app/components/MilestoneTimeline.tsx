"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  Fragment,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { Loader2, X } from "lucide-react";
import { subscribePosts } from "@/app/lib/firestoreService";
import {
  STORY_TIMELINE,
  storyEntryToMilestone,
} from "@/app/data/storyTimeline";
import NoteModalRouter from "@/app/components/milestone-modals/NoteModalRouter";
import AlternatingTimelinePath from "@/app/components/story/AlternatingTimelinePath";
import TimelineMilestoneRow from "@/app/components/story/TimelineMilestoneRow";
import TimelineYearRow from "@/app/components/story/TimelineYearRow";
import VisitorTimelineEndRow from "@/app/components/story/VisitorTimelineEndRow";
import VisitorNoteComposer from "@/app/components/story/VisitorNoteComposer";
import {
  buildAlternatingLayout,
  buildPathWithVisitorAnchor,
  groupEntriesByYear,
  spineHeightWithVisitor,
  timelineLayoutTransition,
  ALTERNATING_MAX_WIDTH,
} from "@/app/lib/alternatingTimeline";
import {
  loadVisitorNote,
  removeVisitorNote,
  saveVisitorNote,
  type VisitorNote,
} from "@/app/lib/visitorNote";
import type { BlogPost } from "@/app/types";

const SESSION_REVEAL_KEY = "o365_story_revealed";
const LOADER_MIN_MS = 300;
const REVEAL_STAGGER_MS = 100;
const SHOW_SESSION_TOASTS = process.env.NODE_ENV === "development";

export default function MilestoneTimeline() {
  const ordered = STORY_TIMELINE;
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [timelineReady, setTimelineReady] = useState(false);
  const [skipScrollReveal, setSkipScrollReveal] = useState(false);
  const [maxRevealed, setMaxRevealed] = useState(-1);
  const [revealEpoch, setRevealEpoch] = useState(0);
  const [visitorNote, setVisitorNote] = useState<VisitorNote | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [visitorNoteHydrated, setVisitorNoteHydrated] = useState(false);
  const [sessionNotice, setSessionNotice] = useState<string | null>(null);
  const [collapsedYears, setCollapsedYears] = useState<Set<number>>(() => new Set());
  const [collapsingYears, setCollapsingYears] = useState<Set<number>>(() => new Set());
  const [spineWidth, setSpineWidth] = useState(ALTERNATING_MAX_WIDTH);

  const timelineRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const visitorOpenerRef = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const loaderMountTime = useRef(Date.now());
  const maxRevealedRef = useRef(-1);
  const revealTargetRef = useRef(-1);
  const revealTimersRef = useRef<number[]>([]);
  const pumpingRef = useRef(false);
  const sessionNoticeTimerRef = useRef<number | null>(null);
  const collapseTimerRef = useRef<Map<number, number>>(new Map());

  const showSessionNotice = useCallback((message: string) => {
    if (!SHOW_SESSION_TOASTS) return;
    setSessionNotice(message);
    if (sessionNoticeTimerRef.current !== null) {
      window.clearTimeout(sessionNoticeTimerRef.current);
    }
    sessionNoticeTimerRef.current = window.setTimeout(() => {
      setSessionNotice(null);
      sessionNoticeTimerRef.current = null;
    }, 5000);
  }, []);

  const dismissSessionNotice = useCallback(() => {
    if (sessionNoticeTimerRef.current !== null) {
      window.clearTimeout(sessionNoticeTimerRef.current);
      sessionNoticeTimerRef.current = null;
    }
    setSessionNotice(null);
  }, []);

  useEffect(() => {
    return () => {
      collapseTimerRef.current.forEach((id) => window.clearTimeout(id));
      collapseTimerRef.current.clear();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (sessionNoticeTimerRef.current !== null) {
        window.clearTimeout(sessionNoticeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const unsub = subscribePosts((posts) => setBlogPosts(posts));
    return () => unsub();
  }, []);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_REVEAL_KEY)) {
        setSkipScrollReveal(true);
        showSessionNotice("Đã khôi phục trạng thái xem từ phiên này");
      }
    } catch {
      /* ignore */
    }
    setVisitorNote(loadVisitorNote());
    setVisitorNoteHydrated(true);
  }, [showSessionNotice]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(motionMq.matches);
    update();
    motionMq.addEventListener("change", update);
    return () => motionMq.removeEventListener("change", update);
  }, []);

  const postsById = useMemo(() => {
    const map: Record<string, BlogPost> = {};
    for (const post of blogPosts) {
      map[post.id] = post;
    }
    return map;
  }, [blogPosts]);

  useEffect(() => {
    const el = timelineRef.current;
    if (!el || ordered.length === 0) return;

    const syncWidth = () => {
      const w = el.getBoundingClientRect().width;
      if (w > 0) {
        setSpineWidth(Math.min(w, ALTERNATING_MAX_WIDTH));
      }
    };

    syncWidth();
    const ro = new ResizeObserver(() => syncWidth());
    ro.observe(el);
    return () => ro.disconnect();
  }, [ordered.length, revealEpoch]);

  const layout = useMemo(
    () =>
      buildAlternatingLayout(ordered, {
        collapsedYears,
        containerWidth: spineWidth,
      }),
    [ordered, collapsedYears, spineWidth],
  );

  const lastRevealIndex = Math.max(0, layout.revealItemCount - 1);

  const effectiveSkipReveal = skipScrollReveal || reducedMotion;
  const animateReveal = timelineReady && !effectiveSkipReveal;
  const fullyRevealed =
    effectiveSkipReveal ||
    maxRevealed >= lastRevealIndex ||
    layout.revealItemCount === 0;

  const showVisitorOnSpine =
    visitorNoteHydrated &&
    timelineReady &&
    fullyRevealed &&
    !(composerOpen && !visitorNote);

  const pathSegments = useMemo(
    () => buildPathWithVisitorAnchor(layout, showVisitorOnSpine),
    [layout, showVisitorOnSpine],
  );

  const spineHeight = spineHeightWithVisitor(layout, showVisitorOnSpine);

  const yearGroups = useMemo(() => groupEntriesByYear(ordered), [ordered]);

  const milestoneByEntryId = useMemo(() => {
    const map = new Map<string, (typeof layout.milestoneRows)[number]>();
    for (const row of layout.milestoneRows) {
      map.set(row.entry.id, row);
    }
    return map;
  }, [layout.milestoneRows]);

  const toggleYearCollapsed = useCallback(
    (year: number) => {
      setCollapsedYears((prev) => {
        if (prev.has(year)) {
          const pending = collapseTimerRef.current.get(year);
          if (pending !== undefined) {
            window.clearTimeout(pending);
            collapseTimerRef.current.delete(year);
          }
          setCollapsingYears((c) => {
            const next = new Set(c);
            next.delete(year);
            return next;
          });
          const next = new Set(prev);
          next.delete(year);
          return next;
        }

        setCollapsingYears((c) => new Set(c).add(year));
        const existing = collapseTimerRef.current.get(year);
        if (existing !== undefined) window.clearTimeout(existing);

        const delay = reducedMotion ? 0 : 420;
        const timerId = window.setTimeout(() => {
          setCollapsedYears((p) => new Set(p).add(year));
          setCollapsingYears((c) => {
            const next = new Set(c);
            next.delete(year);
            return next;
          });
          collapseTimerRef.current.delete(year);
        }, delay);
        collapseTimerRef.current.set(year, timerId);
        return prev;
      });
    },
    [reducedMotion],
  );

  useEffect(() => {
    const last = lastRevealIndex;
    if (maxRevealedRef.current > last) {
      maxRevealedRef.current = last;
      revealTargetRef.current = Math.min(revealTargetRef.current, last);
      setMaxRevealed(last);
    }
  }, [lastRevealIndex]);

  const markSessionRevealed = useCallback(
    (message: string) => {
      let isNew = false;
      try {
        isNew = !sessionStorage.getItem(SESSION_REVEAL_KEY);
        sessionStorage.setItem(SESSION_REVEAL_KEY, "1");
      } catch {
        /* ignore */
      }
      setSkipScrollReveal(true);
      if (isNew) showSessionNotice(message);
    },
    [showSessionNotice],
  );

  const clearRevealTimers = useCallback(() => {
    revealTimersRef.current.forEach((id) => window.clearTimeout(id));
    revealTimersRef.current = [];
    pumpingRef.current = false;
  }, []);

  useEffect(() => {
    return () => clearRevealTimers();
  }, [clearRevealTimers]);

  useEffect(() => {
    if (effectiveSkipReveal && layout.revealItemCount > 0) {
      maxRevealedRef.current = lastRevealIndex;
      revealTargetRef.current = lastRevealIndex;
      setMaxRevealed(lastRevealIndex);
    }
  }, [effectiveSkipReveal, layout.revealItemCount, lastRevealIndex]);

  const handleSkipReveal = useCallback(() => {
    clearRevealTimers();
    maxRevealedRef.current = lastRevealIndex;
    revealTargetRef.current = lastRevealIndex;
    setMaxRevealed(lastRevealIndex);
    markSessionRevealed("Đã bỏ qua hiệu ứng - lần sau mở thẳng dòng thời gian");
  }, [clearRevealTimers, lastRevealIndex, markSessionRevealed]);

  const handleResetReveal = useCallback(() => {
    clearRevealTimers();
    let hadSession = false;
    try {
      hadSession = Boolean(sessionStorage.getItem(SESSION_REVEAL_KEY));
      sessionStorage.removeItem(SESSION_REVEAL_KEY);
    } catch {
      /* ignore */
    }
    maxRevealedRef.current = -1;
    revealTargetRef.current = -1;
    pumpingRef.current = false;
    setSkipScrollReveal(false);
    setMaxRevealed(-1);
    setRevealEpoch((e) => e + 1);
    if (hadSession) {
      showSessionNotice("Hiệu ứng sẽ chạy lại");
    }
    timelineRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [clearRevealTimers, showSessionNotice]);

  const handleNoteEnterView = useCallback(
    (index: number) => {
      if (!timelineReady || effectiveSkipReveal) return;
      if (index <= maxRevealedRef.current) return;

      revealTargetRef.current = Math.max(revealTargetRef.current, index);
      if (pumpingRef.current) return;

      const pump = () => {
        const next = maxRevealedRef.current + 1;
        if (next > revealTargetRef.current) {
          pumpingRef.current = false;
          return;
        }

        maxRevealedRef.current = next;
        setMaxRevealed(next);

        if (next >= lastRevealIndex) {
          markSessionRevealed(
            "Đã xem hết hành trình",
          );
          pumpingRef.current = false;
          return;
        }

        if (next < revealTargetRef.current) {
          const timerId = window.setTimeout(pump, REVEAL_STAGGER_MS);
          revealTimersRef.current.push(timerId);
        } else {
          pumpingRef.current = false;
        }
      };

      pumpingRef.current = true;
      pump();
    },
    [timelineReady, effectiveSkipReveal, lastRevealIndex, markSessionRevealed],
  );

  useEffect(() => {
    const elapsed = Date.now() - loaderMountTime.current;
    const remaining = Math.max(0, LOADER_MIN_MS - elapsed);
    const timer = window.setTimeout(() => setTimelineReady(true), remaining);
    return () => window.clearTimeout(timer);
  }, []);

  const handleOpen = (id: string, el: HTMLElement) => {
    openerRef.current = el;
    setSelectedId(id);
  };

  const handleClose = () => setSelectedId(null);

  const handleVisitorPatchClick = useCallback(() => {
    setComposerOpen(true);
  }, []);

  const handleVisitorCardOpen = useCallback((el: HTMLElement) => {
    visitorOpenerRef.current = el;
    setComposerOpen(true);
  }, []);

  const handleVisitorSave = useCallback((note: VisitorNote) => {
    saveVisitorNote(note);
    setVisitorNote(note);
    setComposerOpen(false);
  }, []);

  const handleVisitorRemove = useCallback(() => {
    removeVisitorNote();
    setVisitorNote(null);
    setComposerOpen(false);
  }, []);

  const handleComposerClose = useCallback(() => {
    setComposerOpen(false);
    visitorOpenerRef.current?.focus?.();
  }, []);

  const selected = useMemo(() => {
    const entry = ordered.find((m) => m.id === selectedId);
    return entry ? storyEntryToMilestone(entry) : null;
  }, [ordered, selectedId]);

  useEffect(() => {
    if (selectedId) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const t = requestAnimationFrame(() => closeRef.current?.focus());
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setSelectedId(null);
      };
      window.addEventListener("keydown", onKey);
      return () => {
        document.body.style.overflow = prevOverflow;
        cancelAnimationFrame(t);
        window.removeEventListener("keydown", onKey);
        openerRef.current?.focus?.();
      };
    }
  }, [selectedId]);

  return (
    <section
      id="story"
      className="relative py-16 sm:py-24"
      style={{ background: "var(--bg)" }}
    >
      <AnimatePresence>
        {SHOW_SESSION_TOASTS && sessionNotice && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: reducedMotion ? 0.12 : 0.22 }}
            onMouseEnter={() => {
              if (sessionNoticeTimerRef.current !== null) {
                window.clearTimeout(sessionNoticeTimerRef.current);
                sessionNoticeTimerRef.current = null;
              }
            }}
            onMouseLeave={() => {
              if (sessionNoticeTimerRef.current !== null) return;
              sessionNoticeTimerRef.current = window.setTimeout(() => {
                setSessionNotice(null);
                sessionNoticeTimerRef.current = null;
              }, 5000);
            }}
            className="fixed top-6 left-1/2 z-[70] flex max-w-[min(92vw,28rem)] -translate-x-1/2 items-start gap-3 rounded-2xl border border-border bg-ink px-4 py-3 text-surface shadow-xl"
          >
            <p className="m-0 flex-1 text-xs font-semibold leading-relaxed">
              {sessionNotice}
            </p>
            <button
              type="button"
              onClick={dismissSessionNotice}
              aria-label="Đóng thông báo"
              className="shrink-0 rounded-lg p-1 text-surface/80 transition-colors hover:bg-surface/10 hover:text-surface focus-visible:outline-2 focus-visible:outline-accent"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-[var(--max-width)] px-5 sm:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-12">
          <div className="max-w-3xl">
            <p className="mb-3 font-display text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
              Hành trình o365
            </p>
            <h1 className="mb-3 font-display text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
              Những cột mốc của CLB o365 - HUST
            </h1>
            <p className="text-sm leading-relaxed text-ink-light text-pretty sm:text-base">
              Dòng thời gian hành trình CLB - chạm vào từng mốc để đọc chi
              tiết. Cuộn để khám phá từng chương. Bạn cũng có thể ghim ghi chú
              của riêng mình ở cuối hành trình.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {!reducedMotion && ordered.length > 0 && fullyRevealed && (
              <button
                type="button"
                onClick={handleResetReveal}
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-ink-light transition-colors hover:border-accent/40 hover:text-ink"
              >
                Xem lại hiệu ứng
              </button>
            )}
          </div>
        </div>

        {ordered.length === 0 ? (
          <div className="rounded-3xl border border-border bg-surface px-6 py-16 text-center">
            <p className="text-sm font-semibold text-ink">
              Chưa có cột mốc nào được cập nhật.
            </p>
          </div>
        ) : (
          <motion.div
            ref={timelineRef}
            className="relative mx-auto w-full max-w-[760px]"
            aria-busy={!timelineReady}
            aria-live="polite"
            initial={false}
            animate={{ height: spineHeight }}
            transition={timelineLayoutTransition(reducedMotion)}
          >
            {!timelineReady && (
              <div
                className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[var(--bg)]/80 backdrop-blur-sm"
                aria-hidden="true"
              >
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
                <p className="mt-3 text-xs font-semibold text-ink-light">
                  Đang dựng dòng thời gian…
                </p>
              </div>
            )}

            {animateReveal && !fullyRevealed && (
              <button
                type="button"
                onClick={handleSkipReveal}
                className="absolute right-0 top-0 z-30 rounded-md border border-border bg-surface/90 px-2.5 py-1 text-[11px] font-semibold text-ink-light shadow-sm backdrop-blur-sm transition-colors hover:border-accent/40 hover:text-ink"
              >
                Bỏ qua hiệu ứng
              </button>
            )}

            <AlternatingTimelinePath
              segments={pathSegments}
              width={layout.width}
              height={spineHeight}
            />

            <ul className="relative z-10 m-0 list-none p-0">
              {layout.yearRows.map((yearRow) => {
                const entries =
                  yearGroups.find((g) => g.year === yearRow.year)?.entries ?? [];

                return (
                  <Fragment key={`year-group-${yearRow.year}-${revealEpoch}`}>
                    <TimelineYearRow
                      row={yearRow}
                      isRevealed={yearRow.revealIndex <= maxRevealed}
                      animateReveal={animateReveal}
                      reducedMotion={reducedMotion}
                      onToggleYear={toggleYearCollapsed}
                      onEnterView={handleNoteEnterView}
                    />
                    {!collapsedYears.has(yearRow.year) &&
                      entries.map((entry) => {
                        const row = milestoneByEntryId.get(entry.id);
                        if (!row) return null;
                        return (
                          <TimelineMilestoneRow
                            key={`${entry.id}-${revealEpoch}`}
                            row={row}
                            isRevealed={row.revealIndex <= maxRevealed}
                            animateReveal={animateReveal}
                            reducedMotion={reducedMotion}
                            isCollapsing={collapsingYears.has(yearRow.year)}
                            onOpen={handleOpen}
                            onEnterView={handleNoteEnterView}
                          />
                        );
                      })}
                  </Fragment>
                );
              })}

              {showVisitorOnSpine && (
                <VisitorTimelineEndRow
                  side={layout.visitorEnd.side}
                  rowTop={layout.visitorEnd.rowTop}
                  note={visitorNote}
                  composerOpen={composerOpen}
                  reducedMotion={reducedMotion}
                  pulse={fullyRevealed}
                  layoutAnimate
                  onAdd={handleVisitorPatchClick}
                  onOpenNote={handleVisitorCardOpen}
                />
              )}
            </ul>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <NoteModalRouter
            milestone={selected}
            postsById={postsById}
            onClose={handleClose}
            reducedMotion={reducedMotion}
            closeRef={closeRef}
          />
        )}
      </AnimatePresence>

      <VisitorNoteComposer
        open={composerOpen}
        initial={visitorNote}
        reducedMotion={reducedMotion}
        onSave={handleVisitorSave}
        onRemove={handleVisitorRemove}
        onClose={handleComposerClose}
      />
    </section>
  );
}

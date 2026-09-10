"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { EVENTS } from "@/app/data/clubData";
import { subscribeEvents, incrementEventReaction } from "@/app/lib/firestoreService";
import type { EventItem, EventStatus } from "@/app/types";
import {
  CalendarDays,
  Clock,
  MapPin,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Flame,
  Dices,
  Award,
  Zap,
  Check,
  Share2,
  X,
} from "lucide-react";

// Lightweight canvas confetti burst (no external dependencies)
function triggerConfetti() {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "99999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);

  const colors = ["#e11d48", "#0284c7", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];
  const particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    rotation: number;
    vRot: number;
    alpha: number;
  }> = [];

  for (let i = 0; i < 70; i++) {
    particles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 18,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 5,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 12,
      alpha: 1,
    });
  }

  let animationFrameId: number;
  const startTime = Date.now();

  function render() {
    if (!ctx) return;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    let alive = false;
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.45; // gravity
      p.rotation += p.vRot;
      p.alpha -= 0.014;

      if (p.alpha > 0) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
    }

    if (alive && Date.now() - startTime < 2500) {
      requestAnimationFrame(render);
    } else {
      canvas.remove();
    }
  }

  requestAnimationFrame(render);
}

// Bách Khoa fortune punchlines for the event roulette
const ROULETTE_PUNCHLINES = [
  "🎯 Tổ Bách Khoa độ rồi! Sự kiện này sinh ra để cứu học bổng và kéo Điểm Rèn Luyện của bạn!",
  "⚡ Deadline dí sát nút rồi bạn ơi! Đăng ký ngay để tránh kiếp hối hận lúc 23:59!",
  "💻 Tham gia sự kiện này để tự tin qua môn Tin học đại cương mượt mà!",
  "🚀 Cơ hội vàng tìm người gánh tạ bài tập lớn và làm quen Đại sứ Số o365!",
  "☕ Uống một ngụm cà phê, đăng ký ngay sự kiện này để bật mood Gen Z tài năng!",
];

export default function EventsTimeline() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const [events, setEvents] = useState<EventItem[]>(EVENTS);
  const [activeTab, setActiveTab] = useState<EventStatus>("ongoing");
  const [filterHighlightOnly, setFilterHighlightOnly] = useState(false);
  const [speedrunMode, setSpeedrunMode] = useState(false);
  const [speedrunSeconds, setSpeedrunSeconds] = useState(0);

  const toggleSpeedrunMode = () => {
    setSpeedrunSeconds(0);
    setSpeedrunMode((prev) => !prev);
  };

  // Roulette Modal state
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [selectedRandomEvent, setSelectedRandomEvent] = useState<EventItem | null>(null);
  const [randomPunchline, setRandomPunchline] = useState("");

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Floating reaction particles state
  const [floatingParticles, setFloatingParticles] = useState<
    Array<{ id: number; x: number; y: number; emoji: string }>
  >([]);

  // Subscribe to real-time events from Firestore / localStorage
  useEffect(() => {
    const unsub = subscribeEvents((liveEvents) => {
      setEvents(liveEvents);
    });
    return () => unsub();
  }, []);

  // 10s Speedrun timer
  useEffect(() => {
    if (!speedrunMode) return;
    const interval = setInterval(() => {
      setSpeedrunSeconds((prev) => (prev >= 10 ? 10 : prev + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [speedrunMode]);

  // Close roulette on Escape
  useEffect(() => {
    if (!isRouletteOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsRouletteOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRouletteOpen]);

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      ongoing: events.filter((e) => (e.status || "ongoing") === "ongoing").length,
      upcoming: events.filter((e) => e.status === "upcoming").length,
      past: events.filter((e) => e.status === "past").length,
    };
  }, [events]);

  // Top highlight events for 10-second speedrun
  const importantEvents = useMemo(() => {
    const highlights = events.filter((e) => e.isHighlight || e.drl || e.status === "ongoing");
    return highlights.length > 0 ? highlights.slice(0, 4) : events.slice(0, 3);
  }, [events]);

  // Filtered events for the current active tab
  const filteredEvents = useMemo(() => {
    let list = events.filter((e) => {
      const s = e.status || "ongoing";
      return s === activeTab;
    });
    if (filterHighlightOnly) {
      list = list.filter((e) => e.isHighlight || Boolean(e.drl));
    }
    return list;
  }, [events, activeTab, filterHighlightOnly]);

  // Copy share link
  const handleCopyLink = (event: EventItem) => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/#events` : "";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${event.title} - CLB o365 HUST: ${event.linkUrl || url}`);
      showToast("Đã chép link sự kiện để gửi nhóm lớp! 🚀");
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Google Calendar URL builder
  const getGoogleCalendarUrl = (ev: EventItem) => {
    const text = encodeURIComponent(`[o365 HUST] ${ev.title}`);
    const details = encodeURIComponent(
      `${ev.description || ""}\n\nĐăng ký: ${ev.linkUrl}\nĐịa điểm: ${ev.location || "ĐHBK Hà Nội"}`
    );
    const location = encodeURIComponent(ev.location || "Đại học Bách khoa Hà Nội");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}&location=${location}`;
  };

  // Trigger Event Roulette
  const startEventRoulette = () => {
    setIsRouletteOpen(true);
    setIsRolling(true);
    setSelectedRandomEvent(null);

    // Filter available pool (prioritize ongoing and upcoming)
    const activePool = events.filter((e) => e.status !== "past");
    const pool = activePool.length > 0 ? activePool : events;

    let iterations = 0;
    const maxIterations = 14;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * pool.length);
      setSelectedRandomEvent(pool[randomIndex]);
      iterations++;

      if (iterations >= maxIterations) {
        clearInterval(interval);
        setIsRolling(false);
        const finalEvent = pool[Math.floor(Math.random() * pool.length)];
        setSelectedRandomEvent(finalEvent);
        setRandomPunchline(
          ROULETTE_PUNCHLINES[Math.floor(Math.random() * ROULETTE_PUNCHLINES.length)]
        );
        triggerConfetti();
      }
    }, 110);
  };

  // Handle reaction click
  const handleReaction = async (
    e: React.MouseEvent<HTMLButtonElement>,
    eventId: string,
    key: string,
    emoji: string
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newParticle = {
      id: Date.now() + Math.random(),
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      emoji,
    };
    setFloatingParticles((prev) => [...prev, newParticle]);
    setTimeout(() => {
      setFloatingParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 900);

    // Optimistically update locally
    setEvents((prev) =>
      prev.map((item) => {
        if (item.id !== eventId) return item;
        const currentReactions = item.reactions || {};
        return {
          ...item,
          reactions: {
            ...currentReactions,
            [key]: (currentReactions[key] || 0) + 1,
          },
        };
      })
    );

    // Sync to Firestore & localStorage
    await incrementEventReaction(eventId, key);
  };

  return (
    <section
      id="events"
      ref={ref}
      className="py-20 lg:py-28 relative overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-ink text-surface text-xs font-semibold shadow-xl flex items-center gap-2 border border-border"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Reaction Emojis */}
      {floatingParticles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, y: p.y, x: p.x, scale: 0.7 }}
          animate={{ opacity: 0, y: p.y - 60, scale: 1.4 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ position: "fixed", pointerEvents: "none", zIndex: 9999 }}
          className="text-2xl font-bold select-none drop-shadow-md"
        >
          {p.emoji}
        </motion.div>
      ))}

      <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border/80 text-xs font-semibold uppercase tracking-wider text-ink-muted mb-3">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Lịch Hoạt Động &amp; Công Tác SV</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3"
            style={{ color: "var(--ink)" }}
          >
            Sự Kiện &amp; Điểm Rèn Luyện
          </h2>
          <p
            className="max-w-2xl mx-auto text-sm sm:text-base text-ink-muted leading-relaxed"
          >
            Không bao giờ bỏ lỡ cơ hội tích lũy ĐRL, săn giải MOSWC và tham gia các hoạt động sôi nổi cùng Đại sứ Chuyển đổi số Bách Khoa.
          </p>
        </motion.div>

        {/* Feature Action Bar: 10s Speedrun & Event Roulette */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 p-3 rounded-2xl bg-surface border border-border shadow-xs">
          {/* 10s Speed Briefing Button */}
          <button
            type="button"
            onClick={toggleSpeedrunMode}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-accent ${
              speedrunMode
                ? "bg-amber-500 text-white shadow-amber-500/20"
                : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20"
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>{speedrunMode ? "Đóng Điểm Tin 10s" : "⚡ Điểm Tin 10s (Bách Khoa Speedrun)"}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono">
              &lt; 10s
            </span>
          </button>

          {/* Random Roulette Button */}
          <button
            type="button"
            onClick={startEventRoulette}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-card hover:bg-card/80 text-ink border border-border hover:border-accent/40 transition-all cursor-pointer shadow-xs active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-accent"
          >
            <Dices className="w-4 h-4 text-accent" />
            <span>🎲 Chọn hộ kèo sự kiện (Cứu ĐRL cấp tốc)</span>
          </button>
        </div>

        {/* ⚡ 10-SECOND SPEEDRUN BRIEFING PANEL */}
        <AnimatePresence>
          {speedrunMode && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-surface to-accent/10 border-2 border-amber-500/40 shadow-xl relative">
                {/* Header of 10s bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-border/80 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/30">
                      ⚡
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-ink flex items-center gap-2">
                        <span>Bản Điểm Tin Siêu Tốc 10 Giây</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono font-bold">
                          TOP SỰ KIỆN NÓNG NHẤT
                        </span>
                      </h3>
                      <p className="text-xs text-ink-muted">
                        Chỉ lướt 8-10 giây để nắm trọn deadline quan trọng &amp; cơ hội cộng Điểm Rèn Luyện!
                      </p>
                    </div>
                  </div>

                  {/* Visual 10s Countdown Bar */}
                  <div className="flex items-center gap-2 self-start sm:self-auto bg-surface/80 border border-border px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-ink shadow-xs">
                    <Clock className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                    <span>
                      {speedrunSeconds < 10
                        ? `Đang xem: ${speedrunSeconds}s / 10s`
                        : "Đã nắm trọn sự kiện! 🚀"}
                    </span>
                  </div>
                </div>

                {/* Speedrun Flash Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {importantEvents.map((ev, idx) => (
                    <div
                      key={ev.id}
                      className="p-4 rounded-2xl bg-surface border border-border/90 hover:border-amber-500/50 shadow-sm flex flex-col justify-between transition-all hover:shadow-md relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 w-12 h-12 bg-amber-500/10 rounded-bl-3xl flex items-start justify-end p-1.5 text-xs font-mono font-bold text-amber-600">
                        #{idx + 1}
                      </div>

                      <div>
                        {/* Meta Tags */}
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-card text-ink border border-border font-mono">
                            {ev.month}
                          </span>
                          {ev.drl && (
                            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                              {ev.drl}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h4 className="font-bold text-sm text-ink group-hover:text-accent transition-colors line-clamp-2 mb-1.5">
                          {ev.title}
                        </h4>

                        {/* Punchline */}
                        {ev.funnyQuote && (
                          <p className="text-[11px] text-accent italic line-clamp-1 mb-3">
                            “{ev.funnyQuote}”
                          </p>
                        )}
                      </div>

                      {/* Fast Action CTA */}
                      <a
                        href={ev.linkUrl || "#"}
                        target={ev.linkUrl?.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center justify-between w-full px-3 py-1.5 rounded-xl bg-ink text-surface hover:bg-ink/90 text-xs font-bold transition-transform active:scale-95 shadow-xs"
                      >
                        <span className="truncate">{ev.linkLabel || "Xem ngay"}</span>
                        <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── TAB NAVIGATION BAR ─── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          {/* 3 Tabs: Đang diễn ra, Sắp diễn ra, Đã diễn ra */}
          <div className="flex items-center p-1 rounded-2xl bg-surface border border-border shadow-xs w-full sm:w-auto overflow-x-auto">
            {(
              [
                {
                  id: "ongoing",
                  label: "Đang diễn ra",
                  icon: "🟢",
                  count: tabCounts.ongoing,
                  color: "text-emerald-600 dark:text-emerald-400",
                },
                {
                  id: "upcoming",
                  label: "Sắp diễn ra",
                  icon: "⏳",
                  count: tabCounts.upcoming,
                  color: "text-blue-600 dark:text-blue-400",
                },
                {
                  id: "past",
                  label: "Đã diễn ra",
                  icon: "🏁",
                  count: tabCounts.past,
                  color: "text-purple-600 dark:text-purple-400",
                },
              ] as const
            ).map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                    isActive ? "text-ink" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeEventTabIndicator"
                      className="absolute inset-0 bg-card rounded-xl border border-border shadow-xs"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{tab.icon}</span>
                  <span className="relative z-10">{tab.label}</span>
                  <span
                    className={`relative z-10 text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive
                        ? "bg-surface text-ink font-bold border border-border"
                        : "bg-card text-ink-light"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Filter: ⭐ HOT / Lấy ĐRL Toggle */}
          <button
            onClick={() => setFilterHighlightOnly(!filterHighlightOnly)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
              filterHighlightOnly
                ? "bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-300 font-bold shadow-xs"
                : "border-border bg-surface text-ink-muted hover:text-ink hover:bg-card"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Chỉ xem HOT / Có ĐRL</span>
          </button>
        </div>

        {/* ─── EVENTS CARD LIST ─── */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredEvents.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="text-center py-16 px-6 rounded-3xl bg-surface border border-border shadow-card"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-card border border-border flex items-center justify-center text-3xl">
                  {activeTab === "ongoing" ? "☕" : activeTab === "upcoming" ? "📅" : "✨"}
                </div>
                <h3 className="font-bold text-base text-ink mb-1">
                  {activeTab === "ongoing"
                    ? "Hiện tại đang yên ắng..."
                    : activeTab === "upcoming"
                    ? "Chưa có sự kiện sắp tới mới"
                    : "Chưa có lưu trữ sự kiện cũ"}
                </h3>
                <p className="text-xs text-ink-muted max-w-md mx-auto mb-4">
                  {activeTab === "ongoing"
                    ? "Bạn có thể tranh thủ ngủ bù hoặc cày nốt deadline bài tập lớn! Đừng quên theo dõi fanpage o365 để không bỏ lỡ đợt tuyển quân kế tiếp."
                    : "Các chương trình và hội thảo sẽ được Ban Truyền thông & Sự kiện cập nhật sớm nhất tại đây."}
                </p>
                <button
                  onClick={() => {
                    setActiveTab("ongoing");
                    setFilterHighlightOnly(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-ink text-surface text-xs font-semibold hover:bg-ink/90 transition-colors cursor-pointer"
                >
                  Xem tất cả hoạt động
                </button>
              </motion.div>
            ) : (
              filteredEvents.map((event, i) => {
                const isOngoing = (event.status || "ongoing") === "ongoing";
                const isUpcoming = event.status === "upcoming";
                const isPast = event.status === "past";

                const reactions = event.reactions || {};
                const fireCount = reactions.fire || 0;
                const drlCount = reactions.drl || 0;
                const deadlineCount = reactions.deadline || 0;
                const trophyCount = reactions.trophy || 0;

                return (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.35, delay: i * 0.05 }}
                    className={`rounded-2xl border p-5 sm:p-6 transition-all hover:shadow-md relative overflow-hidden ${
                      event.isHighlight
                        ? "bg-gradient-to-r from-amber-500/[0.04] via-surface to-surface border-amber-500/30"
                        : "bg-surface border-border"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                      {/* Left: Time badge & Meta info */}
                      <div className="flex items-start gap-4 flex-1">
                        {/* Month / Date Badge */}
                        <div className="flex flex-col items-center shrink-0">
                          <span
                            className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 shadow-2xs border border-border"
                            style={{
                              backgroundColor: "var(--card)",
                              color: "var(--ink)",
                            }}
                          >
                            <CalendarDays className="w-3.5 h-3.5 text-accent" />
                            {event.month}
                          </span>

                          {event.drl && (
                            <span className="mt-1.5 text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 shadow-2xs">
                              {event.drl}
                            </span>
                          )}
                        </div>

                        {/* Title, description & badges */}
                        <div className="space-y-1.5 flex-1 min-w-0">
                          {/* Tags Row */}
                          <div className="flex flex-wrap items-center gap-2">
                            {isOngoing && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                ĐANG DIỄN RA
                              </span>
                            )}
                            {isUpcoming && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                                <Clock className="w-3 h-3 text-blue-500" />
                                SẮP DIỄN RA
                              </span>
                            )}
                            {isPast && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                                <Award className="w-3 h-3 text-purple-500" />
                                ĐÃ HOÀN THÀNH
                              </span>
                            )}

                            {event.category && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-card text-ink-light border border-border/80">
                                {event.category}
                              </span>
                            )}

                            {event.isHighlight && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20 flex items-center gap-1">
                                <Flame className="w-3 h-3 text-amber-500" />
                                HOT / 10s
                              </span>
                            )}
                          </div>

                          {/* Event Title */}
                          <h3 className="text-base sm:text-lg font-bold text-ink tracking-tight">
                            {event.title}
                          </h3>

                          {/* Funny Quote */}
                          {event.funnyQuote && (
                            <p className="text-xs text-accent italic font-medium flex items-center gap-1.5">
                              <span>💡</span>
                              <span>“{event.funnyQuote}”</span>
                            </p>
                          )}

                          {/* Description */}
                          {event.description && (
                            <p className="text-xs sm:text-sm text-ink-light leading-relaxed">
                              {event.description}
                            </p>
                          )}

                          {/* Location */}
                          {event.location && (
                            <div className="flex items-center gap-1.5 text-xs text-ink-muted font-mono pt-1">
                              <MapPin className="w-3.5 h-3.5 text-ink-light" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions and Live Reactions */}
                      <div className="flex flex-col items-start lg:items-end gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-border/80">
                        {/* Quick action buttons */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Calendar button */}
                          <a
                            href={getGoogleCalendarUrl(event)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-card hover:bg-card/80 text-ink-light hover:text-ink border border-border text-xs transition-colors cursor-pointer"
                            title="Thêm vào Google Calendar"
                          >
                            <CalendarDays className="w-3.5 h-3.5" />
                          </a>

                          {/* Share button */}
                          <button
                            onClick={() => handleCopyLink(event)}
                            className="p-2 rounded-xl bg-card hover:bg-card/80 text-ink-light hover:text-ink border border-border text-xs transition-colors cursor-pointer"
                            title="Sao chép link gửi nhóm lớp"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Main CTA */}
                          <a
                            href={event.linkUrl}
                            target={event.linkUrl.startsWith("http") ? "_blank" : undefined}
                            rel={event.linkUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 ${
                              isOngoing || event.isHighlight
                                ? "bg-ink text-surface hover:bg-ink/90"
                                : "bg-card hover:bg-card/80 text-ink border border-border"
                            }`}
                          >
                            <span>{event.linkLabel || "Xem chi tiết"}</span>
                            {event.linkUrl.startsWith("http") ? (
                              <ExternalLink className="w-3.5 h-3.5" />
                            ) : (
                              <ArrowRight className="w-3.5 h-3.5" />
                            )}
                          </a>
                        </div>

                        {/* Interactive Funny Reaction Pills (Wired to Firestore) */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            onClick={(e) => handleReaction(e, event.id, "fire", "🔥")}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-card hover:bg-card/80 text-ink-light hover:text-ink border border-border/80 transition-transform active:scale-90 cursor-pointer"
                            title="Thả tim hóng sự kiện"
                          >
                            <span>🔥</span>
                            <span>{fireCount}</span>
                          </button>

                          <button
                            onClick={(e) => handleReaction(e, event.id, "drl", "⚡")}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-card hover:bg-card/80 text-ink-light hover:text-ink border border-border/80 transition-transform active:scale-90 cursor-pointer"
                            title="Cứu Điểm Rèn Luyện"
                          >
                            <span>⚡ ĐRL</span>
                            <span>{drlCount}</span>
                          </button>

                          <button
                            onClick={(e) => handleReaction(e, event.id, "deadline", "☕")}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-card hover:bg-card/80 text-ink-light hover:text-ink border border-border/80 transition-transform active:scale-90 cursor-pointer"
                            title="Deadline dí sát nút"
                          >
                            <span>☕ Cày</span>
                            <span>{deadlineCount}</span>
                          </button>

                          <button
                            onClick={(e) => handleReaction(e, event.id, "trophy", "🎯")}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-card hover:bg-card/80 text-ink-light hover:text-ink border border-border/80 transition-transform active:scale-90 cursor-pointer"
                            title="Săn giải MOSWC & Khen thưởng"
                          >
                            <span>🎯 Giải</span>
                            <span>{trophyCount}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── ROULETTE / BÁCH KHOA EVENT PICKER MODAL ─── */}
      <AnimatePresence>
        {isRouletteOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay backdrop-blur-xs"
            onClick={() => setIsRouletteOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Xúc Xắc Cứu Điểm Rèn Luyện Bách Khoa"
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-2xl bg-surface border border-border shadow-2xl overflow-hidden p-6 sm:p-8"
            >
              <button
                type="button"
                onClick={() => setIsRouletteOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-card hover:bg-card/80 text-ink-muted hover:text-ink flex items-center justify-center cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-accent active:scale-[0.96]"
                aria-label="Đóng bảng chọn sự kiện"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-6">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-3xl">
                  🎲
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-ink tracking-tight mb-1">
                  Xúc Xắc Cứu ĐRL Bách Khoa
                </h3>
                <p className="text-xs text-ink-muted">
                  Bận rộn quá không biết chọn gì? Để AI o365 gắp sự kiện chuẩn gu cho bạn!
                </p>
              </div>

              {/* Roulette Content Display */}
              <div className="p-5 rounded-2xl bg-card border border-border mb-6 min-h-[160px] flex flex-col justify-center items-center text-center relative overflow-hidden">
                {isRolling ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="text-xs font-mono uppercase tracking-widest text-accent font-bold">
                      Đang quay roulette...
                    </div>
                    <div className="text-lg font-extrabold text-ink line-clamp-1">
                      {selectedRandomEvent?.title || "Đang lọc sự kiện..."}
                    </div>
                    <div className="text-xs text-ink-muted">
                      {selectedRandomEvent?.month} • {selectedRandomEvent?.location}
                    </div>
                  </div>
                ) : selectedRandomEvent ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-2.5 w-full"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-mono">
                        {selectedRandomEvent.drl || "+5 ĐRL"}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-card text-ink border border-border">
                        {selectedRandomEvent.month}
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-bold text-ink">
                      {selectedRandomEvent.title}
                    </h4>

                    {randomPunchline && (
                      <p className="text-xs text-accent font-medium italic px-2">
                        {randomPunchline}
                      </p>
                    )}

                    <p className="text-xs text-ink-light line-clamp-2">
                      {selectedRandomEvent.description}
                    </p>
                  </motion.div>
                ) : null}
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={isRolling}
                  onClick={startEventRoulette}
                  className="px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-card/80 text-ink text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                >
                  🎲 Quay lại kèo khác
                </button>

                {selectedRandomEvent && !isRolling && (
                  <a
                    href={selectedRandomEvent.linkUrl || "#"}
                    target={selectedRandomEvent.linkUrl?.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-ink text-surface hover:bg-ink/90 text-xs font-bold transition-transform active:scale-95 shadow-md flex items-center gap-1.5"
                  >
                    <span>Chốt kèo sự kiện này!</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

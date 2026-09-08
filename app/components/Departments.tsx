"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { DEPARTMENTS, RECRUITMENT_INFO } from "@/app/data/clubData";
import type { Department } from "@/app/types";
import {
  Sparkles,
  MoveHorizontal,
  ArrowRight,
  ExternalLink,
  X,
  CheckCircle2,
  Zap,
  Eye,
} from "lucide-react";

export default function Departments() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState<{ left: number; right: number }>({
    left: -800,
    right: 800,
  });
  const x = useMotionValue(0);

  // Selected department for Quick-Preview Modal
  const [previewDept, setPreviewDept] = useState<Department | null>(null);

  // Track dragging to prevent accidental modal opens on drag release
  const dragDistanceRef = useRef(0);

  // Center the cards range on Card 3 and calculate balanced drag constraints
  useEffect(() => {
    const calculateLayout = () => {
      if (!containerRef.current) return;
      const isMobile = window.innerWidth < 640;
      const isTablet = window.innerWidth < 1024;

      const cardW = isMobile ? 300 : isTablet ? 350 : 390;
      const gapW = isMobile ? 20 : 28;
      const step = cardW + gapW;

      // Center coordinate of the viewport / carousel container
      const containerW = containerRef.current.clientWidth;
      const screenCenter = containerW / 2;

      // Center of Card 3 (index 2: Card 1, Card 2, [Card 3], Card 4, Card 5)
      const card3Center = 2 * step + cardW / 2;
      const initialCenterOffset = screenCenter - card3Center;

      // Card 1 center and Card 5 center
      const card1Center = cardW / 2;
      const card5Center = 4 * step + cardW / 2;

      // Generous drag constraints so both Card 1 and Card 5 can be dragged smoothly into center
      const clearance = isMobile ? 60 : 120;
      const maxRight = screenCenter - card1Center + clearance;
      const minLeft = screenCenter - card5Center - clearance;

      setConstraints({ left: minLeft, right: maxRight });
      x.set(initialCenterOffset);
    };

    calculateLayout();
    const timer = setTimeout(calculateLayout, 200);
    window.addEventListener("resize", calculateLayout);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calculateLayout);
    };
  }, [x]);

  const handleCardClick = (dept: Department) => {
    // If dragged more than 6px, treat as pan, don't open modal
    if (Math.abs(dragDistanceRef.current) < 6) {
      setPreviewDept(dept);
    }
  };

  return (
    <section
      id="departments"
      className="relative py-16 sm:py-24 overflow-hidden select-none"
      style={{ background: "var(--bg)" }}
    >
      {/* Subtle background dot pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(var(--ink) 0.75px, transparent 0.75px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative max-w-[var(--max-width)] mx-auto px-5 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border/70">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-mono font-medium uppercase tracking-wider mb-2 bg-surface border border-border text-ink-light shadow-2xs">
              <Sparkles className="w-3 h-3 text-accent" />
              <span>CƠ CẤU TỔ CHỨC</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink tracking-tight">
              Bộ Máy Hoạt Động o365
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-ink-light max-w-xl">
              Khám phá 5 ban chuyên trách kiến tạo sân chơi công nghệ và kỹ năng số cho sinh viên Bách Khoa. Bấm vào từng ban để xem nhanh hoặc mở trang chi tiết.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-border text-xs font-mono text-ink-muted shadow-2xs self-start md:self-end">
            <MoveHorizontal className="w-3.5 h-3.5 text-accent animate-pulse" />
            <span>Kéo tự do 2 bên</span>
          </div>
        </div>
      </div>

      {/* Free-Dragging Carousel Track with Cinematic Edge Fades */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden mt-6 sm:mt-8 py-4 sm:py-6"
      >
        {/* Left & Right gradient edge fades */}
        <div className="absolute inset-y-0 left-0 w-8 sm:w-20 bg-gradient-to-r from-[var(--bg)] to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-8 sm:w-20 bg-gradient-to-l from-[var(--bg)] to-transparent pointer-events-none z-10" />

        {/* Free-Moving Draggable Track centered at Card 3 */}
        <motion.div
          drag="x"
          dragConstraints={constraints}
          dragElastic={0.14}
          onDragStart={() => {
            dragDistanceRef.current = 0;
          }}
          onDrag={(_, info) => {
            dragDistanceRef.current += Math.abs(info.delta.x);
          }}
          dragTransition={{
            power: 0.28,
            timeConstant: 240,
            bounceStiffness: 280,
            bounceDamping: 26,
          }}
          style={{ x }}
          whileTap={{ cursor: "grabbing" }}
          className="flex gap-5 sm:gap-7 cursor-grab active:cursor-grabbing will-change-transform pl-5 sm:pl-6"
        >
          {DEPARTMENTS.map((dept) => {
            const isCard3 = dept.index === "03";

            return (
              <div
                key={dept.id}
                onClick={() => handleCardClick(dept)}
                className={`w-[300px] sm:w-[350px] lg:w-[390px] shrink-0 flex flex-col justify-between rounded-2xl bg-surface border p-6 sm:p-7 shadow-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1.5 group select-none cursor-pointer relative ${
                  isCard3
                    ? "border-accent/80 ring-1 ring-accent/30"
                    : "border-border hover:border-accent/50"
                }`}
              >
                {/* Top Bracketed Index & Direct Link */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs sm:text-sm font-semibold tracking-widest text-ink-muted/80">
                    [&nbsp; {dept.index} &nbsp;]
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/co-cau/${dept.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 rounded-lg text-ink-muted hover:text-accent hover:bg-card transition-colors"
                      title="Mở trang ban riêng"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${
                        isCard3
                          ? "bg-accent scale-110 shadow-2xs"
                          : "bg-border group-hover:bg-accent/70"
                      } transition-colors`}
                    />
                  </div>
                </div>

                {/* Isometric Line-Art Illustration */}
                <div className="relative w-full aspect-square max-w-[210px] sm:max-w-[230px] mx-auto my-3 flex items-center justify-center pointer-events-none">
                  <Image
                    src={dept.image}
                    alt={dept.name}
                    fill
                    sizes="(max-width: 768px) 240px, 390px"
                    className="object-contain p-1 transition-transform duration-300 group-hover:scale-105"
                    priority={dept.index === "02" || dept.index === "03" || dept.index === "04"}
                  />
                </div>

                {/* Title & Slogan */}
                <div className="mt-2">
                  <h3 className="font-extrabold text-lg sm:text-xl text-ink tracking-tight uppercase mb-1 line-clamp-1 group-hover:text-accent transition-colors">
                    {dept.name}
                  </h3>
                  <p className="text-xs font-medium text-ink-light italic mb-2.5 line-clamp-1">
                    {dept.tagline}
                  </p>
                  <p className="text-xs sm:text-sm leading-relaxed text-ink-light/90 line-clamp-3">
                    {dept.description}
                  </p>
                </div>

                {/* Leader Info Chip & Quick Action */}
                <div className="pt-4 mt-4 border-t border-border/70 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-7 h-7 rounded-full text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs"
                      style={{ backgroundColor: dept.accentColor }}
                    >
                      {dept.leader?.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-ink text-[12px] leading-tight truncate">
                        {dept.leader?.name}
                      </p>
                      <p className="text-[10px] text-ink-muted leading-tight truncate">
                        {dept.leader?.role}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-accent group-hover:translate-x-0.5 transition-transform shrink-0">
                    <span>Xem nhanh</span>
                    <Eye className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* ─── HYBRID QUICK-PREVIEW MODAL ─── */}
      <AnimatePresence>
        {previewDept && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl bg-surface border-2 border-border shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div
                className="relative p-6 sm:p-7 border-b border-border/80 flex items-start justify-between"
                style={{
                  backgroundColor: previewDept.color,
                }}
              >
                <div className="space-y-1 relative z-10 pr-6">
                  <span className="inline-block text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/70 backdrop-blur-xs text-ink shadow-2xs">
                    BAN [{previewDept.index}] / 05
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-ink tracking-tight uppercase">
                    {previewDept.name}
                  </h3>
                  <p
                    className="text-xs sm:text-sm font-medium italic"
                    style={{ color: previewDept.accentColor }}
                  >
                    “{previewDept.tagline}”
                  </p>
                </div>

                <button
                  onClick={() => setPreviewDept(null)}
                  className="w-8 h-8 rounded-full bg-surface/80 hover:bg-surface text-ink flex items-center justify-center cursor-pointer transition-colors shrink-0 shadow-2xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-7 overflow-y-auto space-y-5 text-sm">
                {/* Description & Mission */}
                <p className="text-xs sm:text-sm text-ink-light leading-relaxed">
                  {previewDept.fullDescription || previewDept.description}
                </p>

                {previewDept.mission && (
                  <div className="p-4 rounded-2xl bg-card border border-border/80 text-xs text-ink leading-relaxed flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold">Sứ mệnh: </strong>
                      <span>{previewDept.mission}</span>
                    </div>
                  </div>
                )}

                {/* Key Stats Chips */}
                {previewDept.stats && previewDept.stats.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-ink-muted mb-2.5">
                      Điểm Nhấn Nổi Bật
                    </h4>
                    <div className="grid grid-cols-3 gap-2.5 text-center">
                      {previewDept.stats.map((st) => (
                        <div
                          key={st.label}
                          className="p-3 rounded-xl bg-card border border-border shadow-2xs"
                        >
                          <div
                            className="text-lg sm:text-xl font-black"
                            style={{ color: previewDept.accentColor }}
                          >
                            {st.value}
                          </div>
                          <div className="text-[10px] text-ink-muted truncate">
                            {st.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills Preview */}
                {previewDept.skillsLearned && previewDept.skillsLearned.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-ink-muted mb-2">
                      Kỹ Năng Đào Tạo
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {previewDept.skillsLearned.map((sk) => (
                        <span
                          key={sk}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-card text-[11px] font-medium text-ink border border-border/80"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>{sk}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Leader Card */}
                {previewDept.leader && (
                  <div className="p-3.5 rounded-2xl bg-card border border-border flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0"
                      style={{ backgroundColor: previewDept.accentColor }}
                    >
                      {previewDept.leader.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-ink truncate">
                        {previewDept.leader.name}
                      </p>
                      <p className="text-[10px] text-ink-muted truncate">
                        {previewDept.leader.role}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer Actions */}
              <div className="p-4 sm:p-5 border-t border-border/80 bg-surface flex items-center justify-between gap-3">
                <button
                  onClick={() => setPreviewDept(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-ink-muted hover:text-ink hover:bg-card transition-colors cursor-pointer"
                >
                  Đóng
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href={RECRUITMENT_INFO.formUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-card/80 text-xs font-bold text-ink transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Ứng tuyển</span>
                  </a>

                  <Link
                    href={`/co-cau/${previewDept.id}`}
                    onClick={() => setPreviewDept(null)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ink text-surface hover:bg-ink/90 text-xs font-bold transition-transform active:scale-95 shadow-xs"
                  >
                    <span>Xem trang đầy đủ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

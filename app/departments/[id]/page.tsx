"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { DEPARTMENTS, getDepartmentByIdOrSlug, RECRUITMENT_INFO } from "@/app/data/clubData";
import DepartmentBentoGrid from "../components/DepartmentBentoGrid";
import Footer from "@/app/components/Footer";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileQuestion,
  ChevronRight,
  Send,
} from "lucide-react";

interface DepartmentPageProps {
  params: Promise<{ id: string }>;
}

export default function DepartmentDetailPage({ params }: DepartmentPageProps) {
  const { id } = use(params);
  const dept = getDepartmentByIdOrSlug(id);

  if (!dept) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-ink flex flex-col justify-between">
        <main className="max-w-md mx-auto px-5 py-24 text-center">
          <div className="w-14 h-14 rounded-2xl bg-card border border-border mx-auto flex items-center justify-center text-ink-muted mb-4 shadow-2xs">
            <FileQuestion className="w-7 h-7 text-accent" />
          </div>
          <h1 className="text-xl font-bold text-ink mb-2">Không tìm thấy thông tin Ban</h1>
          <p className="text-xs sm:text-sm text-ink-light mb-6">
            Đường dẫn không tồn tại hoặc đã được thay đổi. Bạn có thể chọn khám phá các ban chuyên trách khác của o365 bên dưới.
          </p>
          <div className="flex flex-col gap-2">
            {DEPARTMENTS.map((d) => (
              <Link
                key={d.id}
                href={`/departments/${d.id}`}
                className="px-4 py-2 rounded-xl bg-card hover:bg-surface border border-border text-xs font-semibold text-ink flex items-center justify-between transition-colors"
              >
                <span>{d.name}</span>
                <ChevronRight className="w-3.5 h-3.5 text-accent" />
              </Link>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const otherDepts = DEPARTMENTS.filter((d) => d.id !== dept.id);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-ink flex flex-col">
      <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden border-b border-border/80">
        <div
          className="absolute -top-32 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: dept.accentColor }}
        />

        <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border text-xs font-mono font-bold text-ink">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: dept.accentColor }}
                />
                <span>BAN [{dept.index}] / 05</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink leading-tight">
                {dept.name}
              </h1>

              <p className="text-base sm:text-lg font-medium italic text-accent">
                “{dept.tagline}”
              </p>

              <p className="text-sm sm:text-base text-ink-light leading-relaxed">
                {dept.fullDescription || dept.description}
              </p>

              {dept.mission && (
                <div className="p-5 rounded-2xl bg-card border border-border text-sm text-ink leading-relaxed flex items-start gap-3 shadow-2xs">
                  <Sparkles className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold text-ink mb-1">
                      Định hướng của ban
                    </strong>
                    <span className="text-ink-light">{dept.mission}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full aspect-[4/3] max-w-[400px] rounded-3xl border border-border shadow-card overflow-hidden bg-card">
                <Image
                  src={dept.image}
                  alt={dept.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                  priority
                />
              </div>

              {dept.leader && (
                <div className="w-full max-w-[400px] mt-4 p-4 rounded-2xl bg-surface border border-border shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-accent-fg shrink-0 bg-accent">
                    {dept.leader.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-ink truncate">
                      {dept.leader.name}
                    </p>
                    <p className="text-xs text-ink-muted truncate">
                      {dept.leader.role}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {dept.stats && dept.stats.length > 0 && (
        <section className="py-10 bg-surface/50 border-b border-border/70">
          <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {dept.stats.map((st) => (
                <div
                  key={st.label}
                  className="p-5 rounded-2xl bg-card border border-border shadow-2xs flex flex-col justify-between"
                >
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-ink-muted">
                    {st.label}
                  </span>
                  <div
                    className="text-2xl sm:text-3xl font-black my-1"
                    style={{ color: dept.accentColor }}
                  >
                    {st.value}
                  </div>
                  {st.desc && (
                    <span className="text-xs text-ink-light">{st.desc}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-14 sm:py-20">
        <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-6">
          <DepartmentBentoGrid
            items={dept.bentoItems || []}
            departmentName={dept.name}
            accentColor={dept.accentColor}
          />
        </div>
      </section>

      {dept.keyActivities && dept.keyActivities.length > 0 && (
        <section className="py-12 sm:py-16 bg-surface/60 border-t border-border/80">
          <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-6">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-accent">
                Nhiệm vụ của ban
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1">
                Các nhiệm vụ trọng tâm
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {dept.keyActivities.map((act, i) => (
                <div
                  key={act.title}
                  className="p-6 rounded-2xl bg-card border border-border shadow-xs flex flex-col justify-between hover:shadow-md transition-all group"
                >
                  <div>
                    <div className="w-8 h-8 rounded-xl bg-surface border border-border font-mono font-bold text-xs flex items-center justify-center mb-3 text-ink group-hover:border-accent transition-colors">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <h3 className="font-bold text-base sm:text-lg text-ink mb-2">
                      {act.title}
                    </h3>
                    <p className="text-sm text-ink-light leading-relaxed">
                      {act.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {dept.memberHighlights && dept.memberHighlights.length > 0 && (
        <section className="py-12 sm:py-16 border-t border-border/80">
          <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-6">
            <div className="max-w-2xl mb-10">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-accent">
                Thành viên tiêu biểu
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1">
                Thành tích &amp; dấu ấn thành viên
              </h2>
            </div>

            <ul className="m-0 p-0 list-none grid grid-cols-1 md:grid-cols-2 gap-5">
              {dept.memberHighlights.map((member) => (
                <li
                  key={member.name}
                  className="p-5 rounded-2xl bg-card border border-border"
                >
                  <h3 className="font-bold text-base sm:text-lg text-ink mb-2 m-0">
                    {member.name}
                  </h3>
                  <p className="text-sm text-ink-light leading-relaxed m-0">
                    {member.detail}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {dept.skillsLearned && dept.skillsLearned.length > 0 && (
        <section className="py-12 border-t border-border/80">
          <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-6">
            <div className="p-8 sm:p-10 rounded-3xl bg-surface border border-border shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-md space-y-2 text-center md:text-left">
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-accent">
                  Quyền lợi thành viên
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-ink">
                  Kỹ năng bạn sẽ nhận được từ {dept.name}
                </h3>
                <p className="text-sm text-ink-light">
                  Môi trường thực chiến giúp bạn nâng tầm hồ sơ và tự tin trong học tập, công việc.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 max-w-lg justify-center md:justify-end">
                {dept.skillsLearned.map((sk) => (
                  <span
                    key={sk}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border text-sm font-medium text-ink shadow-2xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                    <span>{sk}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-14 sm:py-20 border-t border-border/80 bg-gradient-to-br from-surface via-card/50 to-surface">
        <div className="max-w-3xl mx-auto px-5 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 mx-auto flex items-center justify-center text-accent shadow-sm">
            <Send className="w-5 h-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
            Sẵn Sàng Trở Thành Một Phần Của {dept.name}?
          </h2>
          <p className="text-sm text-ink-light leading-relaxed max-w-lg mx-auto">
            Đợt tuyển thành viên Gen 3.0 đang mở đơn! Tham gia ngay để cùng chúng mình kiến tạo những dấu ấn số tại ĐHBK Hà Nội.
          </p>
          <div className="pt-2">
            <a
              href={RECRUITMENT_INFO.formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-accent text-accent-fg hover:bg-accent-hover text-sm font-bold transition-all shadow-md active:scale-95"
            >
              <span>Nộp đơn ứng tuyển ngay</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="py-12 border-t border-border bg-surface">
        <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-accent">
                Khám phá
              </span>
              <h3 className="text-lg font-bold text-ink">Các Ban Chuyên Trách Khác</h3>
            </div>
            <Link
              href="/departments"
              className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
            >
              <span>Toàn bộ cơ cấu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {otherDepts.map((od) => (
              <Link
                key={od.id}
                href={`/departments/${od.id}`}
                className="p-4 rounded-2xl bg-card hover:bg-surface border border-border hover:border-accent/40 shadow-xs hover:shadow-md transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-border/80 bg-card">
                    <Image
                      src={od.image}
                      alt={od.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-ink-muted font-bold">
                      [{od.index}]
                    </span>
                    <h4 className="text-xs font-bold text-ink group-hover:text-accent transition-colors truncate">
                      {od.name}
                    </h4>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-ink-muted group-hover:text-accent transition-transform group-hover:translate-x-0.5 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

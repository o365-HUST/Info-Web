"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  DEPARTMENTS,
  getDepartmentByIdOrSlug,
} from "@/app/data/clubData";
import { useRecruitment } from "@/app/hooks/useRecruitment";
import DepartmentBentoGrid from "../components/DepartmentBentoGrid";
import DepartmentGallery from "../components/DepartmentGallery";
import DepartmentSubUnits from "../components/DepartmentSubUnits";
import { CHUYEN_MON_GALLERY_SUBUNIT_LABELS } from "../components/departmentSubUnitsContent";
import Footer from "@/app/components/Footer";
import { ArrowRight } from "lucide-react";

interface DepartmentPageProps {
  params: Promise<{ id: string }>;
}

export default function DepartmentDetailPage({ params }: DepartmentPageProps) {
  const { id } = use(params);
  const recruitment = useRecruitment();
  const dept = getDepartmentByIdOrSlug(id);

  if (!dept) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-ink flex flex-col justify-between">
        <main className="max-w-lg mx-auto px-5 py-24">
          <h1 className="font-display text-2xl font-extrabold text-ink tracking-tight mb-3">
            Không tìm thấy thông tin ban
          </h1>
          <p className="text-sm text-ink-light leading-relaxed mb-8 m-0">
            Đường dẫn không tồn tại hoặc đã được thay đổi. Chọn một ban dưới đây
            để tiếp tục.
          </p>
          <ul className="m-0 p-0 list-none space-y-3">
            {DEPARTMENTS.map((d) => (
              <li key={d.id} className="border-t border-border pt-3">
                <Link
                  href={`/departments/${d.id}`}
                  className="text-sm font-semibold text-ink hover:text-accent transition-colors focus-visible:outline-2 focus-visible:outline-accent rounded-sm"
                >
                  {d.index} · {d.name}
                </Link>
              </li>
            ))}
          </ul>
        </main>
        <Footer />
      </div>
    );
  }

  const otherDepts = DEPARTMENTS.filter((d) => d.id !== dept.id);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-ink flex flex-col">
      <section className="relative py-12 sm:py-16 lg:py-20 border-b border-border">
        <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-7">
              <p className="font-display text-[11px] font-semibold tracking-[0.28em] uppercase text-accent mb-4">
                Ban {dept.index} / 05
              </p>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink leading-tight mb-4">
                {dept.name}
              </h1>
              <p className="text-base sm:text-lg text-ink-light leading-relaxed mb-6">
                {dept.fullDescription || dept.description}
              </p>
              {dept.mission && (
                <blockquote className="m-0 border-l-2 border-accent/50 pl-4">
                  <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-accent mb-2 m-0">
                    Định hướng
                  </p>
                  <p className="text-sm sm:text-base text-ink leading-relaxed m-0">
                    {dept.mission}
                  </p>
                </blockquote>
              )}
            </div>

            <div className="lg:col-span-5">
              <figure className="relative m-0">
                <div className="photo-slot image-depth relative w-full aspect-[4/3]">
                  <Image
                    src={dept.image}
                    alt={`Thành viên ${dept.name}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="object-cover object-[center_30%]"
                    priority
                  />
                </div>
                {dept.leader && (
                  <figcaption className="relative z-10 -mt-10 mx-3 sm:mx-4">
                    <div className="rounded-lg border border-border-strong bg-card px-4 py-3.5 shadow-md">
                      <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-accent m-0 mb-1.5">
                        Phụ trách
                      </p>
                      <p className="font-display text-lg sm:text-xl font-bold text-ink tracking-tight m-0 text-balance">
                        {dept.leader.name}
                      </p>
                      <p className="text-sm text-ink-light leading-snug m-0 mt-1 text-pretty">
                        {dept.leader.role}
                      </p>
                    </div>
                  </figcaption>
                )}
              </figure>
            </div>
          </div>
        </div>
      </section>

      {(dept.id === "chuyen-mon" || dept.id === "su-kien") && (
        <DepartmentSubUnits
          departmentId={dept.id}
          departmentName={dept.name}
        />
      )}

      {dept.stats && dept.stats.length > 0 && (
        <section className="py-10 sm:py-12 border-b border-border">
          <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-8">
            <dl className="m-0 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10">
              {dept.stats.map((st) => (
                <div key={st.label}>
                  <dt className="text-[11px] font-semibold tracking-[0.2em] uppercase text-ink-muted mb-2">
                    {st.label}
                  </dt>
                  <dd className="m-0">
                    <p className="font-display text-2xl sm:text-3xl font-extrabold text-ink tracking-tight mb-1">
                      {st.value}
                    </p>
                    {st.desc && (
                      <p className="text-sm text-ink-light leading-relaxed m-0">
                        {st.desc}
                      </p>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {((dept.gallery && dept.gallery.length > 0) ||
        (dept.bentoItems && dept.bentoItems.length > 0)) && (
        <section className="py-14 sm:py-20">
          <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-8">
            <DepartmentGallery
              slides={dept.gallery || []}
              departmentName={dept.name}
              subUnitLabels={
                dept.id === "chuyen-mon"
                  ? CHUYEN_MON_GALLERY_SUBUNIT_LABELS
                  : undefined
              }
            />
            <DepartmentBentoGrid items={dept.bentoItems || []} />
          </div>
        </section>
      )}

      {dept.keyActivities && dept.keyActivities.length > 0 && (
        <section className="py-12 sm:py-16 border-t border-border">
          <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-8">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-ink tracking-tight mb-8">
              Nhiệm vụ trọng tâm
            </h2>
            <ol className="m-0 p-0 list-none space-y-6 max-w-3xl">
              {dept.keyActivities.map((act, i) => (
                <li
                  key={act.title}
                  className="flex gap-4 border-l-2 border-accent/40 pl-4"
                >
                  <span className="text-accent font-semibold shrink-0 tabular-nums text-sm pt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-ink mb-1 m-0">
                      {act.title}
                    </h3>
                    <p className="text-sm sm:text-base text-ink-light leading-relaxed m-0">
                      {act.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {dept.memberHighlights && dept.memberHighlights.length > 0 && (
        <section className="py-12 sm:py-16 border-t border-border">
          <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-8">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-ink tracking-tight mb-8">
              Thành viên tiêu biểu
            </h2>
            <ul className="m-0 p-0 list-none max-w-3xl space-y-6">
              {dept.memberHighlights.map((member) => (
                <li key={member.name} className="border-t border-border pt-5">
                  <h3 className="font-bold text-base sm:text-lg text-ink mb-1.5 m-0">
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
        <section className="py-12 sm:py-16 border-t border-border">
          <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-8">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-ink tracking-tight mb-3">
              {dept.id === "chuyen-mon" || dept.id === "su-kien"
                ? "Kỹ năng chung tại ban"
                : `Kỹ năng rèn luyện tại ${dept.name}`}
            </h2>
            <p className="text-sm text-ink-light leading-relaxed max-w-2xl mb-6">
              Thành viên làm việc trên các chương trình thật của CLB — hồ sơ và
              kỹ năng đi cùng nhau.
            </p>
            <p className="text-base text-ink leading-relaxed max-w-2xl m-0">
              {dept.skillsLearned.join(" · ")}
            </p>
          </div>
        </section>
      )}

      {recruitment.visible && (
      <section className="py-14 sm:py-16 border-t border-border">
        <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-8">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-ink tracking-tight mb-3">
            Tham gia {dept.name}
          </h2>
          <p className="text-sm sm:text-base text-ink-light leading-relaxed max-w-xl mb-6">
            Đợt tuyển thành viên {recruitment.generation} đang mở đơn. Nộp hồ sơ
            để cùng CLB kiến tạo kỹ năng số tại ĐHBK Hà Nội.
          </p>
          {dept.id === "chuyen-mon" && (
            <p className="text-sm text-ink leading-relaxed max-w-xl mb-6 m-0">
              Chọn hướng phù hợp:{" "}
              <span className="font-semibold">KNM</span> nếu bạn muốn dạy và hỗ
              trợ Office/MOS —{" "}
              <span className="font-semibold">Kĩ thuật</span> nếu bạn muốn build
              công cụ thật. Ghi rõ trong form nếu có mục &ldquo;Ban / mảng mong
              muốn&rdquo;.
            </p>
          )}
          {dept.id === "su-kien" && (
            <p className="text-sm text-ink leading-relaxed max-w-xl mb-6 m-0">
              Chọn hướng phù hợp:{" "}
              <span className="font-semibold">Kỹ thuật sự kiện</span> nếu bạn
              thích hậu trường âm thanh, hình ảnh, livestream —{" "}
              <span className="font-semibold">Điều phối &amp; Vận hành</span> nếu
              bạn muốn điều phối hiện trường, lễ tân và hậu cần. Ghi rõ trong form
              nếu có mục &ldquo;Ban / mảng mong muốn&rdquo;.
            </p>
          )}
          <a
            href={recruitment.formUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-[15px] font-semibold text-accent-fg bg-accent hover:bg-accent-hover active:scale-[0.96] transition-[background-color,scale] duration-150 focus-visible:outline-2 focus-visible:outline-accent shadow-card"
          >
            <span>{recruitment.callToAction || "Nộp đơn ứng tuyển"}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </section>
      )}

      <section className="py-12 border-t border-border">
        <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-8">
          <div className="flex items-end justify-between gap-4 mb-6">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-ink tracking-tight m-0">
              Các ban khác
            </h2>
            <Link
              href="/departments"
              className="text-sm font-semibold text-accent hover:text-accent-hover inline-flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-accent rounded-sm shrink-0"
            >
              Toàn bộ cơ cấu
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
          <ul className="m-0 p-0 list-none flex flex-wrap gap-x-6 gap-y-3">
            {otherDepts.map((od) => (
              <li key={od.id}>
                <Link
                  href={`/departments/${od.id}`}
                  className="text-sm font-semibold text-ink-light hover:text-ink transition-colors focus-visible:outline-2 focus-visible:outline-accent rounded-sm"
                >
                  {od.index} · {od.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </div>
  );
}

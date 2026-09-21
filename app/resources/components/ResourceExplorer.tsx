"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { DOCUMENT_CATEGORIES } from "@/app/data/clubData";
import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  DownloadCloud,
  FolderOpen,
  LayoutGrid,
  List,
  MessageSquare,
  Search,
  X,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  DownloadCloud: <DownloadCloud className="w-7 h-7" aria-hidden="true" />,
  MessageSquare: <MessageSquare className="w-7 h-7" aria-hidden="true" />,
  CalendarDays: <CalendarDays className="w-7 h-7" aria-hidden="true" />,
  BookOpen: <BookOpen className="w-7 h-7" aria-hidden="true" />,
};

const TAGS = [
  "Tất cả",
  ...Array.from(new Set(DOCUMENT_CATEGORIES.map((c) => c.tag))),
] as const;

type ViewMode = "grid" | "list";
type SortMode = "name-asc" | "name-desc" | "tag";

export default function ResourceExplorer() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string>("Tất cả");
  const [sort, setSort] = useState<SortMode>("name-asc");
  const [view, setView] = useState<ViewMode>("grid");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let items = DOCUMENT_CATEGORIES.filter((cat) => {
      const matchesTag = tag === "Tất cả" || cat.tag === tag;
      const matchesQuery =
        !q ||
        cat.title.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q) ||
        cat.tag.toLowerCase().includes(q) ||
        cat.format.toLowerCase().includes(q) ||
        cat.topics.some((t) => t.toLowerCase().includes(q));
      return matchesTag && matchesQuery;
    });

    items = [...items].sort((a, b) => {
      if (sort === "tag") {
        const tagCmp = a.tag.localeCompare(b.tag, "vi");
        return tagCmp !== 0 ? tagCmp : a.title.localeCompare(b.title, "vi");
      }
      const cmp = a.title.localeCompare(b.title, "vi");
      return sort === "name-desc" ? -cmp : cmp;
    });

    return items;
  }, [query, tag, sort]);

  const tagSummary = useMemo(
    () => Array.from(new Set(DOCUMENT_CATEGORIES.map((c) => c.tag))).join(" · "),
    [],
  );

  return (
    <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-8 py-10 sm:py-16">
      <header className="mb-8 sm:mb-10 max-w-2xl">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-ink tracking-tight mb-3">
          Thư viện tài liệu
        </h1>
        <p className="text-sm sm:text-base text-ink-light leading-relaxed text-pretty">
          Hướng dẫn Office 365, Teams, biểu mẫu học tập và tài liệu MOS do Ban
          Chuyên môn CLB o365 – HUST biên soạn - dành riêng cho sinh viên ĐHBK
          Hà Nội.
        </p>
      </header>

      <div className="rounded-xl border border-border bg-surface shadow-card overflow-hidden">
        {/* Explorer path bar */}
        <div className="flex items-center gap-2 px-4 sm:px-5 py-2.5 border-b border-border bg-card/60 text-xs sm:text-sm text-ink-light">
          <FolderOpen className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
          <span className="text-ink-muted">o365 HUST</span>
          <ChevronRight className="w-3.5 h-3.5 text-ink-muted shrink-0" aria-hidden="true" />
          <span className="font-semibold text-ink truncate">Thư viện tài liệu</span>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 px-4 sm:px-5 py-3 border-b border-border">
          <div className="relative flex-1 min-w-0 max-w-md">
            <Search
              className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm tài liệu, chủ đề, từ khóa…"
              aria-label="Tìm kiếm tài liệu"
              className="w-full pl-9 pr-9 py-2 rounded-lg border border-border bg-[var(--bg)] text-ink text-sm placeholder:text-ink-muted/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:border-accent"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Xóa tìm kiếm"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-ink-muted hover:text-ink active:scale-[0.96] transition-[color,scale] duration-150 focus-visible:outline-2 focus-visible:outline-accent"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label htmlFor="resource-sort" className="sr-only">
              Sắp xếp tài liệu
            </label>
            <select
              id="resource-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortMode)}
              className="h-9 px-3 rounded-lg border border-border bg-[var(--bg)] text-ink text-xs sm:text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 cursor-pointer"
            >
              <option value="name-asc">Tên A → Z</option>
              <option value="name-desc">Tên Z → A</option>
              <option value="tag">Theo chủ đề</option>
            </select>

            <div
              className="flex items-center rounded-lg border border-border bg-[var(--bg)] p-0.5"
              role="group"
              aria-label="Chế độ hiển thị"
            >
              <button
                type="button"
                onClick={() => setView("grid")}
                aria-pressed={view === "grid"}
                aria-label="Xem dạng lưới"
                className={`p-1.5 rounded-md transition-[background-color,color] duration-150 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-accent ${
                  view === "grid"
                    ? "bg-ink text-surface"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                <LayoutGrid className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                aria-pressed={view === "list"}
                aria-label="Xem dạng danh sách"
                className={`p-1.5 rounded-md transition-[background-color,color] duration-150 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-accent ${
                  view === "list"
                    ? "bg-ink text-surface"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                <List className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Tag filters */}
        <div
          className="flex items-center gap-1.5 overflow-x-auto scrollbar-none px-4 sm:px-5 py-2.5 border-b border-border"
          role="toolbar"
          aria-label="Lọc theo chủ đề"
        >
          {TAGS.map((t) => {
            const active = tag === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTag(t)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold whitespace-nowrap shrink-0 transition-[background-color,color] duration-150 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-accent ${
                  active
                    ? "bg-ink text-surface"
                    : "bg-card border border-border text-ink-light hover:text-ink"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 min-h-[280px]">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FolderOpen className="w-10 h-10 text-ink-muted mb-3" aria-hidden="true" />
              <p className="font-semibold text-ink mb-1">Không tìm thấy tài liệu</p>
              <p className="text-sm text-ink-light max-w-sm">
                Thử từ khóa khác hoặc chọn &quot;Tất cả&quot; để xem toàn bộ thư
                viện.
              </p>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filtered.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/resources/${cat.id}`}
                  className="group flex flex-col rounded-lg border border-border bg-card hover:border-accent/40 hover:shadow-card transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-accent overflow-hidden"
                >
                  <div className="h-1 bg-accent/70 group-hover:bg-accent transition-colors" />
                  <div className="p-3 sm:p-4 flex flex-col flex-1">
                    <div className="w-11 h-11 rounded-lg bg-surface border border-border text-accent flex items-center justify-center mb-3 group-hover:border-accent/30 transition-colors">
                      {iconMap[cat.icon]}
                    </div>
                    <h2 className="text-sm sm:text-base font-bold text-ink leading-snug mb-1 line-clamp-2 group-hover:text-accent transition-colors">
                      {cat.title}
                    </h2>
                    <p className="text-[11px] sm:text-xs text-ink-light leading-relaxed line-clamp-2 mb-3 flex-1">
                      {cat.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-auto">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-accent bg-accent/10 px-1.5 py-0.5 rounded">
                        {cat.tag}
                      </span>
                      <span className="text-[10px] text-ink-muted px-1.5 py-0.5">
                        {cat.format}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-[11px] font-semibold tracking-[0.12em] uppercase text-ink-muted">
                    <th className="pb-2 pr-4 font-semibold">Tên</th>
                    <th className="pb-2 pr-4 font-semibold hidden sm:table-cell">
                      Loại
                    </th>
                    <th className="pb-2 pr-4 font-semibold">Chủ đề</th>
                    <th className="pb-2 font-semibold hidden md:table-cell">
                      Cập nhật
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((cat) => (
                    <tr
                      key={cat.id}
                      className="border-b border-border/60 last:border-0 hover:bg-card/80 transition-colors"
                    >
                      <td className="py-3 pr-4">
                        <Link
                          href={`/resources/${cat.id}`}
                          className="flex items-start gap-3 group focus-visible:outline-2 focus-visible:outline-accent rounded-sm"
                        >
                          <span className="w-9 h-9 rounded-lg bg-surface border border-border text-accent flex items-center justify-center shrink-0">
                            {iconMap[cat.icon]}
                          </span>
                          <span>
                            <span className="font-semibold text-ink group-hover:text-accent transition-colors block">
                              {cat.title}
                            </span>
                            <span className="text-xs text-ink-light line-clamp-1 sm:hidden">
                              {cat.format} · {cat.tag}
                            </span>
                          </span>
                        </Link>
                      </td>
                      <td className="py-3 pr-4 text-ink-light hidden sm:table-cell">
                        {cat.format}
                      </td>
                      <td className="py-3 pr-4">
                        <span className="text-xs font-medium text-accent">
                          {cat.tag}
                        </span>
                        <p className="text-xs text-ink-muted mt-0.5 line-clamp-1 hidden lg:block">
                          {cat.topics.join(" · ")}
                        </p>
                      </td>
                      <td className="py-3 text-ink-muted hidden md:table-cell tabular-nums">
                        {cat.updated}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Status bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 sm:px-5 py-2.5 border-t border-border bg-card/40 text-[11px] sm:text-xs text-ink-muted">
          <p className="m-0">
            Hiển thị{" "}
            <span className="font-semibold text-ink tabular-nums">
              {filtered.length}
            </span>
            {" / "}
            <span className="tabular-nums">{DOCUMENT_CATEGORIES.length}</span> mục
          </p>
        </div>
      </div>
    </div>
  );
}

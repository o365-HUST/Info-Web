"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { RECRUITMENT_INFO } from "@/app/data/clubData";
import { Menu, X, ArrowUpRight, Lock, ArrowLeft } from "lucide-react";

export default function BlogNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border transition-all duration-200"
      style={{ height: "var(--nav-height)" }}
    >
      <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-6 h-full flex items-center justify-between">
        {/* Left: Brand Wordmark */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-surface border border-border p-1 flex items-center justify-center group-hover:border-accent transition-colors">
            <Image
              src="/logo-mark.svg"
              alt="Logo CLB o365"
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-ink text-sm leading-tight tracking-tight">
              o365 <span className="text-ink-muted">-</span> HUST
            </span>
            <span className="text-[10px] font-medium text-ink-muted tracking-wide">
              Đại sứ Chuyển đổi số
            </span>
          </div>
        </Link>

        {/* Center: Navigation */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Điều hướng">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-ink-light hover:text-ink hover:bg-card transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Trang chủ</span>
          </Link>
          <Link
            href="/blog"
            className="px-3 py-1.5 rounded-lg text-sm font-semibold text-ink bg-card transition-colors"
          >
            Bản tin &amp; Bài viết
          </Link>
          <Link
            href="/blog?category=Devlog"
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-ink-light hover:text-ink hover:bg-card transition-colors"
          >
            Devlog Kỹ thuật
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="p-2 rounded-lg border border-border bg-surface hover:bg-card text-ink-light hover:text-ink transition-colors shadow-2xs"
            title="Quản trị CMS"
          >
            <Lock className="w-4 h-4" />
          </Link>

          <a
            href={RECRUITMENT_INFO.formUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-ink bg-accent hover:bg-accent/80 transition-colors"
          >
            <span>{RECRUITMENT_INFO.callToAction}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-ink-light hover:text-ink hover:bg-card transition-colors"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-surface border-b border-border px-5 py-4 shadow-md animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-1">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 rounded-lg text-base font-medium text-ink-light hover:text-ink hover:bg-card transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại Trang chủ</span>
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 rounded-lg text-base font-semibold text-ink bg-card"
            >
              Tất cả bài viết
            </Link>
            <Link
              href="/blog?category=Devlog"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 rounded-lg text-base font-medium text-ink-light hover:text-ink hover:bg-card"
            >
              Devlog Kỹ thuật
            </Link>
            <a
              href={RECRUITMENT_INFO.formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold text-ink bg-accent"
            >
              {RECRUITMENT_INFO.callToAction}
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

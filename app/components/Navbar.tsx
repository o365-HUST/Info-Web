"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { NAV_LINKS, RECRUITMENT_INFO } from "@/app/data/clubData";
import { Menu, X, ArrowUpRight, Lock } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setMobileOpen(false);
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    },
    []
  );

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-surface/90 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
      style={{ height: "var(--nav-height)" }}
    >
      <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-6 h-full flex items-center justify-between">
        {/* Wordmark */}
        <a
          href="#top"
          onClick={(e) => handleClick(e, "#top")}
          className="flex items-center gap-2.5 group"
        >
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
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Điều hướng chính">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-ink-light hover:text-ink hover:bg-card transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: CTA + CMS + mobile toggle */}
        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="p-2 rounded-lg border border-border bg-surface hover:bg-card text-ink-light hover:text-ink transition-colors shadow-2xs"
            title="Quản trị CMS (Firestore)"
          >
            <Lock className="w-4 h-4" />
          </Link>

          <a
            href={RECRUITMENT_INFO.formUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-ink bg-accent hover:bg-accent/80 transition-colors"
          >
            <span className="hidden sm:inline">{RECRUITMENT_INFO.callToAction}</span>
            <span className="sm:hidden">Đăng ký</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-ink-light hover:text-ink hover:bg-card transition-colors"
            aria-expanded={mobileOpen}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-surface border-b border-border px-5 py-4 shadow-md">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className="px-3 py-2.5 rounded-lg text-base font-medium text-ink-light hover:text-ink hover:bg-card transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href={RECRUITMENT_INFO.formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold text-ink bg-accent"
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

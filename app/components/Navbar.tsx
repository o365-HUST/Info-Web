"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { NAV_LINKS, RECRUITMENT_INFO } from "@/app/data/clubData";
import { Menu, X, ArrowRight, Lock, Search } from "lucide-react";
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
          ? "bg-[var(--bg)]/90 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b border-border"
          : "bg-transparent border-b border-transparent"
      }`}
      style={{ height: "var(--nav-height)" }}
    >
      <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-8 h-full flex items-center justify-between">
        {/* Wordmark Logo */}
        <a
          href="#top"
          onClick={(e) => handleClick(e, "#top")}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-full border border-accent flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.8)] transition-all overflow-hidden bg-slate-100 p-1.5">
             <Image
               src="/logo-mark.svg"
               alt="Logo"
               width={28}
               height={28}
               className="object-contain"
             />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-ink text-base leading-tight tracking-tight">
              o365 - HUST
            </span>
            <span className="text-[11px] font-medium text-ink/80 tracking-wide">
              Đại sứ Chuyển đổi số
            </span>
          </div>
        </a>

        {/* Desktop nav centered */}
        <nav className="hidden lg:flex items-center justify-center gap-7 flex-1" aria-label="Điều hướng chính">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className="text-sm font-medium text-ink-light hover:text-ink transition-colors hover:glow-text"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: Search, Admin Lock + CTA + Mobile Toggle */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-4 mr-2">
            <Link
              href="/admin"
              className="text-ink-muted hover:text-ink transition-colors"
              title="Quản trị CMS"
            >
              <Lock className="w-4 h-4" />
            </Link>
            <button className="text-ink-muted hover:text-ink transition-colors cursor-pointer">
              <Search className="w-4 h-4" />
            </button>
          </div>

          <a
            href={RECRUITMENT_INFO.formUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-row-reverse items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white bg-accent shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.8)] transition-all bg-gradient-to-r from-blue-600 to-blue-400"
          >
            <ArrowRight className="w-4 h-4" />
            <span className="hidden sm:inline">Tham gia CLB</span>
            <span className="sm:hidden">Join</span>
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-ink hover:text-accent transition-colors"
            aria-expanded={mobileOpen}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-[var(--bg)] border-b border-border px-5 py-4 shadow-xl">
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className="px-4 py-3 rounded-lg text-base font-semibold text-ink-light hover:text-ink hover:bg-surface transition-colors"
              >
                {link.label}
              </a>
            ))}
             <div className="flex gap-4 px-4 py-2 text-ink-muted">
                <Search className="w-5 h-5" />
                <Link href="/admin"><Lock className="w-5 h-5" /></Link>
             </div>
          </nav>
        </div>
      )}
    </header>
  );
}

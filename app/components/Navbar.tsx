"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  NAV_LINKS,
  RECRUITMENT_INFO,
  DOCUMENT_CATEGORIES,
} from "@/app/data/clubData";
import { Menu, X, ArrowRight, ChevronDown } from "lucide-react";
import ThemeToggle from "@/app/components/ThemeToggle";

function resolveNavHref(href: string, isHome: boolean) {
  if (href.startsWith("#")) {
    return isHome ? href : `/${href}`;
  }
  return href;
}

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoverDoc, setHoverDoc] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setHoverDoc(false);
  }, [pathname]);

  const handleHashClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      setHoverDoc(false);
      if (!href.startsWith("#") || !isHome) return;
      e.preventDefault();
      setMobileOpen(false);
      if (href === "#top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    },
    [isHome],
  );

  const solid = !isHome || isScrolled;

  return (
    <header
      id="main-navbar"
      className={`h-[var(--nav-height)] transition-[background-color,border-color,box-shadow] duration-300 ${
        solid
          ? "bg-[var(--bg)]/90 backdrop-blur-md shadow-md border-b border-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-8 h-full flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 group focus-visible:outline-2 focus-visible:outline-accent rounded-lg"
          aria-label="CLB o365 HUST - Trang chủ"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-accent/40 flex items-center justify-center transition-all overflow-hidden bg-surface/90 group-hover:border-accent p-1.5 shadow-sm">
            <Image
              src="/logo-transparent.png"
              alt="Logo CLB o365"
              width={26}
              height={26}
              className="object-contain logo-transparent"
            />
          </div>
        </Link>

        <nav
          className="hidden lg:flex items-center justify-center gap-6 flex-1"
          aria-label="Điều hướng chính"
        >
          {NAV_LINKS.map((link) => {
            if (link.href === "/resources") {
              return (
                <div
                  key={link.href}
                  className="relative py-4"
                  onMouseEnter={() => setHoverDoc(true)}
                  onMouseLeave={() => setHoverDoc(false)}
                >
                  <Link
                    href="/resources"
                    className={`flex items-center gap-1 text-sm font-medium transition-colors rounded-md py-1 px-1.5 focus-visible:outline-2 focus-visible:outline-accent ${
                      pathname.startsWith("/resources")
                        ? "text-ink"
                        : "text-ink-light hover:text-ink"
                    }`}
                  >
                    {link.label}
                    <ChevronDown
                      className={`w-3.5 h-3.5 opacity-70 transition-transform ${
                        hoverDoc ? "rotate-180" : ""
                      }`}
                    />
                  </Link>

                  {hoverDoc && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-[320px] bg-surface rounded-xl shadow-lg border border-border p-2 z-50">
                      <div className="flex flex-col">
                        {DOCUMENT_CATEGORIES.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/resources/${cat.id}`}
                            className="p-3 hover:bg-card rounded-lg transition-colors flex flex-col gap-0.5"
                            onClick={() => setHoverDoc(false)}
                          >
                            <span className="text-sm font-semibold text-ink">
                              {cat.title}
                            </span>
                          </Link>
                        ))}
                        <div className="h-px bg-border my-1 mx-2" />
                        <Link
                          href="/resources"
                          className="p-3 hover:bg-card rounded-lg transition-colors flex items-center justify-center gap-1 text-sm font-semibold text-accent"
                          onClick={() => setHoverDoc(false)}
                        >
                          Xem tất cả thư viện{" "}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            const href = resolveNavHref(link.href, isHome);
            const active =
              !link.href.startsWith("#") && pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={href}
                onClick={(e) => handleHashClick(e, link.href)}
                className={`text-sm font-medium transition-colors rounded-md py-1 px-1.5 focus-visible:outline-2 focus-visible:outline-accent ${
                  active ? "text-ink" : "text-ink-light hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:flex items-center gap-1 mr-1">
            <ThemeToggle />
          </div>

          <a
            href={RECRUITMENT_INFO.formUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 rounded-lg text-sm font-semibold text-accent-fg bg-accent hover:bg-accent-hover transition-all shadow-card hover:shadow-md active:scale-[0.96] cursor-pointer focus-visible:outline-2 focus-visible:outline-accent"
            aria-label="Tham gia Câu lạc bộ o365 (mở trong tab mới)"
          >
            <span className="hidden sm:inline">Tham gia CLB</span>
            <span className="sm:hidden">Tham gia</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <div className="lg:hidden">
            <ThemeToggle />
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-ink hover:text-accent transition-colors focus-visible:outline-2 focus-visible:outline-accent cursor-pointer"
            aria-expanded={mobileOpen}
            aria-label={
              mobileOpen ? "Đóng menu điều hướng" : "Mở menu điều hướng"
            }
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-[var(--bg)]/95 backdrop-blur-md border-b border-border px-5 py-4 shadow-xl">
          <nav
            className="flex flex-col gap-1.5"
            aria-label="Điều hướng trên di động"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={resolveNavHref(link.href, isHome)}
                onClick={(e) => handleHashClick(e, link.href)}
                className="px-4 py-2.5 rounded-lg text-sm font-semibold text-ink-light hover:text-ink hover:bg-surface transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/blog"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-2.5 rounded-lg text-sm font-semibold text-ink-light hover:text-ink hover:bg-surface transition-colors"
            >
              Blog
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

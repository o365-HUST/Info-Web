import { CLUB_INFO, PRIMARY_ADDRESS } from "@/app/data/clubData";
import Image from "next/image";
import Link from "next/link";

const socialBtnClass =
  "w-8 h-8 rounded-lg bg-surface text-ink-muted hover:text-accent border border-border hover:border-accent/40 flex items-center justify-center transition-colors active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-accent";

export default function Footer() {
  const leaderPhone = CLUB_INFO.leader.phone.replace(/\s/g, "");

  return (
    <footer className="border-t border-border bg-[var(--bg)]">
      <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-8 py-5 sm:py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 rounded-lg focus-visible:outline-2 focus-visible:outline-accent"
            aria-label="CLB o365 HUST — Trang chủ"
          >
            <div className="w-8 h-8 rounded-full border border-accent/40 flex items-center justify-center overflow-hidden bg-surface p-1 shadow-sm">
              <Image
                src="/logo-transparent.png"
                alt=""
                width={22}
                height={22}
                className="object-contain logo-transparent"
              />
            </div>
            <span className="font-bold text-ink text-sm tracking-tight">
              o365 · HUST
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <a
              href={CLUB_INFO.fanpageUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook Fanpage CLB o365 - HUST"
              className={socialBtnClass}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href={CLUB_INFO.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok CLB o365 - HUST"
              className={socialBtnClass}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.43a8.16 8.16 0 0 0 4.76 1.52V7.51a4.85 4.85 0 0 1-1-.82z" />
              </svg>
            </a>
            <a
              href={CLUB_INFO.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Kênh YouTube CLB o365 - HUST"
              className={socialBtnClass}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            <a
              href={`mailto:${CLUB_INFO.email}`}
              aria-label="Email liên hệ CLB o365 HUST"
              className={socialBtnClass}
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </a>
          </div>
        </div>

        <p className="mt-4 pt-3 border-t border-border/70 m-0 text-[11px] text-ink-muted flex flex-wrap items-center gap-x-2 gap-y-1">
          <span>© {new Date().getFullYear()} CLB o365 - HUST</span>
          <span className="text-border hidden sm:inline" aria-hidden>
            ·
          </span>
          <span className="truncate">{PRIMARY_ADDRESS}</span>
          <span className="text-border hidden sm:inline" aria-hidden>
            ·
          </span>
          <a
            href={`mailto:${CLUB_INFO.email}`}
            className="hover:text-accent transition-colors truncate focus-visible:outline-2 focus-visible:outline-accent rounded-sm"
          >
            {CLUB_INFO.email}
          </a>
          <span className="text-border hidden sm:inline" aria-hidden>
            ·
          </span>
          <span>
            {CLUB_INFO.leader.role} — {CLUB_INFO.leader.name}
            {" · "}
            <a
              href={`tel:${leaderPhone}`}
              className="hover:text-accent transition-colors focus-visible:outline-2 focus-visible:outline-accent rounded-sm"
            >
              {CLUB_INFO.leader.phone}
            </a>
          </span>
        </p>
      </div>
    </footer>
  );
}

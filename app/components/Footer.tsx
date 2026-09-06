import { CLUB_INFO, NAV_LINKS } from "@/app/data/clubData";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer
      className="pt-12 pb-8 border-t"
      style={{
        backgroundColor: "var(--ink)",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10">
          {/* Wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 p-1 flex items-center justify-center">
              <Image
                src="/logo-mark.svg"
                alt="Logo CLB o365"
                width={28}
                height={28}
                className="object-contain brightness-0 invert"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white text-sm leading-tight tracking-tight">
                o365 - HUST
              </span>
              <span className="text-[10px] font-medium text-white/50 tracking-wide">
                Đại sứ Chuyển đổi số
              </span>
            </div>
          </div>

          {/* Inline nav links */}
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs font-medium text-white/60 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Newsletter CTA */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="Email nhận tin mới"
              className="flex-1 md:w-48 px-3.5 py-2.5 rounded-lg text-sm bg-white/10 text-white placeholder:text-white/40 border border-white/10 focus:outline-none focus:border-white/30 transition-colors"
            />
            <button
              type="button"
              className="px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--ink)",
              }}
            >
              Nhận tin
            </button>
          </div>
        </div>

        {/* Social links */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          {[
            { label: "Facebook", url: CLUB_INFO.fanpageUrl },
            { label: "TikTok", url: CLUB_INFO.tiktokUrl },
            { label: "YouTube", url: CLUB_INFO.youtubeUrl },
            { label: "Messenger", url: CLUB_INFO.messengerUrl },
          ].map((social) => (
            <a
              key={social.label}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-white/50 hover:text-white transition-colors"
            >
              {social.label}
              <ArrowUpRight className="w-3 h-3" />
            </a>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]"
          style={{
            borderColor: "rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.35)",
          }}
        >
          <p>
            © {new Date().getFullYear()} CLB o365 - HUST. Đại học Bách khoa Hà
            Nội.
          </p>
          <p>
            Trực thuộc Ban Công tác Sinh viên — ĐHBK Hà Nội
          </p>
        </div>
      </div>
    </footer>
  );
}

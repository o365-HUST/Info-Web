import { CLUB_INFO, NAV_LINKS } from "@/app/data/clubData";
import { Heart } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="pt-16 pb-8 border-t border-border bg-[var(--bg)]">
      <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          
          {/* Left: Wordmark Logo */}
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full border border-accent/50 flex items-center justify-center overflow-hidden bg-[var(--surface)] p-1.5">
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
          </div>

          {/* Middle: Inline nav links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-ink-light hover:text-ink transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right: Social links */}
          <div className="flex items-center gap-4">
             <a href={CLUB_INFO.fanpageUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-surface text-ink hover:text-accent border border-border hover:border-accent/40 text-[11px] font-bold flex items-center justify-center transition-colors">
                fb
             </a>
             <a href={CLUB_INFO.youtubeUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-surface text-ink hover:text-accent border border-border hover:border-accent/40 text-[11px] font-bold flex items-center justify-center transition-colors">
                yt
             </a>
             <a href="#" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-surface text-ink hover:text-accent border border-border hover:border-accent/40 text-[11px] font-bold flex items-center justify-center transition-colors">
                in
             </a>
             <a href="mailto:clbo365@husteduvn.onmicrosoft.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-surface text-ink font-bold hover:text-accent border border-border hover:border-accent/40 text-[11px] flex items-center justify-center transition-colors">
               @
             </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-ink-muted/60">
          <p>
            © {new Date().getFullYear()} CLB o365 - HUST, Sinh viên Bách Khoa, Sáng tạo cùng công nghệ.
          </p>
          <div className="flex items-center gap-1">
            <span className="tracking-wide">A more productive, inclusive and empowered student community.</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}

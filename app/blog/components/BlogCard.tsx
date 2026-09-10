import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/app/types";

interface BlogCardProps {
  post: BlogPost;
  priority?: boolean;
  className?: string;
  /** Stretch to fill parent height (featured column). */
  fillHeight?: boolean;
}

export default function BlogCard({
  post,
  priority = false,
  className = "",
  fillHeight = false,
}: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.id}`}
      className={`group flex flex-col justify-between rounded-2xl bg-surface border border-border overflow-hidden shadow-card hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-accent ${
        fillHeight ? "h-full min-h-0" : ""
      } ${className}`}
    >
      <div className={`flex flex-col min-h-0 ${fillHeight ? "flex-1" : ""}`}>
        <div
          className={`relative overflow-hidden bg-card border-b border-border/80 ${
            fillHeight ? "flex-1 min-h-[5.5rem]" : "aspect-[16/10]"
          }`}
        >
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-surface/90 backdrop-blur-xs text-accent border border-accent/25 shadow-2xs">
            {post.tag}
          </span>
        </div>

        <div className={`p-4 sm:p-5 shrink-0 ${fillHeight ? "py-3.5" : "p-6"}`}>
          <div className="flex items-center gap-3 text-[11px] font-mono text-ink-muted mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" aria-hidden="true" />
              {post.date}
            </span>
            {post.author && <span>• {post.author}</span>}
          </div>

          <h2
            className={`font-bold text-ink leading-snug tracking-tight mb-1.5 group-hover:text-accent transition-colors line-clamp-2 ${
              fillHeight ? "text-sm sm:text-[15px]" : "text-base sm:text-lg mb-2"
            }`}
          >
            {post.title}
          </h2>

          <p
            className={`text-ink-light leading-relaxed ${
              fillHeight
                ? "text-xs line-clamp-2"
                : "text-xs sm:text-sm line-clamp-3 mb-4"
            }`}
          >
            {post.excerpt}
          </p>
        </div>
      </div>

      <div
        className={`border-t border-border/60 flex items-center justify-between text-xs font-semibold text-ink group-hover:text-accent transition-colors shrink-0 ${
          fillHeight ? "px-4 sm:px-5 py-2.5" : "px-6 pb-6 pt-2"
        }`}
      >
        <span>Đọc bài viết</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

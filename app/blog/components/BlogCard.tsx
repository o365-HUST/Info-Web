import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/app/types";

interface BlogCardProps {
  post: BlogPost;
  priority?: boolean;
}

export default function BlogCard({ post, priority = false }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.id}`}
      className="group flex flex-col justify-between rounded-3xl bg-surface border border-border overflow-hidden shadow-card hover:shadow-md transition-all duration-300 hover:-translate-y-1"
    >
      <div>
        {/* Thumbnail Image */}
        <div className="aspect-[16/10] relative overflow-hidden bg-card border-b border-border/80">
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-surface/90 backdrop-blur-xs text-ink border border-border shadow-2xs">
            {post.tag}
          </span>
        </div>

        {/* Post Details */}
        <div className="p-6">
          <div className="flex items-center gap-3 text-[11px] font-mono text-ink-muted mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {post.date}
            </span>
            {post.author && <span>• {post.author}</span>}
          </div>

          <h2 className="font-bold text-base sm:text-lg text-ink leading-snug tracking-tight mb-2 group-hover:text-ink-light transition-colors line-clamp-2">
            {post.title}
          </h2>

          <p className="text-xs sm:text-sm text-ink-light leading-relaxed line-clamp-3 mb-4">
            {post.excerpt}
          </p>
        </div>
      </div>

      {/* Footer Read More */}
      <div className="px-6 pb-6 pt-2 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-ink group-hover:text-accent transition-colors">
        <span>Đọc bài viết</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

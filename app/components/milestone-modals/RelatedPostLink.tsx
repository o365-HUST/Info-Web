import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/app/types";

interface RelatedPostLinkProps {
  postId: string;
  postsById: Record<string, BlogPost>;
  className?: string;
}

export default function RelatedPostLink({
  postId,
  postsById,
  className = "",
}: RelatedPostLinkProps) {
  const post = postsById[postId];

  if (!post) {
    return (
      <Link
        href={`/blog/${postId}`}
        className={`inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline ${className}`}
      >
        Xem bài viết liên quan
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.id}`}
      className={`group flex gap-3 overflow-hidden rounded-xl border border-border bg-card/60 p-3 transition-colors hover:border-accent/30 hover:bg-card ${className}`}
    >
      {post.thumbnail && (
        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-border/80 bg-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.thumbnail}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
          Bài viết liên quan
        </p>
        <p className="mt-0.5 font-display text-sm font-bold leading-snug text-ink text-pretty group-hover:text-accent">
          {post.title}
        </p>
        {post.excerpt && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-light">
            {post.excerpt}
          </p>
        )}
      </div>
      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-ink-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
    </Link>
  );
}

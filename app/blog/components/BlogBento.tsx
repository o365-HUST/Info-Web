import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/app/types";
import BlogCard from "./BlogCard";

interface BlogBentoProps {
  posts: BlogPost[];
}

export default function BlogBento({ posts }: BlogBentoProps) {
  const featured = posts.slice(0, 3);
  const [hero, ...underHero] = featured;
  const others = posts.slice(3);

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 lg:items-stretch">
        {/* Left: hero + next two cards */}
        <div className="lg:col-span-8 flex flex-col gap-5 lg:gap-6 min-h-0">
          <Link
            href={`/blog/${hero.id}`}
            className="group flex flex-col rounded-2xl border border-border bg-surface overflow-hidden hover:border-accent/40 transition-colors focus-visible:outline-2 focus-visible:outline-accent shrink-0"
          >
            <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-card overflow-hidden">
              <Image
                src={hero.thumbnail}
                alt={hero.title}
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/20 to-transparent" />
              <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-surface/90 text-accent border border-accent/25">
                {hero.tag}
              </span>
            </div>
            <div className="p-5 sm:p-6 flex flex-col flex-1">
              <h2 className="font-display text-xl sm:text-2xl lg:text-[1.65rem] font-extrabold text-ink tracking-tight leading-snug mb-2 group-hover:text-accent transition-colors">
                {hero.title}
              </h2>
              <p className="text-sm text-ink-light leading-relaxed line-clamp-2 mb-4">
                {hero.excerpt}
              </p>
              <div className="mt-auto flex items-center justify-between text-xs text-ink-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                  {hero.date}
                  {hero.author ? ` · ${hero.author}` : ""}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-accent">
                  Đọc bài
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </Link>

          {underHero.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
              {underHero.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* Right: 3 featured cards — stretch to match left column height */}
        <aside className="lg:col-span-4 flex flex-col h-full min-h-0">
          <div className="mb-3 shrink-0">
            <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-ink-muted m-0">
              Nổi bật
            </h3>
          </div>
          <div className="flex-1 flex flex-col gap-5 lg:gap-6 min-h-0">
            {featured.map((post, i) => (
              <BlogCard
                key={post.id}
                post={post}
                priority={i === 0}
                fillHeight
                className="flex-1 min-h-0"
              />
            ))}
          </div>
        </aside>
      </div>

      {others.length > 0 && (
        <div>
          <div className="flex items-baseline justify-between gap-4 mb-5 pb-3 border-b border-border">
            <h3 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-ink-muted m-0">
              Bài viết khác
            </h3>
            <span className="text-[11px] text-ink-muted tabular-nums">
              {others.length} bài
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {others.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

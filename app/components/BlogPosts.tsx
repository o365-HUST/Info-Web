"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { BLOG_POSTS } from "@/app/data/clubData";
import { subscribePosts } from "@/app/lib/firestoreService";
import type { BlogPost } from "@/app/types";
import { ArrowRight, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import Image from "next/image";

export default function BlogPosts() {
  const ref = useRef(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [posts, setPosts] = useState<BlogPost[]>(BLOG_POSTS);

  useEffect(() => {
    const unsub = subscribePosts((livePosts) => {
      const published = livePosts.filter((p) => p.published !== false);
      setPosts(published);
    });
    return () => unsub();
  }, []);

  const slideLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const slideRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  return (
    <section
      id="blog"
      ref={ref}
      className="py-20 lg:py-28 bg-[var(--bg)]"
    >
      <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-6">
        {/* Header Section Matches Design */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4"
        >
          <div className="flex items-center gap-3">
            {/* Blue glowing bar */}
            <div className="w-2.5 h-8 bg-accent rounded-sm shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight flex items-baseline gap-2">
              Bài viết
              <span className="text-xs sm:text-sm font-normal text-accent uppercase tracking-widest opacity-80 hidden sm:inline-block">
                BLOG POSTS
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[13px] text-ink-light hidden lg:inline-block">
              Cập nhật những hoạt động mới nhất từ CLB o365 - HUST
            </span>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full border border-border bg-card/40 hover:bg-card text-ink text-sm font-semibold transition-colors shrink-0"
            >
              Xem tất cả
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative group">
          {/* Scroll Buttons */}
          <button
            onClick={slideLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-10 h-10 rounded-full bg-surface/80 backdrop-blur border border-border flex items-center justify-center text-ink hover:text-accent shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hidden sm:flex pointer-events-auto"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={slideRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-10 h-10 rounded-full bg-surface/80 backdrop-blur border border-border flex items-center justify-center text-ink hover:text-accent shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hidden sm:flex pointer-events-auto"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Scrolling Area */}
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 px-1"
          >
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="shrink-0 w-[280px] sm:w-[320px] snap-start"
              >
                <Link
                  href={`/blog/${post.id}`}
                  className="group block rounded-2xl border border-border bg-surface overflow-hidden transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:border-accent/60 h-full flex flex-col"
                >
                  {/* Image matching the gallery style */}
                  <div className="aspect-[4/3] relative overflow-hidden bg-card">
                    <div className="relative w-full h-full overflow-hidden">
                      <Image
                        src={post.thumbnail}
                        alt={post.title}
                        fill
                        priority={i < 4}
                        loading={i < 4 ? "eager" : "lazy"}
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 280px, 320px"
                      />
                      {/* Gradient overlay for text readability if needed */}
                      <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    </div>
                  </div>

                  {/* Datetime badge mimicking the event card */}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="mb-3 flex flex-col gap-2">
                      <h3 className="text-[15px] font-bold text-ink leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5 w-fit group-hover:opacity-100 opacity-90 transition-opacity">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent ring-1 ring-accent/20">
                          <Calendar className="w-3 h-3" strokeWidth={2.5} />
                        </div>
                        <span className="text-[11px] font-bold text-ink-light uppercase tracking-wider">
                          {post.date.split("/")[0]} THG {post.date.split("/")[1]}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-3 border-t border-border/50 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-accent/10 border border-accent/20 text-[10px] font-semibold text-accent">
                          {post.tag}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-ink-muted group-hover:text-accent group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

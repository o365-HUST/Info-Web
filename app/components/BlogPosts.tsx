"use client";

import Link from "next/link";
import { useRef, useState, useEffect, useMemo } from "react";
import { motion, useInView } from "motion/react";
import { BLOG_POSTS } from "@/app/data/clubData";
import { subscribePosts } from "@/app/lib/firestoreService";
import { sortPostsNewestFirst } from "@/app/lib/blogUtils";
import type { BlogPost } from "@/app/types";
import { ArrowRight, Calendar } from "lucide-react";
import Image from "next/image";

export default function BlogPosts() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [posts, setPosts] = useState<BlogPost[]>(BLOG_POSTS);

  useEffect(() => {
    const unsub = subscribePosts((livePosts) => {
      const published = livePosts.filter((p) => p.published !== false);
      setPosts(published);
    });
    return () => unsub();
  }, []);

  const recentPosts = useMemo(
    () => sortPostsNewestFirst(posts).slice(0, 3),
    [posts]
  );

  return (
    <section id="blog" ref={ref} className="py-20 lg:py-28 bg-[var(--bg)]">
      <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4"
        >
          <div>
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] text-accent uppercase opacity-90 block mb-1">
              BLOG &amp; BẢN TIN
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Bài Viết &amp; Hoạt Động
            </h2>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg border border-border bg-card/60 hover:bg-card text-ink text-sm font-semibold transition-all shadow-xs hover:shadow-sm active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-accent shrink-0"
          >
            <span>Xem tất cả bài viết</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recentPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <Link
                href={`/blog/${post.id}`}
                className="group block rounded-2xl border border-border bg-surface overflow-hidden transition-all duration-200 hover:shadow-card hover:border-accent/40 active:scale-[0.98] h-full flex flex-col focus-visible:outline-2 focus-visible:outline-accent"
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-card">
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    priority={i === 0}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent opacity-70" />
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-[15px] font-bold text-ink leading-snug line-clamp-2 group-hover:text-accent transition-colors mb-3">
                    {post.title}
                  </h3>

                  <div className="mt-auto pt-3 border-t border-border/50 flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-accent/10 border border-accent/20 text-[10px] font-semibold text-accent">
                      {post.tag}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-ink-muted">
                      <Calendar className="w-3 h-3" aria-hidden="true" />
                      {post.date}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

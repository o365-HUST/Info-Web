"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { BLOG_POSTS } from "@/app/data/clubData";
import { subscribePosts } from "@/app/lib/firestoreService";
import type { BlogPost } from "@/app/types";
import { ArrowRight } from "lucide-react";
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

  return (
    <section
      id="blog"
      ref={ref}
      className="py-20 lg:py-28"
      style={{ background: "var(--surface)" }}
    >
      <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-3"
              style={{ color: "var(--ink-muted)" }}
            >
              Bài viết
            </p>
            <h2
              className="text-2xl sm:text-3xl font-bold tracking-tight"
              style={{ color: "var(--ink)" }}
            >
              Bài Viết Mới Nhất
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-ink"
            style={{ color: "var(--ink-light)" }}
          >
            Xem tất cả
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Post cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.1 }}
            >
              <Link
                href={`/blog/${post.id}`}
                className="group block rounded-2xl border overflow-hidden transition-all duration-200 hover:-translate-y-0.5 h-full"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                {/* Thumbnail */}
                <div
                  className="aspect-[3/2] relative overflow-hidden"
                  style={{ backgroundColor: "var(--card)" }}
                >
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    priority={i === 0}
                    loading={i === 0 ? "eager" : "lazy"}
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="px-2 py-0.5 rounded text-[11px] font-semibold"
                      style={{
                        backgroundColor: "var(--card)",
                        color: "var(--ink-light)",
                      }}
                    >
                      {post.tag}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: "var(--ink-muted)" }}
                    >
                      {post.date}
                    </span>
                  </div>
                  <h3
                    className="text-base font-semibold leading-snug mb-2 line-clamp-2"
                    style={{ color: "var(--ink)" }}
                  >
                    {post.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed line-clamp-2"
                    style={{ color: "var(--ink-light)" }}
                  >
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile "see all" link */}
        <div className="sm:hidden mt-6 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold hover:text-ink"
            style={{ color: "var(--ink-light)" }}
          >
            Xem tất cả
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

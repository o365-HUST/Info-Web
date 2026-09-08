"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BLOG_POSTS } from "@/app/data/clubData";
import { subscribePosts } from "@/app/lib/firestoreService";
import type { BlogPost } from "@/app/types";
import BlogNavbar from "./components/BlogNavbar";
import BlogCard from "./components/BlogCard";
import Footer from "@/app/components/Footer";
import {
  Search,
  ArrowRight,
  Sparkles,
  Code2,
  Calendar,
  User as UserIcon,
  X,
  FileText,
} from "lucide-react";

const CATEGORIES = [
  "Tất cả",
  "Devlog",
  "Cuộc thi",
  "Hành trình",
  "Workshop",
  "Kỹ năng số",
  "Thông báo",
];

function BlogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "Tất cả";

  const [posts, setPosts] = useState<BlogPost[]>(BLOG_POSTS);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Sync category with URL if param changes
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && CATEGORIES.includes(cat)) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Subscribe to live Firestore posts
  useEffect(() => {
    const unsub = subscribePosts((livePosts) => {
      const published = livePosts.filter((p) => p.published !== false);
      setPosts(published);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // Filter posts by category and search
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === "Tất cả" || post.tag === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        (post.author && post.author.toLowerCase().includes(query)) ||
        post.tag.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  const isDevlogActive = selectedCategory === "Devlog";

  return (
    <div className="min-h-screen bg-[var(--bg)] text-ink flex flex-col">
      <BlogNavbar />

      <main className="flex-1 max-w-[var(--max-width)] w-full mx-auto px-5 sm:px-6 py-10 sm:py-16">
        {/* Header Hero */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-card text-ink border border-border mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Bản Tin &amp; Chia Sẻ Tri Thức</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-ink mb-4">
            Khám Phá Góc Nhìn Từ o365
          </h1>
          <p className="text-sm sm:text-base text-ink-light leading-relaxed">
            Hành trình chuyển đổi số, chuyên môn Microsoft 365, phóng sự cuộc thi và
            nhật ký kỹ thuật từ cộng đồng sinh viên Đại học Bách khoa Hà Nội.
          </p>
        </div>

        {/* Dedicated Devlog Banner (Shown when Devlog is selected) */}
        {isDevlogActive && (
          <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-card relative overflow-hidden animate-in fade-in slide-in-from-top-3">
            <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-accent/10 pointer-events-none blur-2xl" />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center text-ink shrink-0">
                  <Code2 className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-extrabold text-lg sm:text-xl text-ink">
                      o365 Engineering &amp; Devlog
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-accent/30 text-ink">
                      Kỹ thuật số
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-ink-light">
                    Kênh chia sẻ chuyên sâu về kiến trúc phần mềm, Next.js, Firebase, Cloud và giải pháp công nghệ.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search & Category Filter Bar */}
        <div className="space-y-4 mb-10">
          {/* Search Input */}
          <div className="relative max-w-md mx-auto sm:mx-0">
            <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bài viết, tác giả, chuyên mục..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ink-muted hover:text-ink"
                title="Xóa tìm kiếm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? "bg-ink text-surface shadow-xs"
                      : "bg-surface border border-border text-ink-light hover:text-ink hover:bg-card shadow-2xs"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-surface border border-border p-8 shadow-card max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-card border border-border mx-auto flex items-center justify-center text-ink-muted mb-3">
              <FileText className="w-6 h-6 opacity-60" />
            </div>
            <h3 className="font-bold text-base text-ink mb-1">
              Không tìm thấy bài viết phù hợp
            </h3>
            <p className="text-xs text-ink-light mb-5">
              Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc để xem toàn bộ bài viết.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("Tất cả");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-xl bg-ink text-surface text-xs font-semibold hover:bg-ink/90 transition-colors shadow-xs cursor-pointer"
            >
              Xem tất cả bài viết
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, i) => (
              <BlogCard key={post.id} post={post} priority={i === 0} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function BlogArchivePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <BlogContent />
    </Suspense>
  );
}

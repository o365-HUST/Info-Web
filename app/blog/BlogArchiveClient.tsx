"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { subscribePosts } from "@/app/lib/firestoreService";
import {
  sortPostsForListing,
  splitBentoLayout,
  BLOG_ARCHIVE_FILTERS,
} from "@/app/lib/blogUtils";
import type { BlogPost } from "@/app/types";
import BlogCard from "./components/BlogCard";
import BlogBento from "./components/BlogBento";
import Footer from "@/app/components/Footer";
import {
  Search,
  Sparkles,
  Code2,
  X,
  FileText,
  ChevronDown,
} from "lucide-react";

interface BlogArchiveClientProps {
  initialPosts: BlogPost[];
}

function BlogArchiveInner({ initialPosts }: BlogArchiveClientProps) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "Tất cả";

  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && (BLOG_ARCHIVE_FILTERS as readonly string[]).includes(cat)) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  useEffect(() => {
    const unsub = subscribePosts((livePosts) => {
      const published = livePosts.filter((p) => p.published !== false);
      setPosts(published);
    });
    return () => unsub();
  }, []);

  const filteredPosts = useMemo(() => {
    const sorted = sortPostsForListing(posts);
    return sorted.filter((post) => {
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

  const bentoLayout = useMemo(
    () => splitBentoLayout(filteredPosts),
    [filteredPosts],
  );

  const isDevlogActive = selectedCategory === "Devlog";
  const useBento =
    selectedCategory === "Tất cả" &&
    !searchQuery.trim() &&
    filteredPosts.length >= 3 &&
    bentoLayout.hero !== null;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-ink flex flex-col">
      <main className="flex-1 max-w-[var(--max-width)] w-full mx-auto px-5 sm:px-6 py-10 sm:py-16">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-ink mb-4">
            Khám Phá Góc Nhìn Từ o365
          </h1>
          <p className="text-sm sm:text-base text-ink-light leading-relaxed">
            Dấu ấn của CLB o365 - HUST trong những hoạt động
          </p>
        </div>

        <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1 min-w-0 w-full">
            <Search
              className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm bài viết, tác giả, chuyên mục…"
              aria-label="Tìm kiếm bài viết"
              className="w-full pl-9 pr-9 py-2.5 sm:py-2 rounded-lg border border-border bg-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:border-accent"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-ink-muted hover:text-ink cursor-pointer focus-visible:outline-2 focus-visible:outline-accent"
                title="Xóa tìm kiếm"
                aria-label="Xóa tìm kiếm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="w-full sm:w-52 shrink-0">
            <label
              htmlFor="blog-category-filter"
              className="block text-[11px] font-semibold text-ink-muted uppercase tracking-wider mb-1.5 sm:sr-only"
            >
              Chuyên mục
            </label>
            <div className="relative">
              <select
                id="blog-category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Lọc theo chuyên mục"
                className="w-full px-3 py-2.5 sm:py-2 rounded-lg border border-border bg-surface text-ink text-sm font-semibold cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:border-accent appearance-none pr-9"
              >
                {BLOG_ARCHIVE_FILTERS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "Tất cả" ? "Tất cả chuyên mục" : cat}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="w-4 h-4 text-ink-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {isDevlogActive && (
          <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-surface border border-border relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-accent/10 pointer-events-none blur-2xl" />
            <div className="flex items-start sm:items-center gap-4 relative z-10">
              <div className="w-11 h-11 rounded-xl bg-card border border-border flex items-center justify-center shrink-0">
                <Code2 className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="font-extrabold text-base sm:text-lg text-ink m-0 mb-1">
                  o365 Engineering &amp; Devlog
                </h2>
                <p className="text-xs sm:text-sm text-ink-light m-0">
                  Kiến trúc phần mềm, Next.js, Firebase, Cloud và giải pháp công nghệ.
                </p>
              </div>
            </div>
          </div>
        )}

        {filteredPosts.length === 0 ? (
          <div className="py-16 text-center rounded-2xl bg-surface border border-border p-8 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-xl bg-card border border-border mx-auto flex items-center justify-center text-ink-muted mb-3">
              <FileText className="w-6 h-6 opacity-60" />
            </div>
            <h3 className="font-bold text-base text-ink mb-1">
              Không tìm thấy bài viết phù hợp
            </h3>
            <p className="text-xs text-ink-light mb-5">
              Thử từ khóa khác hoặc xóa bộ lọc để xem toàn bộ bài viết.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("Tất cả");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-lg bg-ink text-surface text-xs font-semibold hover:bg-ink/90 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-accent"
            >
              Xem tất cả bài viết
            </button>
          </div>
        ) : useBento && bentoLayout.hero ? (
          <BlogBento
            hero={bentoLayout.hero}
            underHero={bentoLayout.underHero}
            sidebarFeatured={bentoLayout.sidebarFeatured}
            others={bentoLayout.others}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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

export default function BlogArchiveClient(props: BlogArchiveClientProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <BlogArchiveInner {...props} />
    </Suspense>
  );
}

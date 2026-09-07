"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { getPostById, getRelatedPosts } from "@/app/lib/firestoreService";
import type { BlogPost } from "@/app/types";
import BlogNavbar from "../components/BlogNavbar";
import PostContentSkeleton from "../components/PostContentSkeleton";
import Footer from "@/app/components/Footer";
import {
  ArrowLeft,
  Calendar,
  User as UserIcon,
  Clock,
  Share2,
  Check,
  ArrowRight,
  FileQuestion,
  Sparkles,
} from "lucide-react";

import MarkdownRenderer from "@/app/components/MarkdownRenderer";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export default function SinglePostPage({ params }: PostPageProps) {
  // Unwrap params in Next.js 15/16
  const { id } = use(params);

  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadPostData() {
      setLoading(true);
      try {
        const found = await getPostById(id);
        if (isMounted) {
          setPost(found);
          if (found) {
            const related = await getRelatedPosts(found.id, found.tag, 3);
            if (isMounted) setRelatedPosts(related);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadPostData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Calculate estimated reading time
  const readTimeMinutes = post?.content
    ? Math.max(1, Math.ceil(post.content.trim().split(/\s+/).length / 180))
    : 2;

  // Handle Share / Copy Link
  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-ink flex flex-col">
      <BlogNavbar />

      <main className="flex-1">
        {loading ? (
          <PostContentSkeleton />
        ) : !post ? (
          /* 404 Post Not Found State */
          <div className="max-w-md mx-auto px-5 py-24 text-center">
            <div className="w-14 h-14 rounded-2xl bg-card border border-border mx-auto flex items-center justify-center text-ink-muted mb-4 shadow-2xs">
              <FileQuestion className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold text-ink mb-2">
              Không tìm thấy bài viết
            </h1>
            <p className="text-xs sm:text-sm text-ink-light mb-6">
              Bài viết này có thể đã bị xóa, chuyển sang chế độ nháp hoặc đường dẫn không chính xác.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-surface text-xs font-semibold hover:bg-ink/90 transition-colors shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại Bản tin o365</span>
            </Link>
          </div>
        ) : (
          /* Post Reader View */
          <article className="max-w-[var(--max-width)] mx-auto px-5 sm:px-6 py-8 sm:py-12">
            {/* Top Breadcrumb & Navigation */}
            <div className="flex items-center justify-between gap-4 mb-8">
              <nav className="flex items-center gap-2 text-xs text-ink-muted">
                <Link href="/" className="hover:text-ink transition-colors">
                  Trang chủ
                </Link>
                <span>/</span>
                <Link href="/blog" className="hover:text-ink transition-colors">
                  Bài viết
                </Link>
                <span>/</span>
                <span className="text-ink font-medium truncate max-w-[160px] sm:max-w-xs">
                  {post.tag}
                </span>
              </nav>

              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-light hover:text-ink transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Tất cả bài viết</span>
              </Link>
            </div>

            {/* Main Article Container */}
            <div className="max-w-3xl mx-auto">
              {/* Category & Meta Row */}
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-card text-ink border border-border shadow-2xs">
                  {post.tag}
                </span>
                <span className="text-xs text-ink-muted flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {post.date}
                </span>
                <span className="text-xs text-ink-muted">•</span>
                <span className="text-xs text-ink-muted flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {readTimeMinutes} phút đọc
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-extrabold text-ink leading-tight tracking-tight mb-6">
                {post.title}
              </h1>

              {/* Author & Share Bar */}
              <div className="flex items-center justify-between py-4 border-y border-border/80 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 border border-border flex items-center justify-center text-ink font-bold text-sm">
                    {post.author ? post.author.charAt(0).toUpperCase() : "O"}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-ink">
                      {post.author || "CLB o365 - HUST"}
                    </div>
                    <div className="text-[11px] text-ink-muted">
                      Đại sứ Chuyển đổi số ĐHBK Hà Nội
                    </div>
                  </div>
                </div>

                {/* Share Button */}
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-surface hover:bg-card text-xs font-semibold text-ink transition-colors shadow-2xs cursor-pointer"
                  title="Sao chép liên kết bài viết"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Đã sao chép</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-accent" />
                      <span>Chia sẻ</span>
                    </>
                  )}
                </button>
              </div>

              {/* Cover Hero Image */}
              <div className="aspect-[16/9] sm:aspect-[21/10] relative rounded-3xl overflow-hidden bg-card border border-border shadow-card mb-8">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  priority
                  loading="eager"
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>

              {/* Lead Excerpt Callout */}
              {post.excerpt && (
                <div className="p-6 rounded-2xl bg-card/60 border border-border/70 text-ink text-sm sm:text-base leading-relaxed font-medium mb-8">
                  {post.excerpt}
                </div>
              )}

              {/* Formatted Article Body */}
              <div className="py-2">
                <MarkdownRenderer content={post.content || post.excerpt} />
              </div>

              {/* End of article signature */}
              <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-ink-muted">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  <span>CLB Đại sứ Chuyển đổi số o365 • Đại học Bách khoa Hà Nội</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-ink hover:bg-card transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3 h-3 text-accent" />
                    <span>{copied ? "Đã copy link" : "Chia sẻ bài viết"}</span>
                  </button>
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-ink text-surface text-xs font-semibold hover:bg-ink/90 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Về danh sách</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Related Posts Section */}
            {relatedPosts.length > 0 && (
              <div className="max-w-3xl mx-auto mt-16 pt-12 border-t border-border">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg sm:text-xl font-extrabold text-ink tracking-tight">
                    Bài viết liên quan
                  </h3>
                  <Link
                    href="/blog"
                    className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
                  >
                    <span>Xem tất cả</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {relatedPosts.map((item) => (
                    <Link
                      key={item.id}
                      href={`/blog/${item.id}`}
                      className="group flex flex-col justify-between rounded-2xl bg-surface border border-border overflow-hidden p-3.5 shadow-2xs hover:shadow-card hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <div>
                        <div className="aspect-[16/10] relative rounded-xl overflow-hidden bg-card mb-3 border border-border">
                          <Image
                            src={item.thumbnail}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 640px) 100vw, 250px"
                          />
                        </div>
                        <span className="text-[10px] font-mono text-ink-muted">
                          {item.date} • {item.tag}
                        </span>
                        <h4 className="font-bold text-xs sm:text-sm text-ink line-clamp-2 mt-1 group-hover:text-ink-light transition-colors leading-snug">
                          {item.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
}

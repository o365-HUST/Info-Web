"use client";

import { useEffect, useState, use } from "react";
import Footer from "@/app/components/Footer";
import { DOCUMENT_CATEGORIES } from "@/app/data/clubData";
import { getResourcePage } from "@/app/lib/firestoreService";
import MediaPreview from "@/app/components/cms/MediaPreview";
import TableOfContents from "@/app/components/cms/TableOfContents";
import MarkdownRenderer from "@/app/components/MarkdownRenderer";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ResourceAttachment } from "@/app/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function DocumentDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const category = DOCUMENT_CATEGORIES.find((item) => item.id === slug);

  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState(category?.title || "Tài liệu");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<ResourceAttachment[]>([]);

  useEffect(() => {
    if (!category) return;

    // Failsafe to avoid typescript error
    const categoryTitle = category.title;
    let mounted = true;

    async function fetchDocument() {
      setIsLoading(true);
      try {
        const data = await getResourcePage(slug);
        if (!mounted) return;

        if (data?.title) setTitle(data.title);
        if (data?.content) {
          setContent(data.content);
        } else {
          setContent(
            `<p>Đang cập nhật nội dung cho chuyên mục <strong>${categoryTitle}</strong>.</p>`,
          );
        }
        if (data?.attachments) setAttachments(data.attachments);
      } catch (error) {
        console.error("Failed to fetch document", error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    fetchDocument();
  }, [slug, category]);

  if (!category) notFound();

  return (
    <>
      <main className="flex-1 bg-[var(--bg)] min-h-screen pt-[calc(var(--nav-height)+var(--breadcrumb-height)+1.5rem)] pb-20">
        <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-8">
          <div className="mb-8">
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 text-ink-light hover:text-accent transition-colors font-medium text-sm mb-6 focus-visible:outline-2 focus-visible:outline-accent rounded-sm"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              Quay lại Thư viện
            </Link>

            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-ink tracking-tight">
              {title}
            </h1>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64 text-ink-muted">
              <Loader2 className="w-8 h-8 animate-spin" aria-label="Đang tải" />
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-10 relative">
              <div className="flex-1 min-w-0" id="document-content">
                <div className="rounded-2xl border border-border bg-surface p-6 sm:p-10 shadow-card mb-8">
                  <MarkdownRenderer content={content} />
                </div>

                {attachments.length > 0 && (
                  <div className="rounded-2xl border border-border bg-surface p-6 sm:p-10 shadow-card">
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-ink mb-6 border-b border-border pb-4">
                      Tài liệu đính kèm
                    </h2>
                    <div className="space-y-8">
                      {attachments.map((file) => (
                        <MediaPreview key={file.id} file={file} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <aside className="w-full lg:w-72 shrink-0 hidden md:block">
                <TableOfContents selector="#document-content" />
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

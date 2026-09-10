"use client";

import Image from "next/image";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

function looksLikeHtml(content: string): boolean {
  const t = content.trim();
  return (
    t.startsWith("<p") ||
    t.startsWith("<h1") ||
    t.startsWith("<h2") ||
    t.startsWith("<h3") ||
    t.startsWith("<h4") ||
    t.startsWith("<blockquote") ||
    t.startsWith("<ul") ||
    t.startsWith("<ol") ||
    t.startsWith("<hr") ||
    t.startsWith("<div") ||
    t.startsWith("<figure")
  );
}

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight mt-8 mb-4">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl sm:text-2xl font-extrabold text-ink tracking-tight mt-8 mb-3 pt-4 border-t border-border/40">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg sm:text-xl font-bold text-ink tracking-tight mt-6 mb-2">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-base sm:text-lg font-bold text-ink tracking-tight mt-5 mb-2">
      {children}
    </h4>
  ),
  h5: ({ children }) => (
    <h5 className="text-base font-bold text-ink tracking-tight mt-4 mb-2">
      {children}
    </h5>
  ),
  h6: ({ children }) => (
    <h6 className="text-sm font-bold text-ink tracking-tight mt-4 mb-2 uppercase">
      {children}
    </h6>
  ),
  p: ({ children }) => (
    <p className="text-sm sm:text-base text-ink-light leading-relaxed mb-4 font-normal">
      {children}
    </p>
  ),
  a: ({ href, children }) => {
    const url = href ?? "#";
    const isExternal = url.startsWith("http");
    return (
      <a
        href={url}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="text-accent font-semibold hover:underline transition-colors break-words"
      >
        {children}
      </a>
    );
  },
  strong: ({ children }) => (
    <strong className="font-extrabold text-ink">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-ink">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="my-6 p-4 rounded-2xl bg-card border-l-4 border-accent text-ink text-sm sm:text-base italic font-medium leading-relaxed">
      {children}
    </blockquote>
  ),
  ul: ({ children }) => (
    <ul className="my-4 space-y-2 list-disc pl-5 text-ink-light text-sm sm:text-base leading-relaxed">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-4 space-y-2 list-decimal pl-5 text-ink-light text-sm sm:text-base leading-relaxed">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  hr: () => <hr className="my-8 border-border" />,
  code: ({ className, children }) => {
    const isBlock = Boolean(className?.includes("language-"));
    if (isBlock) {
      return <code className={className}>{children}</code>;
    }
    return (
      <code className="px-1.5 py-0.5 rounded-md bg-card border border-border/80 font-mono text-xs text-ink font-semibold">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="my-6 rounded-2xl bg-ink text-surface p-4 sm:p-5 font-mono text-xs sm:text-sm overflow-x-auto border border-border shadow-card leading-relaxed">
      {children}
    </pre>
  ),
  img: ({ src, alt }) => {
    if (!src || typeof src !== "string") return null;
    return (
      <figure className="my-6">
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden bg-card border border-border shadow-card">
          <Image
            src={src}
            alt={alt || "Hình ảnh bài viết"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
            unoptimized={src.startsWith("http")}
          />
        </div>
        {alt ? (
          <figcaption className="text-center text-xs text-ink-muted mt-2 italic">
            {alt}
          </figcaption>
        ) : null}
      </figure>
    );
  },
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm text-left text-ink-light">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-card text-ink font-semibold border-b border-border">
      {children}
    </thead>
  ),
  th: ({ children }) => (
    <th className="px-3 py-2 font-bold text-ink">{children}</th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 border-t border-border/60">{children}</td>
  ),
  del: ({ children }) => (
    <del className="opacity-75 line-through">{children}</del>
  ),
};

export default function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  if (!content) return null;

  // TipTap / WYSIWYG HTML — keep existing prose path
  if (looksLikeHtml(content)) {
    return (
      <div
        className={`prose-o365 ${className}`}
        dangerouslySetInnerHTML={{ __html: content.trim() }}
      />
    );
  }

  return (
    <div className={`prose-o365 prose-content ${className}`}>
      <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </Markdown>
    </div>
  );
}

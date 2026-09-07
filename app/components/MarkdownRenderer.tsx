"use client";

import React from "react";
import Image from "next/image";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Helper to render inline markdown: bold, italic, code, links
function renderInlineText(text: string): React.ReactNode[] {
  // Regex to match:
  // 1. Links: [text](url)
  // 2. Inline code: `code`
  // 3. Bold: **text**
  // 4. Italic: *text*
  const tokenRegex = /(\[[^\]]+\]\([^)]+\)|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Link: [text](url)
    if (part.startsWith("[") && part.includes("](") && part.endsWith(")")) {
      const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (match) {
        const [, linkText, url] = match;
        const isExternal = url.startsWith("http");
        return (
          <a
            key={index}
            href={url}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="text-accent font-semibold hover:underline transition-colors break-words"
          >
            {linkText}
          </a>
        );
      }
    }

    // Inline code: `code`
    if (part.startsWith("`") && part.endsWith("`") && part.length > 1) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 rounded-md bg-card border border-border/80 font-mono text-xs text-ink font-semibold"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Bold: **text**
    if (part.startsWith("**") && part.endsWith("**") && part.length > 3) {
      return (
        <strong key={index} className="font-extrabold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Italic: *text*
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <em key={index} className="italic text-ink">
          {part.slice(1, -1)}
        </em>
      );
    }

    // Plain text
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

export default function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  if (!content) return null;

  const trimmedContent = content.trim();

  // If content is HTML (from TipTap WYSIWYG editor), render directly with prose-o365 typography
  if (
    trimmedContent.startsWith("<p") ||
    trimmedContent.startsWith("<h2") ||
    trimmedContent.startsWith("<h3") ||
    trimmedContent.startsWith("<blockquote") ||
    trimmedContent.startsWith("<ul") ||
    trimmedContent.startsWith("<ol") ||
    trimmedContent.startsWith("<div")
  ) {
    return (
      <div
        className={`prose-o365 ${className}`}
        dangerouslySetInnerHTML={{ __html: trimmedContent }}
      />
    );
  }

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let codeBlockLang = "";

  let currentListItems: string[] = [];
  let listType: "ul" | "ol" = "ul";

  const flushList = (key: string | number) => {
    if (currentListItems.length > 0) {
      if (listType === "ul") {
        elements.push(
          <ul key={`ul-${key}`} className="my-4 space-y-2 list-none pl-1">
            {currentListItems.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-ink-light text-sm sm:text-base leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                <span className="flex-1">{renderInlineText(item)}</span>
              </li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol
            key={`ol-${key}`}
            className="my-4 space-y-2 list-decimal list-inside pl-1 text-ink-light text-sm sm:text-base leading-relaxed"
          >
            {currentListItems.map((item, idx) => (
              <li key={idx} className="pl-1">
                <span>{renderInlineText(item)}</span>
              </li>
            ))}
          </ol>
        );
      }
      currentListItems = [];
    }
  };

  const flushCodeBlock = (key: string | number) => {
    if (inCodeBlock) {
      elements.push(
        <div
          key={`code-${key}`}
          className="my-6 rounded-2xl bg-ink text-surface p-4 sm:p-5 font-mono text-xs sm:text-sm overflow-x-auto border border-border shadow-card"
        >
          {codeBlockLang && (
            <div className="text-[10px] text-ink-muted uppercase tracking-wider mb-2 font-bold pb-2 border-b border-surface/10">
              {codeBlockLang}
            </div>
          )}
          <pre className="leading-relaxed">
            <code>{codeBlockContent.join("\n")}</code>
          </pre>
        </div>
      );
      inCodeBlock = false;
      codeBlockContent = [];
      codeBlockLang = "";
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // 1. Check for Code Block toggles: ```
    if (trimmed.startsWith("```")) {
      if (!inCodeBlock) {
        flushList(i);
        inCodeBlock = true;
        codeBlockLang = trimmed.slice(3).trim();
        codeBlockContent = [];
      } else {
        flushCodeBlock(i);
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(rawLine);
      continue;
    }

    // 2. Check for Horizontal Rule: --- or ***
    if (trimmed === "---" || trimmed === "***") {
      flushList(i);
      elements.push(<hr key={i} className="my-8 border-border/80" />);
      continue;
    }

    // 3. Standalone Image: ![alt](url)
    if (
      trimmed.startsWith("![") &&
      trimmed.includes("](") &&
      trimmed.endsWith(")")
    ) {
      flushList(i);
      const match = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (match) {
        const [, alt, src] = match;
        elements.push(
          <figure key={i} className="my-6">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden bg-card border border-border shadow-card">
              <Image
                src={src}
                alt={alt || "Hình ảnh bài viết"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
            {alt && (
              <figcaption className="text-center text-xs text-ink-muted mt-2 italic">
                {alt}
              </figcaption>
            )}
          </figure>
        );
        continue;
      }
    }

    // 4. Heading 2 (## )
    if (trimmed.startsWith("## ")) {
      flushList(i);
      elements.push(
        <h2
          key={i}
          className="text-xl sm:text-2xl font-extrabold text-ink tracking-tight mt-8 mb-3 pt-4 border-t border-border/40"
        >
          {renderInlineText(trimmed.slice(3))}
        </h2>
      );
      continue;
    }

    // 5. Heading 3 (### )
    if (trimmed.startsWith("### ")) {
      flushList(i);
      elements.push(
        <h3
          key={i}
          className="text-lg sm:text-xl font-bold text-ink tracking-tight mt-6 mb-2"
        >
          {renderInlineText(trimmed.slice(4))}
        </h3>
      );
      continue;
    }

    // 6. Blockquote (> )
    if (trimmed.startsWith("> ")) {
      flushList(i);
      elements.push(
        <blockquote
          key={i}
          className="my-6 p-4 rounded-2xl bg-card border-l-4 border-accent text-ink text-sm sm:text-base italic font-medium leading-relaxed"
        >
          {renderInlineText(trimmed.slice(2).replace(/^"|"$/g, ""))}
        </blockquote>
      );
      continue;
    }

    // 7. Unordered List item (- or *)
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (listType !== "ul" && currentListItems.length > 0) flushList(i);
      listType = "ul";
      currentListItems.push(trimmed.slice(2));
      continue;
    }

    // 8. Ordered List item (1. , 2. )
    const olMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (olMatch) {
      if (listType !== "ol" && currentListItems.length > 0) flushList(i);
      listType = "ol";
      currentListItems.push(olMatch[2]);
      continue;
    }

    // 9. Empty line
    if (trimmed.length === 0) {
      flushList(i);
      continue;
    }

    // 10. Regular Paragraph
    flushList(i);
    elements.push(
      <p
        key={i}
        className="text-sm sm:text-base text-ink-light leading-relaxed mb-4 font-normal"
      >
        {renderInlineText(trimmed)}
      </p>
    );
  }

  // Flush any remaining list or code block
  flushList("final");
  flushCodeBlock("final");

  return <div className={`prose-content ${className}`}>{elements}</div>;
}

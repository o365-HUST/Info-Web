"use client";

import { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link2,
  Image as ImageIcon,
  Minus,
  Eye,
  Edit3,
  Loader2,
  HelpCircle,
} from "lucide-react";
import { uploadMediaAsset } from "@/app/lib/storageService";
import MarkdownRenderer from "@/app/components/MarkdownRenderer";

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "Soạn thảo nội dung bài viết với Markdown...",
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to insert or wrap text at cursor position in textarea
  const wrapOrInsert = (before: string, after: string = "", defaultText: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const textToInsert = selectedText || defaultText;

    const newContent =
      textarea.value.substring(0, start) +
      before +
      textToInsert +
      after +
      textarea.value.substring(end);

    onChange(newContent);

    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + textToInsert.length
      );
    }, 0);
  };

  // Insert prefix at line start (e.g. ##, ###, >, - )
  const insertLinePrefix = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const currentVal = textarea.value;

    // Find start of current line
    const lastNewline = currentVal.lastIndexOf("\n", start - 1);
    const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;

    const newContent =
      currentVal.substring(0, lineStart) +
      prefix +
      currentVal.substring(lineStart);

    onChange(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length);
    }, 0);
  };

  // Keyboard shortcut listener
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key.toLowerCase() === "b") {
        e.preventDefault();
        wrapOrInsert("**", "**", "văn bản đậm");
      } else if (e.key.toLowerCase() === "i") {
        e.preventDefault();
        wrapOrInsert("*", "*", "văn bản nghiêng");
      } else if (e.key.toLowerCase() === "k") {
        e.preventDefault();
        wrapOrInsert("[", "](https://...)", "tiêu đề liên kết");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      wrapOrInsert("  ", "");
    }
  };

  // Handle uploading an image directly into the markdown body
  const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setIsUploadingImage(true);
    setUploadProgress(0);

    try {
      const downloadUrl = await uploadMediaAsset(file, "blog", (progress) => {
        setUploadProgress(progress);
      });

      const altText = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      wrapOrInsert(`\n\n![${altText}](${downloadUrl})\n\n`);
    } catch (err: any) {
      setUploadError(err.message || "Tải ảnh thất bại.");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Stats calculation
  const wordsCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charsCount = value.length;
  const readTimeEst = Math.max(1, Math.ceil(wordsCount / 180));

  return (
    <div className="rounded-2xl border border-border bg-surface shadow-2xs overflow-hidden flex flex-col transition-all">
      {/* Top Header: Tabs (Write / Preview) & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-card/40 border-b border-border">
        {/* Write / Preview Tab Switcher */}
        <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-border shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab("write")}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "write"
                ? "bg-ink text-surface shadow-xs"
                : "text-ink-muted hover:text-ink hover:bg-card"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Soạn thảo</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "preview"
                ? "bg-ink text-surface shadow-xs"
                : "text-ink-muted hover:text-ink hover:bg-card"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Xem trước</span>
          </button>
        </div>

        {/* Toolbar (Only active when in 'write' mode) */}
        {activeTab === "write" && (
          <div className="flex items-center gap-1 overflow-x-auto py-0.5">
            {/* Bold */}
            <button
              type="button"
              onClick={() => wrapOrInsert("**", "**", "in đậm")}
              className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-surface transition-colors cursor-pointer"
              title="In đậm (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </button>

            {/* Italic */}
            <button
              type="button"
              onClick={() => wrapOrInsert("*", "*", "in nghiêng")}
              className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-surface transition-colors cursor-pointer"
              title="In nghiêng (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </button>

            <div className="w-px h-4 bg-border/80 mx-1" />

            {/* H2 */}
            <button
              type="button"
              onClick={() => insertLinePrefix("## ")}
              className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-surface transition-colors cursor-pointer"
              title="Tiêu đề lớn H2 (##)"
            >
              <Heading2 className="w-4 h-4" />
            </button>

            {/* H3 */}
            <button
              type="button"
              onClick={() => insertLinePrefix("### ")}
              className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-surface transition-colors cursor-pointer"
              title="Tiêu đề vừa H3 (###)"
            >
              <Heading3 className="w-4 h-4" />
            </button>

            <div className="w-px h-4 bg-border/80 mx-1" />

            {/* Quote */}
            <button
              type="button"
              onClick={() => insertLinePrefix("> ")}
              className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-surface transition-colors cursor-pointer"
              title="Trích dẫn / Callout (>)"
            >
              <Quote className="w-4 h-4" />
            </button>

            {/* Bullet List */}
            <button
              type="button"
              onClick={() => insertLinePrefix("- ")}
              className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-surface transition-colors cursor-pointer"
              title="Danh sách gạch đầu dòng (-)"
            >
              <List className="w-4 h-4" />
            </button>

            {/* Numbered List */}
            <button
              type="button"
              onClick={() => insertLinePrefix("1. ")}
              className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-surface transition-colors cursor-pointer"
              title="Danh sách đánh số (1.)"
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            <div className="w-px h-4 bg-border/80 mx-1" />

            {/* Code Block */}
            <button
              type="button"
              onClick={() => wrapOrInsert("\n```javascript\n", "\n```\n", "// code tại đây")}
              className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-surface transition-colors cursor-pointer"
              title="Khối Code (```)"
            >
              <Code className="w-4 h-4" />
            </button>

            {/* Link */}
            <button
              type="button"
              onClick={() => wrapOrInsert("[", "](https://...)", "tiêu đề liên kết")}
              className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-surface transition-colors cursor-pointer"
              title="Chèn liên kết (Ctrl+K)"
            >
              <Link2 className="w-4 h-4" />
            </button>

            {/* Insert Image directly */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingImage}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-border bg-surface hover:bg-card text-ink text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
              title="Tải ảnh lên và chèn vào nội dung bài viết"
            >
              {isUploadingImage ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 text-accent animate-spin" />
                  <span className="text-[11px] text-accent font-mono">{uploadProgress}%</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-3.5 h-3.5 text-accent" />
                  <span className="hidden sm:inline text-[11px]">Chèn ảnh</span>
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleInlineImageUpload}
            />

            {/* Divider */}
            <button
              type="button"
              onClick={() => wrapOrInsert("\n\n---\n\n")}
              className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-surface transition-colors cursor-pointer"
              title="Đường phân cách (---)"
            >
              <Minus className="w-4 h-4" />
            </button>

            {/* Help Toggle */}
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                showHelp ? "text-accent bg-surface" : "text-ink-muted hover:text-ink"
              }`}
              title="Hướng dẫn cú pháp Markdown"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Quick Help Guide Popup (Collapsible) */}
      {showHelp && activeTab === "write" && (
        <div className="bg-card/70 border-b border-border p-3 text-xs text-ink-light grid grid-cols-2 sm:grid-cols-4 gap-2 animate-in fade-in">
          <div><code className="font-bold text-ink">## Tiêu đề</code> : Heading 2</div>
          <div><code className="font-bold text-ink">### Tiêu đề</code> : Heading 3</div>
          <div><code className="font-bold text-ink">**chữ đậm**</code> : In đậm</div>
          <div><code className="font-bold text-ink">*chữ nghiêng*</code> : In nghiêng</div>
          <div><code className="font-bold text-ink">- mục</code> : Gạch đầu dòng</div>
          <div><code className="font-bold text-ink">&gt; trích dẫn</code> : Khối trích dẫn</div>
          <div><code className="font-bold text-ink">`code`</code> : Code nội dòng</div>
          <div><code className="font-bold text-ink">![alt](url)</code> : Chèn ảnh</div>
        </div>
      )}

      {/* Image Upload Error Banner */}
      {uploadError && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-200 text-red-700 text-xs font-medium">
          {uploadError}
        </div>
      )}

      {/* Main Body Area: Write or Preview */}
      <div className="relative flex-1 bg-surface">
        {activeTab === "write" ? (
          <textarea
            ref={textareaRef}
            rows={12}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full p-4 sm:p-5 text-ink text-sm leading-relaxed placeholder:text-ink-muted/50 focus:outline-none resize-y font-mono min-h-[260px]"
          />
        ) : (
          <div className="p-5 sm:p-6 min-h-[260px] overflow-y-auto max-h-[500px]">
            {value.trim() ? (
              <MarkdownRenderer content={value} />
            ) : (
              <div className="py-16 text-center text-ink-muted text-xs italic">
                Chưa có nội dung. Hãy soạn thảo ở tab &quot;Soạn thảo&quot; để xem trước bản in thực tế.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Status & Word Counter Bar */}
      <div className="px-4 py-2 bg-card/30 border-t border-border/80 flex items-center justify-between text-[11px] font-mono text-ink-muted">
        <div className="flex items-center gap-3">
          <span>{wordsCount} từ</span>
          <span>•</span>
          <span>{charsCount} ký tự</span>
          <span>•</span>
          <span>~{readTimeEst} phút đọc</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-ink-muted/80">
          <span>Hỗ trợ Markdown &amp; HTML Entities</span>
        </div>
      </div>
    </div>
  );
}

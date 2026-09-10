"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { marked } from "marked";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link2,
  Image as ImageIcon,
  Minus,
  Undo2,
  Redo2,
  Loader2,
  Unlink,
} from "lucide-react";
import { uploadMediaAsset } from "@/app/lib/storageService";

marked.setOptions({ gfm: true, breaks: false });

/** Detect common Markdown constructs so plain pastes can be converted. */
function looksLikeMarkdown(text: string): boolean {
  const sample = text.trim();
  if (!sample) return false;

  return (
    /^#{1,6}\s+\S/m.test(sample) ||
    /^```[\w-]*\s*$/m.test(sample) ||
    /^>\s+\S/m.test(sample) ||
    /^(-{3,}|\*{3,}|_{3,})\s*$/m.test(sample) ||
    /^\s*[-*+]\s+\S/m.test(sample) ||
    /^\s*\d+\.\s+\S/m.test(sample) ||
    /\*\*[^*\n]+\*\*/.test(sample) ||
    /__[^_\n]+__/.test(sample) ||
    /(?<!\*)\*[^*\n]+\*(?!\*)/.test(sample) ||
    /`[^`\n]+`/.test(sample) ||
    /\[[^\]]+\]\([^)]+\)/.test(sample) ||
    /!\[[^\]]*\]\([^)]+\)/.test(sample) ||
    /^\|.+\|/m.test(sample)
  );
}

/** True when clipboard HTML is from Word / Docs / rich editors — keep TipTap's default paste. */
function isRichHtmlPaste(html: string): boolean {
  if (/mso-|Microsoft|docs-internal-guid|Apple-Interchange-Newline|xmlns:o=/i.test(html)) {
    return true;
  }
  const stripped = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\/?(html|head|body|meta|fragment)[^>]*>/gi, "")
    .trim();
  if (/<(h[1-6]|ul|ol|li|table|blockquote|img|pre|strong|em|b|i)\b/i.test(stripped)) {
    return true;
  }
  const pCount = (stripped.match(/<p\b/gi) || []).length;
  return pCount > 1 && /style\s*=/i.test(stripped);
}

/** HTML that only wraps the same plain text (e.g. VS Code / some browsers). */
function htmlIsPlainWrapper(html: string, plain: string): boolean {
  const fromHtml = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\r\n/g, "\n")
    .trim();
  const normalizedPlain = plain.replace(/\r\n/g, "\n").trim();
  return (
    fromHtml === normalizedPlain ||
    fromHtml.replace(/\s+/g, " ") === normalizedPlain.replace(/\s+/g, " ")
  );
}

function markdownToEditorHtml(markdown: string): string {
  const html = marked.parse(markdown, { async: false }) as string;
  // TipTap toolbar is H2/H3; map H1 from pasted MD so structure is preserved.
  return html.replace(/<h1(\b[^>]*)>/gi, "<h2$1>").replace(/<\/h1>/gi, "</h2>");
}

interface TipTapEditorProps {
  content: string;
  onChange: (htmlContent: string) => void;
  placeholder?: string;
}

export default function TipTapEditor({
  content,
  onChange,
  placeholder = "Bắt đầu soạn thảo nội dung bài viết...",
}: TipTapEditorProps) {
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<Editor | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      TiptapImage.configure({
        inline: false,
        HTMLAttributes: {
          class: "rounded-2xl border border-border shadow-card my-6 max-w-full mx-auto",
        },
      }),
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-accent font-semibold hover:underline",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: content || "",
    editorProps: {
      attributes: {
        class: "prose-o365 p-4 sm:p-5 min-h-[260px] focus:outline-none",
      },
      handlePaste: (_view, event) => {
        const clipboard = event.clipboardData;
        if (!clipboard) return false;

        const plain = clipboard.getData("text/plain");
        const html = clipboard.getData("text/html");

        if (!plain?.trim() || !looksLikeMarkdown(plain)) {
          return false;
        }

        // Keep rich pastes from Word / Google Docs / browsers.
        if (html && isRichHtmlPaste(html) && !htmlIsPlainWrapper(html, plain)) {
          return false;
        }

        event.preventDefault();
        const ed = editorRef.current;
        if (!ed) return false;

        ed.chain().focus().insertContent(markdownToEditorHtml(plain)).run();
        return true;
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  editorRef.current = editor;

  // Sync external content changes if editing a post or switching posts
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      // If content is empty or different, set content
      if (!editor.isFocused) {
        editor.commands.setContent(content || "");
      }
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-12 text-center text-xs text-ink-muted flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-accent" />
        <span>Đang khởi tạo trình soạn thảo WYSIWYG...</span>
      </div>
    );
  }

  // Handle link prompt
  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Nhập địa chỉ URL liên kết:", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  };

  // Handle uploading an image directly into the document
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

      editor
        .chain()
        .focus()
        .setImage({ src: downloadUrl, alt: file.name })
        .run();
    } catch (err: any) {
      setUploadError(err.message || "Tải ảnh thất bại.");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Stats
  const textContent = editor.getText();
  const wordsCount = textContent.trim()
    ? textContent.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const charsCount = textContent.length;
  const readTimeEst = Math.max(1, Math.ceil(wordsCount / 180));

  return (
    <div className="rounded-2xl border border-border bg-surface shadow-2xs overflow-hidden flex flex-col transition-all">
      {/* Top Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-1 px-3 py-2 bg-card/40 border-b border-border">
        {/* Undo / Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-surface transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          title="Hoàn tác (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-surface transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          title="Làm lại (Ctrl+Y)"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-border/80 mx-1" />

        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            editor.isActive("heading", { level: 2 })
              ? "bg-ink text-surface shadow-xs"
              : "text-ink-muted hover:text-ink hover:bg-surface"
          }`}
          title="Tiêu đề lớn (H2)"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            editor.isActive("heading", { level: 3 })
              ? "bg-ink text-surface shadow-xs"
              : "text-ink-muted hover:text-ink hover:bg-surface"
          }`}
          title="Tiêu đề vừa (H3)"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-border/80 mx-1" />

        {/* Text styling */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive("bold")
              ? "bg-ink text-surface shadow-xs"
              : "text-ink-muted hover:text-ink hover:bg-surface"
          }`}
          title="In đậm (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive("italic")
              ? "bg-ink text-surface shadow-xs"
              : "text-ink-muted hover:text-ink hover:bg-surface"
          }`}
          title="In nghiêng (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive("strike")
              ? "bg-ink text-surface shadow-xs"
              : "text-ink-muted hover:text-ink hover:bg-surface"
          }`}
          title="Gạch ngang chữ"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-border/80 mx-1" />

        {/* Lists & Quotes */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive("bulletList")
              ? "bg-ink text-surface shadow-xs"
              : "text-ink-muted hover:text-ink hover:bg-surface"
          }`}
          title="Danh sách gạch đầu dòng"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive("orderedList")
              ? "bg-ink text-surface shadow-xs"
              : "text-ink-muted hover:text-ink hover:bg-surface"
          }`}
          title="Danh sách đánh số"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive("blockquote")
              ? "bg-ink text-surface shadow-xs"
              : "text-ink-muted hover:text-ink hover:bg-surface"
          }`}
          title="Khối trích dẫn"
        >
          <Quote className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive("codeBlock")
              ? "bg-ink text-surface shadow-xs"
              : "text-ink-muted hover:text-ink hover:bg-surface"
          }`}
          title="Khối code"
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-border/80 mx-1" />

        {/* Links */}
        <button
          type="button"
          onClick={setLink}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            editor.isActive("link")
              ? "bg-ink text-surface shadow-xs"
              : "text-ink-muted hover:text-ink hover:bg-surface"
          }`}
          title="Chèn liên kết"
        >
          <Link2 className="w-4 h-4" />
        </button>

        {editor.isActive("link") && (
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            title="Gỡ liên kết"
          >
            <Unlink className="w-4 h-4" />
          </button>
        )}

        {/* Image Upload */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploadingImage}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-surface hover:bg-card text-ink text-xs font-semibold transition-colors cursor-pointer shadow-2xs ml-auto sm:ml-0"
          title="Tải ảnh lên và chèn vào bài viết"
        >
          {isUploadingImage ? (
            <>
              <Loader2 className="w-3.5 h-3.5 text-accent animate-spin" />
              <span className="text-[11px] text-accent font-mono">{uploadProgress}%</span>
            </>
          ) : (
            <>
              <ImageIcon className="w-3.5 h-3.5 text-accent" />
              <span className="text-[11px]">Chèn ảnh</span>
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
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-surface transition-colors cursor-pointer"
          title="Đường phân cách ngang"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-200 text-red-700 text-xs font-medium">
          {uploadError}
        </div>
      )}

      {/* WYSIWYG Content Area */}
      <div className="flex-1 bg-surface cursor-text" onClick={() => editor.commands.focus()}>
        <EditorContent editor={editor} />
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 bg-card/30 border-t border-border/80 flex items-center justify-between text-[11px] font-mono text-ink-muted">
        <div className="flex items-center gap-3">
          <span>{wordsCount} từ</span>
          <span>•</span>
          <span>{charsCount} ký tự</span>
          <span>•</span>
          <span>~{readTimeEst} phút đọc</span>
        </div>
        <span className="hidden sm:inline text-ink-muted/80">
          Dán Markdown sẽ tự chuyển thành định dạng
        </span>
      </div>
    </div>
  );
}

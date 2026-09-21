import DOMPurify from "isomorphic-dompurify";
import { isSafeHref, normalizeSafeHref } from "./safeUrl";

const BLOCKED_SRC = /^(javascript|vbscript|data):/i;

function isSafeMediaSrc(src: string): boolean {
  const trimmed = src.trim();
  if (!trimmed || BLOCKED_SRC.test(trimmed)) return false;
  if (trimmed.startsWith("/")) return true;
  return /^https?:/i.test(trimmed);
}

const PURIFY_CONFIG: Parameters<typeof DOMPurify.sanitize>[1] = {
  ALLOWED_TAGS: [
    "p",
    "br",
    "strong",
    "em",
    "s",
    "u",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "li",
    "blockquote",
    "pre",
    "code",
    "a",
    "img",
    "figure",
    "figcaption",
    "hr",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "div",
    "span",
    "iframe",
  ],
  ALLOWED_ATTR: [
    "href",
    "target",
    "rel",
    "src",
    "alt",
    "title",
    "class",
    "width",
    "height",
    "colspan",
    "rowspan",
    "allow",
    "allowfullscreen",
    "frameborder",
    "referrerpolicy",
    "loading",
  ],
  ALLOW_DATA_ATTR: false,
  ADD_ATTR: ["target", "rel"],
};

let hooksInstalled = false;

function installLinkHooks() {
  if (hooksInstalled) return;
  hooksInstalled = true;

  DOMPurify.addHook("uponSanitizeAttribute", (node, data) => {
    if (data.attrName === "href") {
      const value = String(data.attrValue ?? "");
      if (!isSafeHref(value)) {
        data.keepAttr = false;
        return;
      }
      data.attrValue = normalizeSafeHref(value);
      return;
    }
    if (data.attrName === "src") {
      const value = String(data.attrValue ?? "");
      if (!isSafeMediaSrc(value)) {
        data.keepAttr = false;
      }
    }
  });

  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.tagName !== "A") return;
    const href = node.getAttribute("href");
    if (!href) return;
    if (href.startsWith("http")) {
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener noreferrer");
    }
  });
}

export function sanitizeRichHtml(html: string): string {
  if (!html?.trim()) return "";
  installLinkHooks();
  return DOMPurify.sanitize(html.trim(), PURIFY_CONFIG);
}

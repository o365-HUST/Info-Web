const BLOCKED_PROTOCOL = /^(javascript|vbscript|data):/i;

/** Safe href for user-authored links (markdown + sanitized HTML). */
export function isSafeHref(href: string | undefined | null): boolean {
  if (!href) return false;
  const trimmed = href.trim();
  if (!trimmed || trimmed === "#") return true;
  if (BLOCKED_PROTOCOL.test(trimmed)) return false;
  if (trimmed.startsWith("//")) return true;
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) {
    return /^https?:/i.test(trimmed) || /^mailto:/i.test(trimmed);
  }
  return trimmed.startsWith("/") || trimmed.startsWith("#");
}

export function normalizeSafeHref(href: string | undefined | null): string {
  if (!href) return "#";
  const trimmed = href.trim();
  if (!isSafeHref(trimmed)) return "#";
  return trimmed;
}

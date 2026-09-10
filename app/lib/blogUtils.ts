import type { BlogPost } from "@/app/types";

/** Parse `dd/mm/yyyy` (or similar) into a sortable timestamp. Invalid → 0. */
export function parsePostDate(dateStr: string): number {
  const parts = dateStr.trim().split(/[/.-]/);
  if (parts.length < 3) return 0;
  const [dd, mm, yyyy] = parts.map((p) => Number(p));
  if (!dd || !mm || !yyyy) return 0;
  return new Date(yyyy, mm - 1, dd).getTime();
}

export function sortPostsNewestFirst(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort(
    (a, b) => parsePostDate(b.date) - parsePostDate(a.date)
  );
}

import type { BlogPost } from "@/app/types";

/** Chuyên mục bài viết blog (admin + lọc /blog). */
export const BLOG_POST_TAGS = [
  "Devlog",
  "Cuộc thi",
  "Hành trình",
  "Workshop",
  "Sự kiện",
  "Kỹ năng số",
  "Thông báo",
] as const;

export type BlogPostTag = (typeof BLOG_POST_TAGS)[number];

/** Chip lọc trên trang /blog (gồm Tất cả). */
export const BLOG_ARCHIVE_FILTERS = ["Tất cả", ...BLOG_POST_TAGS] as const;

const SIDEBAR_FEATURED_LIMIT = 3;
const UNDER_HERO_LIMIT = 2;

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

/** Pinned first, then newest by date. */
export function sortPostsForListing(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => {
    const pinA = a.pinned === true ? 1 : 0;
    const pinB = b.pinned === true ? 1 : 0;
    if (pinB !== pinA) return pinB - pinA;
    return parsePostDate(b.date) - parsePostDate(a.date);
  });
}

export function isHeroSpot(post: BlogPost): boolean {
  return post.heroSpot === true;
}

export function isFeaturedSpot(post: BlogPost): boolean {
  return post.featuredSpot === true || post.featured === true;
}

function fillFromSorted(
  sorted: BlogPost[],
  limit: number,
  excludeIds: Set<string>
): BlogPost[] {
  const picked: BlogPost[] = [];
  for (const post of sorted) {
    if (picked.length >= limit) break;
    if (!excludeIds.has(post.id)) {
      picked.push(post);
      excludeIds.add(post.id);
    }
  }
  return picked;
}

export interface BentoLayout {
  hero: BlogPost | null;
  underHero: BlogPost[];
  sidebarFeatured: BlogPost[];
  others: BlogPost[];
}

/** Resolve hero, under-hero cards, sidebar, and remainder for bento layout. */
export function splitBentoLayout(posts: BlogPost[]): BentoLayout {
  const sorted = sortPostsForListing(posts);
  if (sorted.length === 0) {
    return { hero: null, underHero: [], sidebarFeatured: [], others: [] };
  }

  const heroCandidates = sorted.filter(isHeroSpot);
  const featuredCandidates = sorted.filter(isFeaturedSpot);

  const hero =
    heroCandidates[0] ?? featuredCandidates[0] ?? sorted[0] ?? null;

  const usedIds = new Set<string>();
  if (hero) usedIds.add(hero.id);

  let sidebarFeatured = featuredCandidates
    .filter((p) => p.id !== hero?.id)
    .slice(0, SIDEBAR_FEATURED_LIMIT);

  if (sidebarFeatured.length < SIDEBAR_FEATURED_LIMIT) {
    sidebarFeatured = [
      ...sidebarFeatured,
      ...fillFromSorted(
        sorted,
        SIDEBAR_FEATURED_LIMIT - sidebarFeatured.length,
        new Set([...usedIds, ...sidebarFeatured.map((p) => p.id)])
      ),
    ];
  }

  sidebarFeatured.forEach((p) => usedIds.add(p.id));

  let underHero = featuredCandidates
    .filter((p) => !usedIds.has(p.id))
    .slice(0, UNDER_HERO_LIMIT);

  if (underHero.length < UNDER_HERO_LIMIT) {
    underHero = [
      ...underHero,
      ...fillFromSorted(
        sorted,
        UNDER_HERO_LIMIT - underHero.length,
        new Set([...usedIds, ...underHero.map((p) => p.id)])
      ),
    ];
  }

  underHero.forEach((p) => usedIds.add(p.id));

  const others = sorted.filter((p) => !usedIds.has(p.id));

  return { hero, underHero, sidebarFeatured, others };
}

/** Up to `limit` posts for homepage teaser: hero + featured spots, then fill. */
export function pickHomepagePosts(
  posts: BlogPost[],
  limit: number = SIDEBAR_FEATURED_LIMIT
): BlogPost[] {
  const { hero, sidebarFeatured } = splitBentoLayout(posts);
  const picked: BlogPost[] = [];
  const ids = new Set<string>();

  if (hero) {
    picked.push(hero);
    ids.add(hero.id);
  }
  for (const post of sidebarFeatured) {
    if (picked.length >= limit) break;
    if (!ids.has(post.id)) {
      picked.push(post);
      ids.add(post.id);
    }
  }
  if (picked.length < limit) {
    picked.push(
      ...fillFromSorted(sortPostsForListing(posts), limit - picked.length, ids)
    );
  }
  return picked;
}

/** @deprecated Use pickHomepagePosts */
export function pickFeaturedPosts(
  posts: BlogPost[],
  limit: number = SIDEBAR_FEATURED_LIMIT
): BlogPost[] {
  return pickHomepagePosts(posts, limit);
}

/** @deprecated Use splitBentoLayout */
export function splitFeaturedAndOthers(
  posts: BlogPost[],
  limit: number = SIDEBAR_FEATURED_LIMIT
): { featured: BlogPost[]; others: BlogPost[] } {
  const layout = splitBentoLayout(posts);
  const featured: BlogPost[] = [];
  const ids = new Set<string>();
  if (layout.hero) {
    featured.push(layout.hero);
    ids.add(layout.hero.id);
  }
  for (const p of layout.underHero) {
    if (featured.length >= limit) break;
    if (!ids.has(p.id)) {
      featured.push(p);
      ids.add(p.id);
    }
  }
  for (const p of layout.sidebarFeatured) {
    if (featured.length >= limit) break;
    if (!ids.has(p.id)) {
      featured.push(p);
      ids.add(p.id);
    }
  }
  return { featured, others: layout.others };
}

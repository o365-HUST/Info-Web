import "server-only";

import { BLOG_POSTS } from "@/app/data/clubData";
import { sortPostsForListing } from "@/app/lib/blogUtils";
import type { BlogPost } from "@/app/types";
import { unstable_cache } from "next/cache";

export const BLOG_REVALIDATE_SECONDS = 60;

function isFirebaseServerConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY.length > 5,
  );
}

type FirestoreValue =
  | { stringValue?: string }
  | { booleanValue?: boolean }
  | { integerValue?: string }
  | { doubleValue?: number }
  | { nullValue?: null };

function fieldToJs(value: FirestoreValue | undefined): unknown {
  if (!value || typeof value !== "object") return undefined;
  if ("stringValue" in value) return value.stringValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("nullValue" in value) return undefined;
  return undefined;
}

function docToBlogPost(
  docId: string,
  fields: Record<string, FirestoreValue> | undefined,
): BlogPost | null {
  if (!fields) return null;
  const title = fieldToJs(fields.title) as string | undefined;
  if (!title) return null;

  const featured =
    fieldToJs(fields.featuredSpot) ?? fieldToJs(fields.featured);

  return {
    id: docId,
    title,
    excerpt: (fieldToJs(fields.excerpt) as string) ?? "",
    tag: (fieldToJs(fields.tag) as string) ?? "Tin tức",
    date: (fieldToJs(fields.date) as string) ?? "",
    thumbnail: (fieldToJs(fields.thumbnail) as string) ?? "",
    url: (fieldToJs(fields.url) as string) ?? `/blog/${docId}`,
    content: (fieldToJs(fields.content) as string) ?? undefined,
    published: fieldToJs(fields.published) as boolean | undefined,
    author: (fieldToJs(fields.author) as string) ?? undefined,
    authorDescription: (fieldToJs(fields.authorDescription) as string) ??
      undefined,
    heroSpot: fieldToJs(fields.heroSpot) as boolean | undefined,
    featuredSpot: featured as boolean | undefined,
    pinned: fieldToJs(fields.pinned) as boolean | undefined,
  };
}

async function fetchPostsFromFirestoreRest(): Promise<BlogPost[]> {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY!;
  const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/posts?key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url, {
    next: { revalidate: BLOG_REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    throw new Error(`Firestore REST posts failed: ${res.status}`);
  }

  const data = (await res.json()) as {
    documents?: Array<{
      name?: string;
      fields?: Record<string, FirestoreValue>;
    }>;
  };

  if (!data.documents?.length) return [];

  return data.documents
    .map((doc) => {
      const id = doc.name?.split("/").pop() ?? "";
      return docToBlogPost(id, doc.fields);
    })
    .filter((p): p is BlogPost => p !== null);
}

async function fetchPostsUncached(): Promise<BlogPost[]> {
  if (!isFirebaseServerConfigured()) {
    return BLOG_POSTS.filter((p) => p.published !== false);
  }

  try {
    const posts = await fetchPostsFromFirestoreRest();
    return posts.filter((p) => p.published !== false);
  } catch (err) {
    console.error("[postsServer] fetch failed, using seed data:", err);
    return BLOG_POSTS.filter((p) => p.published !== false);
  }
}

const getCachedPublishedPosts = unstable_cache(
  fetchPostsUncached,
  ["published-blog-posts"],
  { revalidate: BLOG_REVALIDATE_SECONDS },
);

export async function getPublishedPosts(): Promise<BlogPost[]> {
  return sortPostsForListing(await getCachedPublishedPosts());
}

export async function getPublishedPostById(
  id: string,
): Promise<BlogPost | null> {
  const posts = await getPublishedPosts();
  return posts.find((p) => p.id === id) ?? null;
}

export function getRelatedPostsFromList(
  allPosts: BlogPost[],
  currentId: string,
  tag: string | undefined,
  limitCount = 3,
): BlogPost[] {
  const published = sortPostsForListing(
    allPosts.filter((p) => p.id !== currentId && p.published !== false),
  );
  if (tag) {
    const sameTag = published.filter((p) => p.tag === tag);
    if (sameTag.length >= limitCount) {
      return sameTag.slice(0, limitCount);
    }
    const otherTag = published.filter((p) => p.tag !== tag);
    return [...sameTag, ...otherTag].slice(0, limitCount);
  }
  return published.slice(0, limitCount);
}

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  onSnapshot,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { canUseLocalCmsDemo } from "./cmsDemoMode";
import { deleteMediaAsset } from "./storageService";
import type {
  BlogPost,
  RecruitmentInfo,
  ResourcePageData,
} from "../types";
import {
  BLOG_POSTS,
  RECRUITMENT_INFO,
} from "../data/clubData";
import { sortPostsForListing } from "./blogUtils";

const LOCAL_POSTS_KEY = "o365_cms_posts";
const LOCAL_RECRUITMENT_KEY = "o365_cms_recruitment";
const LOCAL_RESOURCE_PAGES_KEY = "o365_cms_resource_pages";

/** Firestore rejects `undefined`; on updates, clear optional fields with deleteField(). */
function sanitizeForFirestore(
  data: object,
  { isUpdate = false }: { isUpdate?: boolean } = {},
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (value === undefined) {
      if (isUpdate) out[key] = deleteField();
    } else {
      out[key] = value;
    }
  }
  return out;
}

export async function checkIsAdmin(uid: string): Promise<boolean> {
  if (!isFirebaseConfigured() || !db) {
    return canUseLocalCmsDemo();
  }
  try {
    const adminDocRef = doc(db, "admins", uid);
    const snap = await getDoc(adminDocRef);
    if (snap.exists()) {
      const data = snap.data();
      return data?.role === "admin";
    }
    return false;
  } catch (error) {
    console.error("Failed to check admin status:", error);
    return false;
  }
}


// Helper to initialize local storage mock data on client
function getLocalPosts(): BlogPost[] {
  if (typeof window === "undefined") return BLOG_POSTS;
  try {
    const raw = localStorage.getItem(LOCAL_POSTS_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(BLOG_POSTS));
    return BLOG_POSTS;
  } catch {
    return BLOG_POSTS;
  }
}

function saveLocalPosts(posts: BlogPost[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(posts));
  window.dispatchEvent(new CustomEvent("cms-posts-updated", { detail: posts }));
  if (postsSubscribers.size > 0) {
    notifyPostsSubscribers(posts);
  }
}

function getLocalRecruitment(): RecruitmentInfo {
  if (typeof window === "undefined") return RECRUITMENT_INFO;
  try {
    const raw = localStorage.getItem(LOCAL_RECRUITMENT_KEY);
    if (raw) return normalizeRecruitment(JSON.parse(raw));
    localStorage.setItem(LOCAL_RECRUITMENT_KEY, JSON.stringify(RECRUITMENT_INFO));
    return RECRUITMENT_INFO;
  } catch {
    return RECRUITMENT_INFO;
  }
}

function useLocalCmsFallback(): boolean {
  return canUseLocalCmsDemo();
}

function firestoreWriteError(action: string, err: unknown): never {
  const message =
    err instanceof Error ? err.message : "Unknown Firestore error";
  throw new Error(`${action} failed: ${message}`);
}

// ─── Shared posts listener (one Firestore subscription per tab) ───
type PostsListener = (posts: BlogPost[]) => void;
const postsSubscribers = new Set<PostsListener>();
let postsCache: BlogPost[] | null = null;
let postsUnsubscribe: (() => void) | null = null;

function notifyPostsSubscribers(posts: BlogPost[]) {
  postsCache = posts;
  postsSubscribers.forEach((cb) => cb(posts));
}

function teardownPostsListenerIfIdle() {
  if (postsSubscribers.size === 0 && postsUnsubscribe) {
    postsUnsubscribe();
    postsUnsubscribe = null;
  }
}

function ensurePostsListener() {
  if (postsUnsubscribe) return;

  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, "posts"));
      postsUnsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const posts = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as BlogPost[];
          notifyPostsSubscribers(posts);
        },
        (error) => {
          console.error("Firestore subscribePosts listener error:", error);
          notifyPostsSubscribers([]);
        },
      );
      return;
    } catch (e) {
      console.error("Firestore subscription failed:", e);
      notifyPostsSubscribers([]);
      return;
    }
  }

  notifyPostsSubscribers(getLocalPosts());
  const handler = (e: Event) => {
    const custom = e as CustomEvent<BlogPost[]>;
    notifyPostsSubscribers(custom.detail || getLocalPosts());
  };
  if (typeof window !== "undefined") {
    window.addEventListener("cms-posts-updated", handler);
  }
  postsUnsubscribe = () => {
    if (typeof window !== "undefined") {
      window.removeEventListener("cms-posts-updated", handler);
    }
  };
}

function saveLocalRecruitment(info: RecruitmentInfo) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_RECRUITMENT_KEY, JSON.stringify(info));
  window.dispatchEvent(new CustomEvent("cms-recruitment-updated", { detail: info }));
}

// ──────────────────────────────────────────
// BLOG POSTS SERVICE
// ──────────────────────────────────────────

export async function getPosts(): Promise<BlogPost[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, "posts"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as BlogPost[];
    } catch (err) {
      console.error("Firestore getPosts error:", err);
      if (useLocalCmsFallback()) return getLocalPosts();
      return [];
    }
  }
  return getLocalPosts();
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  if (isFirebaseConfigured() && db) {
    try {
      const snap = await getDoc(doc(db, "posts", id));
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as BlogPost;
      }
      return null;
    } catch (err) {
      console.error("Firestore getPostById error:", err);
      if (useLocalCmsFallback()) {
        return getLocalPosts().find((p) => p.id === id) || null;
      }
      return null;
    }
  }
  return getLocalPosts().find((p) => p.id === id) || null;
}

export async function getRelatedPosts(
  currentId: string,
  tag?: string,
  limitCount: number = 3
): Promise<BlogPost[]> {
  const allPosts = await getPosts();
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

export function subscribePosts(callback: (posts: BlogPost[]) => void): () => void {
  postsSubscribers.add(callback);
  if (postsCache) {
    callback(postsCache);
  } else {
    ensurePostsListener();
  }

  return () => {
    postsSubscribers.delete(callback);
    teardownPostsListenerIfIdle();
  };
}

export async function createPost(postData: Omit<BlogPost, "id">): Promise<string> {
  const newId = `post-${Date.now()}`;
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        ...postData,
        published: postData.published ?? true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      firestoreWriteError("createPost", err);
    }
  }

  if (!useLocalCmsFallback()) {
    throw new Error("CMS is not configured for this environment.");
  }

  const posts = getLocalPosts();
  const newPost: BlogPost = {
    id: newId,
    ...postData,
    published: postData.published ?? true,
  };
  saveLocalPosts([newPost, ...posts]);
  return newId;
}

export async function updatePost(id: string, postData: Partial<BlogPost>): Promise<void> {
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, "posts", id);
      await updateDoc(docRef, {
        ...postData,
        updatedAt: serverTimestamp(),
      });
      return;
    } catch (err) {
      firestoreWriteError("updatePost", err);
    }
  }

  if (!useLocalCmsFallback()) {
    throw new Error("CMS is not configured for this environment.");
  }

  const posts = getLocalPosts();
  const updated = posts.map((p) => (p.id === id ? { ...p, ...postData } : p));
  saveLocalPosts(updated);
}

export async function deletePost(id: string): Promise<void> {
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, "posts", id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const postData = snap.data() as BlogPost;
        if (postData?.thumbnail) {
          await deleteMediaAsset(postData.thumbnail);
        }
      }
      await deleteDoc(docRef);
      return;
    } catch (err) {
      firestoreWriteError("deletePost", err);
    }
  }

  if (!useLocalCmsFallback()) {
    throw new Error("CMS is not configured for this environment.");
  }

  const posts = getLocalPosts();
  saveLocalPosts(posts.filter((p) => p.id !== id));
}

// ──────────────────────────────────────────
// RECRUITMENT & SETTINGS SERVICE
// ──────────────────────────────────────────

export function normalizeRecruitment(
  data: Partial<RecruitmentInfo> | undefined,
): RecruitmentInfo {
  return {
    ...RECRUITMENT_INFO,
    ...(data ?? {}),
    visible: data?.visible ?? false,
  };
}

export async function getRecruitment(): Promise<RecruitmentInfo> {
  if (isFirebaseConfigured() && db) {
    try {
      const snap = await getDoc(doc(db, "settings", "recruitment"));
      if (snap.exists()) {
        return normalizeRecruitment(snap.data() as Partial<RecruitmentInfo>);
      }
      return normalizeRecruitment(undefined);
    } catch (err) {
      console.error("Firestore getRecruitment failed:", err);
      if (useLocalCmsFallback()) return getLocalRecruitment();
      return normalizeRecruitment(undefined);
    }
  }
  return getLocalRecruitment();
}

export async function updateRecruitment(info: Partial<RecruitmentInfo>): Promise<void> {
  const current =
    isFirebaseConfigured() && db
      ? await getRecruitment()
      : getLocalRecruitment();
  const updated = normalizeRecruitment({ ...current, ...info });

  if (isFirebaseConfigured() && db) {
    try {
      await setDoc(doc(db, "settings", "recruitment"), updated, { merge: true });
      return;
    } catch (err) {
      firestoreWriteError("updateRecruitment", err);
    }
  }

  if (!useLocalCmsFallback()) {
    throw new Error("CMS is not configured for this environment.");
  }

  saveLocalRecruitment(updated);
}

// ──────────────────────────────────────────
// RESOURCE PAGES SERVICE
// ──────────────────────────────────────────

function getLocalResourcePages(): Record<string, ResourcePageData> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(LOCAL_RESOURCE_PAGES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalResourcePage(slug: string, page: ResourcePageData) {
  if (typeof window === "undefined") return;
  const pages = getLocalResourcePages();
  pages[slug] = page;
  localStorage.setItem(LOCAL_RESOURCE_PAGES_KEY, JSON.stringify(pages));
  window.dispatchEvent(
    new CustomEvent("cms-resource-pages-updated", { detail: { slug, page } }),
  );
}

export async function getResourcePage(
  slug: string,
): Promise<ResourcePageData | null> {
  if (isFirebaseConfigured() && db) {
    try {
      const snap = await getDoc(doc(db, "resource_pages", slug));
      if (snap.exists()) {
        return snap.data() as ResourcePageData;
      }
    } catch (err) {
      console.warn("Firestore getResourcePage failed:", err);
    }
  }

  return getLocalResourcePages()[slug] ?? null;
}

export async function saveResourcePage(
  slug: string,
  page: ResourcePageData,
): Promise<{ synced: boolean }> {
  const payload: ResourcePageData = {
    ...page,
    updatedAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured() && db) {
    try {
      await setDoc(doc(db, "resource_pages", slug), payload, { merge: true });
      return { synced: true };
    } catch (err) {
      firestoreWriteError("saveResourcePage", err);
    }
  }

  if (!useLocalCmsFallback()) {
    throw new Error("CMS is not configured for this environment.");
  }

  saveLocalResourcePage(slug, payload);
  return { synced: false };
}

// ──────────────────────────────────────────
// SEED INITIAL DATA TO FIRESTORE
// ──────────────────────────────────────────

export async function seedInitialData(): Promise<{
  postsCount: number;
}> {
  if (isFirebaseConfigured() && db) {
    let seededPosts = 0;
    for (const post of BLOG_POSTS) {
      await setDoc(doc(db, "posts", post.id), {
        ...post,
        published: true,
        createdAt: serverTimestamp(),
      });
      seededPosts++;
    }

    await setDoc(doc(db, "settings", "recruitment"), RECRUITMENT_INFO);
    return { postsCount: seededPosts };
  }

  if (!useLocalCmsFallback()) {
    throw new Error("CMS is not configured for this environment.");
  }

  saveLocalPosts(BLOG_POSTS);
  saveLocalRecruitment(RECRUITMENT_INFO);
  return { postsCount: BLOG_POSTS.length };
}

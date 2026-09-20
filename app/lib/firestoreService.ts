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
    // In local demo mode, allow access
    return true;
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
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as BlogPost[];
      }
    } catch (err) {
      console.warn("Firestore getPosts error, falling back:", err);
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
    } catch (err) {
      console.warn("Firestore getPostById error, falling back:", err);
    }
  }
  const localPosts = getLocalPosts();
  return localPosts.find((p) => p.id === id) || null;
}

export async function getRelatedPosts(
  currentId: string,
  tag?: string,
  limitCount: number = 3
): Promise<BlogPost[]> {
  const allPosts = await getPosts();
  const published = allPosts.filter(
    (p) => p.id !== currentId && p.published !== false
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
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, "posts"));
      return onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const posts = snapshot.docs.map((d) => ({
              id: d.id,
              ...d.data(),
            })) as BlogPost[];
            callback(posts);
          } else {
            callback(getLocalPosts());
          }
        },
        (error) => {
          console.warn("Firestore subscribePosts listener error:", error);
          callback(getLocalPosts());
        }
      );
    } catch (e) {
      console.warn("Firestore subscription failed, using local posts:", e);
    }
  }

  // Local fallback subscription
  callback(getLocalPosts());
  const handler = (e: Event) => {
    const custom = e as CustomEvent<BlogPost[]>;
    callback(custom.detail || getLocalPosts());
  };
  if (typeof window !== "undefined") {
    window.addEventListener("cms-posts-updated", handler);
  }
  return () => {
    if (typeof window !== "undefined") {
      window.removeEventListener("cms-posts-updated", handler);
    }
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
      console.error("Firestore createPost failed:", err);
    }
  }

  // Local fallback
  const posts = getLocalPosts();
  const newPost: BlogPost = { id: newId, ...postData, published: postData.published ?? true };
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
      console.error("Firestore updatePost failed:", err);
    }
  }

  // Local fallback
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
      console.error("Firestore deletePost failed:", err);
    }
  }

  // Local fallback
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
    } catch (err) {
      console.warn("Firestore getRecruitment failed:", err);
    }
  }
  return getLocalRecruitment();
}

export async function updateRecruitment(info: Partial<RecruitmentInfo>): Promise<void> {
  const current = getLocalRecruitment();
  const updated = normalizeRecruitment({ ...current, ...info });

  if (isFirebaseConfigured() && db) {
    try {
      await setDoc(doc(db, "settings", "recruitment"), updated, { merge: true });
    } catch (err) {
      console.error("Firestore updateRecruitment failed:", err);
    }
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

  let synced = false;

  if (isFirebaseConfigured() && db) {
    try {
      await setDoc(doc(db, "resource_pages", slug), payload, { merge: true });
      synced = true;
    } catch (err) {
      console.error("Firestore saveResourcePage failed:", err);
    }
  }

  saveLocalResourcePage(slug, payload);

  return { synced: !isFirebaseConfigured() || synced };
}

// ──────────────────────────────────────────
// SEED INITIAL DATA TO FIRESTORE
// ──────────────────────────────────────────

export async function seedInitialData(): Promise<{
  postsCount: number;
}> {
  let seededPosts = 0;

  if (isFirebaseConfigured() && db) {
    for (const post of BLOG_POSTS) {
      await setDoc(doc(db, "posts", post.id), {
        ...post,
        published: true,
        createdAt: serverTimestamp(),
      });
      seededPosts++;
    }

    await setDoc(doc(db, "settings", "recruitment"), RECRUITMENT_INFO);
  } else {
    saveLocalPosts(BLOG_POSTS);
    saveLocalRecruitment(RECRUITMENT_INFO);
    seededPosts = BLOG_POSTS.length;
  }

  return {
    postsCount: seededPosts,
  };
}

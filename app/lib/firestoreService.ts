import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { deleteMediaAsset } from "./storageService";
import type { BlogPost, EventItem, RecruitmentInfo } from "../types";
import { BLOG_POSTS, EVENTS, RECRUITMENT_INFO } from "../data/clubData";

const LOCAL_POSTS_KEY = "o365_cms_posts";
const LOCAL_EVENTS_KEY = "o365_cms_events";
const LOCAL_RECRUITMENT_KEY = "o365_cms_recruitment";

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

function getLocalEvents(): EventItem[] {
  if (typeof window === "undefined") return EVENTS;
  try {
    const raw = localStorage.getItem(LOCAL_EVENTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Upgrade legacy cache if missing status
        const hasStatus = parsed.some((e: EventItem) => e.status);
        if (hasStatus) return parsed;
      }
    }
    localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(EVENTS));
    return EVENTS;
  } catch {
    return EVENTS;
  }
}

function saveLocalEvents(events: EventItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(events));
  window.dispatchEvent(new CustomEvent("cms-events-updated", { detail: events }));
}

function getLocalRecruitment(): RecruitmentInfo {
  if (typeof window === "undefined") return RECRUITMENT_INFO;
  try {
    const raw = localStorage.getItem(LOCAL_RECRUITMENT_KEY);
    if (raw) return JSON.parse(raw);
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
      console.warn("Firestore subscription failed, using local events:", e);
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
// EVENTS SERVICE
// ──────────────────────────────────────────

export async function getEvents(): Promise<EventItem[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, "events"));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as EventItem[];
      }
    } catch (err) {
      console.warn("Firestore getEvents error, falling back:", err);
    }
  }
  return getLocalEvents();
}

export function subscribeEvents(callback: (events: EventItem[]) => void): () => void {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, "events"));
      return onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const events = snapshot.docs.map((d) => ({
              id: d.id,
              ...d.data(),
            })) as EventItem[];
            callback(events);
          } else {
            callback(getLocalEvents());
          }
        },
        (error) => {
          console.warn("Firestore subscribeEvents listener error:", error);
          callback(getLocalEvents());
        }
      );
    } catch (e) {
      console.warn("Firestore events subscription failed:", e);
    }
  }

  // Local fallback
  callback(getLocalEvents());
  const handler = (e: Event) => {
    const custom = e as CustomEvent<EventItem[]>;
    callback(custom.detail || getLocalEvents());
  };
  if (typeof window !== "undefined") {
    window.addEventListener("cms-events-updated", handler);
  }
  return () => {
    if (typeof window !== "undefined") {
      window.removeEventListener("cms-events-updated", handler);
    }
  };
}

export async function createEvent(eventData: Omit<EventItem, "id">): Promise<string> {
  const newId = `event-${Date.now()}`;
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = await addDoc(collection(db, "events"), {
        ...eventData,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      console.error("Firestore createEvent failed:", err);
    }
  }

  const events = getLocalEvents();
  const newEvent: EventItem = { id: newId, ...eventData };
  saveLocalEvents([...events, newEvent]);
  return newId;
}

export async function updateEvent(id: string, eventData: Partial<EventItem>): Promise<void> {
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, "events", id);
      await updateDoc(docRef, {
        ...eventData,
        updatedAt: serverTimestamp(),
      });
      return;
    } catch (err) {
      console.error("Firestore updateEvent failed:", err);
    }
  }

  const events = getLocalEvents();
  const updated = events.map((e) => (e.id === id ? { ...e, ...eventData } : e));
  saveLocalEvents(updated);
}

export async function deleteEvent(id: string): Promise<void> {
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, "events", id);
      await deleteDoc(docRef);
      return;
    } catch (err) {
      console.error("Firestore deleteEvent failed:", err);
    }
  }

  const events = getLocalEvents();
  saveLocalEvents(events.filter((e) => e.id !== id));
}

export async function incrementEventReaction(
  id: string,
  reactionKey: string
): Promise<void> {
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, "events", id);
      await updateDoc(docRef, {
        [`reactions.${reactionKey}`]: increment(1),
        updatedAt: serverTimestamp(),
      });
      return;
    } catch (err) {
      console.warn("Firestore incrementEventReaction failed, using local fallback:", err);
    }
  }

  const events = getLocalEvents();
  const updated = events.map((e) => {
    if (e.id !== id) return e;
    const prev = e.reactions || {};
    return {
      ...e,
      reactions: {
        ...prev,
        [reactionKey]: (prev[reactionKey] || 0) + 1,
      },
    };
  });
  saveLocalEvents(updated);
}

// ──────────────────────────────────────────
// RECRUITMENT & SETTINGS SERVICE
// ──────────────────────────────────────────

export async function getRecruitment(): Promise<RecruitmentInfo> {
  if (isFirebaseConfigured() && db) {
    try {
      const snap = await getDoc(doc(db, "settings", "recruitment"));
      if (snap.exists()) {
        return snap.data() as RecruitmentInfo;
      }
    } catch (err) {
      console.warn("Firestore getRecruitment failed:", err);
    }
  }
  return getLocalRecruitment();
}

export async function updateRecruitment(info: Partial<RecruitmentInfo>): Promise<void> {
  if (isFirebaseConfigured() && db) {
    try {
      await setDoc(doc(db, "settings", "recruitment"), info, { merge: true });
      return;
    } catch (err) {
      console.error("Firestore updateRecruitment failed:", err);
    }
  }

  const current = getLocalRecruitment();
  const updated = { ...current, ...info };
  saveLocalRecruitment(updated);
}

// ──────────────────────────────────────────
// SEED INITIAL DATA TO FIRESTORE
// ──────────────────────────────────────────

export async function seedInitialData(): Promise<{ postsCount: number; eventsCount: number }> {
  let seededPosts = 0;
  let seededEvents = 0;

  if (isFirebaseConfigured() && db) {
    for (const post of BLOG_POSTS) {
      await setDoc(doc(db, "posts", post.id), {
        ...post,
        published: true,
        createdAt: serverTimestamp(),
      });
      seededPosts++;
    }

    for (const ev of EVENTS) {
      await setDoc(doc(db, "events", ev.id), {
        ...ev,
        createdAt: serverTimestamp(),
      });
      seededEvents++;
    }

    await setDoc(doc(db, "settings", "recruitment"), RECRUITMENT_INFO);
  } else {
    saveLocalPosts(BLOG_POSTS);
    saveLocalEvents(EVENTS);
    saveLocalRecruitment(RECRUITMENT_INFO);
    seededPosts = BLOG_POSTS.length;
    seededEvents = EVENTS.length;
  }

  return { postsCount: seededPosts, eventsCount: seededEvents };
}

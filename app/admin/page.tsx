"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  auth,
  googleProvider,
  isFirebaseConfigured,
} from "@/app/lib/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  subscribePosts,
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  subscribeEvents,
  getRecruitment,
  updateRecruitment,
  seedInitialData,
  checkIsAdmin,
} from "@/app/lib/firestoreService";
import type { BlogPost, EventItem, RecruitmentInfo } from "@/app/types";
import PostEditorModal from "./components/PostEditorModal";
import EventEditorModal from "./components/EventEditorModal";
import {
  FileText,
  Calendar,
  Settings,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  LogOut,
  Sparkles,
  Database,
  ArrowLeft,
  CheckCircle2,
  Search,
  Lock,
  Mail,
  User as UserIcon,
  RefreshCw,
} from "lucide-react";

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [demoLoggedIn, setDemoLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Form login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active dashboard tab
  const [activeTab, setActiveTab] = useState<"posts" | "events" | "settings">("posts");

  // Data states
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [recruitment, setRecruitment] = useState<RecruitmentInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Modals state
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  // Seeding state feedback
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState<string | null>(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Check auth state
  useEffect(() => {
    if (isFirebaseConfigured() && auth) {
      const unsub = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          setAuthLoading(true);
          const isAdmin = await checkIsAdmin(currentUser.uid);
          if (isAdmin) {
            setUser(currentUser);
            setLoginError("");
          } else {
            if (auth) {
              await signOut(auth);
            }
            setUser(null);
            setLoginError(
              `Tài khoản (${currentUser.email || currentUser.uid}) chưa được cấp quyền Quản trị viên trong hệ thống.`
            );
          }
        } else {
          setUser(null);
        }
        setAuthLoading(false);
      });
      return () => unsub();
    } else {
      // In demo mode without API keys: check local session
      const savedDemo = localStorage.getItem("o365_admin_demo_logged_in");
      if (savedDemo === "true") {
        setDemoLoggedIn(true);
      }
      setAuthLoading(false);
    }
  }, []);

  // Subscribe to live posts and events
  useEffect(() => {
    const unsubPosts = subscribePosts((livePosts) => {
      setPosts(livePosts);
    });

    const unsubEvents = subscribeEvents((liveEvents) => {
      setEvents(liveEvents);
    });

    getRecruitment().then(setRecruitment);

    return () => {
      unsubPosts();
      unsubEvents();
    };
  }, []);

  // Handle Firebase Email Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    if (isFirebaseConfigured() && auth) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err: any) {
        setLoginError(err.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản.");
      } finally {
        setIsLoggingIn(false);
      }
    } else {
      // Demo login
      setDemoLoggedIn(true);
      localStorage.setItem("o365_admin_demo_logged_in", "true");
      setIsLoggingIn(false);
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    setLoginError("");
    if (isFirebaseConfigured() && auth && googleProvider) {
      try {
        await signInWithPopup(auth, googleProvider);
      } catch (err: any) {
        setLoginError(err.message || "Đăng nhập với Google thất bại.");
      }
    } else {
      setDemoLoggedIn(true);
      localStorage.setItem("o365_admin_demo_logged_in", "true");
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    if (isFirebaseConfigured() && auth) {
      await signOut(auth);
    }
    setDemoLoggedIn(false);
    localStorage.removeItem("o365_admin_demo_logged_in");
  };

  // Post Actions
  const handleSavePost = async (postData: Omit<BlogPost, "id">, id?: string) => {
    if (id) {
      await updatePost(id, postData);
    } else {
      await createPost(postData);
    }
  };

  const handleDeletePost = async (id: string, title: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa bài viết: "${title}"?`)) {
      await deletePost(id);
    }
  };

  // Event Actions
  const handleSaveEvent = async (eventData: Omit<EventItem, "id">, id?: string) => {
    if (id) {
      await updateEvent(id, eventData);
    } else {
      await createEvent(eventData);
    }
  };

  const handleDeleteEvent = async (id: string, title: string) => {
    if (confirm(`Bạn có chắc muốn xóa sự kiện: "${title}"?`)) {
      await deleteEvent(id);
    }
  };

  // Seed Initial Data
  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      const res = await seedInitialData();
      setSeedSuccess(`Đã nạp thành công ${res.postsCount} bài viết và ${res.eventsCount} sự kiện!`);
      setTimeout(() => setSeedSuccess(null), 4000);
    } finally {
      setIsSeeding(false);
    }
  };

  // Save Recruitment Settings
  const handleSaveRecruitment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recruitment) return;
    setIsSavingSettings(true);
    try {
      await updateRecruitment(recruitment);
      setSeedSuccess("Đã lưu thông tin tuyển quân thành công!");
      setTimeout(() => setSeedSuccess(null), 3000);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const isAuthenticated = Boolean(user || demoLoggedIn);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-ink">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Đang tải CMS...</span>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────
  // LOGIN SCREEN (Notion Style)
  // ──────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-[var(--bg)] select-none">
        <div className="w-full max-w-md p-8 rounded-3xl bg-surface border border-border shadow-card">
          {/* Brand Logo & Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-card border border-border mx-auto flex items-center justify-center text-ink mb-3 shadow-2xs">
              <Lock className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-2xl font-extrabold text-ink tracking-tight">
              CLB o365 • Quản Trị CMS
            </h1>
            <p className="text-xs text-ink-light mt-1">
              Đại sứ Chuyển đổi số Đại học Bách khoa Hà Nội
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {loginError}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Email Quản Trị
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@hust.edu.vn"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                Mật Khẩu
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 rounded-xl bg-ink text-surface text-sm font-semibold hover:bg-ink/90 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isLoggingIn
                ? "Đang xác thực..."
                : isFirebaseConfigured()
                ? "Đăng nhập với Email"
                : "Đăng nhập Quản trị (Demo)"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[11px] font-mono text-ink-muted uppercase">hoặc</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full py-2.5 px-4 rounded-xl border border-border bg-surface hover:bg-card text-ink text-sm font-semibold flex items-center justify-center gap-2.5 transition-colors shadow-2xs cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Đăng nhập với Google</span>
          </button>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-ink-light hover:text-ink transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại trang chủ website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filtered posts
  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ──────────────────────────────────────────
  // DASHBOARD WORKSPACE (Authenticated)
  // ──────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[var(--bg)] text-ink flex flex-col select-none">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-border/80 px-5 sm:px-8 py-3.5">
        <div className="max-w-[var(--max-width)] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-1.5 rounded-lg border border-border text-ink-muted hover:text-ink hover:bg-card transition-colors"
              title="Quay lại website"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-lg text-ink tracking-tight">
                  CLB o365 • CMS Dashboard
                </h1>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                    isFirebaseConfigured()
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isFirebaseConfigured() ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                  {isFirebaseConfigured() ? "Firestore Live" : "Demo Mode"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Seed Data Button */}
            <button
              onClick={handleSeed}
              disabled={isSeeding}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface hover:bg-card text-xs font-semibold text-ink transition-colors shadow-2xs cursor-pointer"
              title="Khôi phục lại bài viết và sự kiện mẫu từ clubData"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-accent ${isSeeding ? "animate-spin" : ""}`} />
              <span>{isSeeding ? "Đang nạp..." : "Nạp Dữ Liệu Mẫu"}</span>
            </button>

            {/* User Profile & Logout */}
            <div className="flex items-center gap-2 pl-3 border-l border-border">
              <div className="w-7 h-7 rounded-full bg-accent/20 text-ink font-bold text-xs flex items-center justify-center">
                {user?.email?.charAt(0).toUpperCase() || "A"}
              </div>
              <span className="hidden md:inline text-xs font-medium text-ink-light">
                {user?.email || "Admin Demo"}
              </span>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-ink-muted hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[var(--max-width)] w-full mx-auto px-5 sm:px-8 py-8">
        {/* Seed feedback banner */}
        {seedSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{seedSuccess}</span>
          </div>
        )}

        {/* Tab Navigation & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-surface border border-border shadow-2xs self-start">
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "posts"
                  ? "bg-ink text-surface shadow-xs"
                  : "text-ink-muted hover:text-ink hover:bg-card"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Bài Viết Blog ({posts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("events")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "events"
                  ? "bg-ink text-surface shadow-xs"
                  : "text-ink-muted hover:text-ink hover:bg-card"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Sự Kiện ({events.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "settings"
                  ? "bg-ink text-surface shadow-xs"
                  : "text-ink-muted hover:text-ink hover:bg-card"
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Tuyển Quân &amp; Cài Đặt</span>
            </button>
          </div>

          {/* Action Buttons & Search */}
          <div className="flex items-center gap-3">
            {activeTab === "posts" && (
              <>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm bài viết..."
                    className="pl-8 pr-3 py-1.5 rounded-xl border border-border bg-surface text-xs text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
                <button
                  onClick={() => {
                    setEditingPost(null);
                    setPostModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ink text-surface text-xs font-semibold hover:bg-ink/90 transition-colors shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Bài viết mới</span>
                </button>
              </>
            )}

            {activeTab === "events" && (
              <button
                onClick={() => {
                  setEditingEvent(null);
                  setEventModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ink text-surface text-xs font-semibold hover:bg-ink/90 transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm sự kiện</span>
              </button>
            )}
          </div>
        </div>

        {/* ────────────────────────────────────────── */}
        {/* TAB 1: BLOG POSTS LIST */}
        {/* ────────────────────────────────────────── */}
        {activeTab === "posts" && (
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-surface border border-border">
                <FileText className="w-8 h-8 text-ink-muted mx-auto mb-2 opacity-50" />
                <p className="font-semibold text-sm text-ink">Chưa có bài viết nào</p>
                <p className="text-xs text-ink-muted mt-1">
                  Nhấn &quot;Bài viết mới&quot; hoặc &quot;Nạp Dữ Liệu Mẫu&quot; để bắt đầu.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex flex-col justify-between rounded-2xl bg-surface border border-border p-5 shadow-card hover:shadow-md transition-all group"
                  >
                    <div>
                      {/* Thumbnail & Badges */}
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-card mb-4 border border-border">
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://via.placeholder.com/400x225?text=o365";
                          }}
                        />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-surface/90 backdrop-blur-xs text-ink border border-border">
                          {post.tag}
                        </span>
                        <span
                          className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            post.published !== false
                              ? "bg-emerald-500/90 text-surface"
                              : "bg-amber-500/90 text-surface"
                          }`}
                        >
                          {post.published !== false ? "Xuất bản" : "Bản nháp"}
                        </span>
                      </div>

                      <div className="text-[11px] text-ink-muted font-mono mb-1">
                        {post.date} • {post.author || "o365"}
                      </div>
                      <h3 className="font-bold text-base text-ink tracking-tight line-clamp-2 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-ink-light leading-relaxed line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-3 border-t border-border/70 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-ink-muted">
                        ID: {post.id.slice(0, 8)}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingPost(post);
                            setPostModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-card transition-colors cursor-pointer"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id, post.title)}
                          className="p-1.5 rounded-lg text-ink-muted hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Xóa bài viết"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ────────────────────────────────────────── */}
        {/* TAB 2: EVENTS LIST */}
        {/* ────────────────────────────────────────── */}
        {activeTab === "events" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-surface shadow-card overflow-hidden">
              <div className="divide-y divide-border/80">
                {events.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-card/40 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <span className="px-3 py-1 rounded-xl bg-card border border-border text-xs font-mono font-bold text-ink shrink-0">
                        {ev.month}
                      </span>
                      <div>
                        <h4 className="font-bold text-sm text-ink mb-1">{ev.title}</h4>
                        {ev.description && (
                          <p className="text-xs text-ink-light mb-1.5">{ev.description}</p>
                        )}
                        {ev.location && (
                          <span className="text-[11px] text-ink-muted font-mono">
                            📍 {ev.location}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                      {ev.linkUrl && ev.linkUrl !== "#" && (
                        <a
                          href={ev.linkUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-accent font-medium hover:underline flex items-center gap-1"
                        >
                          <span>{ev.linkLabel || "Xem link"}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      <button
                        onClick={() => {
                          setEditingEvent(ev);
                          setEventModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-card transition-colors cursor-pointer"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(ev.id, ev.title)}
                        className="p-1.5 rounded-lg text-ink-muted hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Xóa sự kiện"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────── */}
        {/* TAB 3: RECRUITMENT & CLUB SETTINGS */}
        {/* ────────────────────────────────────────── */}
        {activeTab === "settings" && recruitment && (
          <div className="max-w-2xl mx-auto rounded-2xl bg-surface border border-border p-6 sm:p-8 shadow-card">
            <h3 className="font-bold text-lg text-ink tracking-tight mb-1">
              Cài Đặt Đợt Tuyển Quân (Recruitment)
            </h3>
            <p className="text-xs text-ink-light mb-6">
              Thay đổi tiêu đề chiến dịch, hạn nộp đơn và link Microsoft Forms
            </p>

            <form onSubmit={handleSaveRecruitment} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                  Tên Chiến Dịch Tuyển Quân
                </label>
                <input
                  type="text"
                  value={recruitment.campaignName}
                  onChange={(e) =>
                    setRecruitment({ ...recruitment, campaignName: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                    Thế Hệ / Generation
                  </label>
                  <input
                    type="text"
                    value={recruitment.generation}
                    onChange={(e) =>
                      setRecruitment({ ...recruitment, generation: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                    Hạn Nộp Đơn (Hiển thị)
                  </label>
                  <input
                    type="text"
                    value={recruitment.deadlineDisplay}
                    onChange={(e) =>
                      setRecruitment({ ...recruitment, deadlineDisplay: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                  Đường Dẫn Đơn Đăng Ký (Form URL)
                </label>
                <input
                  type="url"
                  value={recruitment.formUrl}
                  onChange={(e) =>
                    setRecruitment({ ...recruitment, formUrl: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>

              <div className="pt-4 border-t border-border flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="px-5 py-2.5 rounded-xl bg-ink text-surface text-xs font-semibold hover:bg-ink/90 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSavingSettings ? "Đang lưu..." : "Lưu Cài Đặt"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Modals */}
      <PostEditorModal
        isOpen={postModalOpen}
        post={editingPost}
        onClose={() => setPostModalOpen(false)}
        onSave={handleSavePost}
      />

      <EventEditorModal
        isOpen={eventModalOpen}
        event={editingEvent}
        onClose={() => setEventModalOpen(false)}
        onSave={handleSaveEvent}
      />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { auth, isFirebaseConfigured } from "@/app/lib/firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import {
  createPost,
  updatePost,
  deletePost,
  subscribePosts,
  getRecruitment,
  updateRecruitment,
  seedInitialData,
  checkIsAdmin,
} from "@/app/lib/firestoreService";
import type { BlogPost, RecruitmentInfo } from "@/app/types";
import PostEditorModal from "./components/PostEditorModal";
import {
  FileText,
  Settings,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  LogOut,
  ArrowLeft,
  CheckCircle2,
  Search,
  Lock,
  Mail,
  RefreshCw,
  Folder,
} from "lucide-react";
import { DOCUMENT_CATEGORIES } from "@/app/data/clubData";

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
  const [activeTab, setActiveTab] = useState<"posts" | "settings" | "documents">(
    "posts",
  );

  // Data states
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [recruitment, setRecruitment] = useState<RecruitmentInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Modals state
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

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

  // Subscribe to live posts
  useEffect(() => {
    const unsubPosts = subscribePosts((livePosts) => {
      setPosts(livePosts);
    });

    getRecruitment().then(setRecruitment);

    return () => {
      unsubPosts();
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

  // Seed Initial Data
  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      const res = await seedInitialData();
      setSeedSuccess(`Đã nạp thành công ${res.postsCount} bài viết mẫu!`);
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
              title="Khôi phục lại bài viết mẫu từ clubData"
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
              onClick={() => setActiveTab("documents")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "documents"
                  ? "bg-ink text-surface shadow-xs"
                  : "text-ink-muted hover:text-ink hover:bg-card"
              }`}
            >
              <Folder className="w-3.5 h-3.5" />
              <span>Thư Viện Tài Liệu ({DOCUMENT_CATEGORIES.length})</span>
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
                <Link
                  href="/admin/editor"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ink text-surface text-xs font-semibold hover:bg-ink/90 transition-colors shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Bài viết mới</span>
                </Link>
              </>
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
                        <Link
                          href={`/admin/editor?id=${post.id}`}
                          className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-card transition-colors cursor-pointer"
                          title="Chỉnh sửa bài viết"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
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
        {/* TAB 4: DOCUMENT LIBRARY */}
        {/* ────────────────────────────────────────── */}
        {activeTab === "documents" && (
          <div className="max-w-4xl mx-auto rounded-2xl bg-surface border border-border p-6 sm:p-8 shadow-card">
            <h3 className="font-bold text-lg text-ink tracking-tight mb-1">
              Thư Viện Tài Liệu
            </h3>
            <p className="text-xs text-ink-light mb-6">
              Chỉnh sửa nội dung, tệp đính kèm và xem trước trực tiếp giống trình
              soạn bài viết. Mỗi chuyên mục mở trong trang editor riêng.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {DOCUMENT_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className="flex flex-col p-5 rounded-2xl bg-card border border-border/60 hover:border-accent/40 hover:shadow-md transition-all duration-300 group"
                >
                  <h4 className="font-bold text-ink mb-1.5 group-hover:text-accent transition-colors">
                    {cat.title}
                  </h4>
                  <p className="text-xs text-ink-muted mb-5 flex-1 line-clamp-3">
                    {cat.description}
                  </p>

                  <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-2">
                    <Link
                      href={`/resources/${cat.id}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-semibold text-ink-muted hover:text-ink hover:bg-surface transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Xem trang
                    </Link>
                    <Link
                      href={`/admin/resource-editor?slug=${cat.id}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-accent/90 transition-colors shadow-xs"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Chỉnh sửa trang</span>
                    </Link>
                  </div>
                </div>
              ))}
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
              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-border bg-card/40 cursor-pointer hover:bg-card transition-colors">
                <input
                  type="checkbox"
                  checked={recruitment.visible}
                  onChange={(e) =>
                    setRecruitment({ ...recruitment, visible: e.target.checked })
                  }
                  className="mt-0.5 w-4 h-4 rounded text-accent focus:ring-accent cursor-pointer"
                />
                <span>
                  <span className="block text-sm font-semibold text-ink">
                    Hiển thị tuyển thành viên
                  </span>
                  <span className="block text-xs text-ink-light mt-1">
                    Bật để hiện nút trên navbar, hero và mục tuyển quân ở từng
                    trang ban.
                  </span>
                </span>
              </label>

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
    </div>
  );
}

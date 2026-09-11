"use client";

import { useEffect, useState, use } from "react";
import Footer from "@/app/components/Footer";
import { DOCUMENT_CATEGORIES } from "@/app/data/clubData";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { db, auth } from "@/app/lib/firebase";
import PostEditor from "@/app/components/cms/PostEditor";
import MediaPreview, { MediaFile } from "@/app/components/cms/MediaPreview";
import TableOfContents from "@/app/components/cms/TableOfContents";
import { ChevronLeft, Edit3, Loader2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function DocumentDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const category = DOCUMENT_CATEGORIES.find(c => c.id === slug);

  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [title, setTitle] = useState(category?.title || "Tài liệu");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<MediaFile[]>([]);

  useEffect(() => {
    if (!category) {
      notFound();
      return;
    }

    // Check Authn
    const savedDemo = localStorage.getItem("o365_admin_demo_logged_in");
    if (savedDemo === "true") {
      setIsAdmin(true);
    }
    
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
        if (user) setIsAdmin(true);
      });
      return () => unsubscribe();
    }
  }, [category]);

  const fetchDocument = async () => {
    if (!db) return;
    setIsLoading(true);
    try {
      const docRef = doc(db, "resource_pages", slug);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.title) setTitle(data.title);
        if (data.content) setContent(data.content);
        if (data.attachments) setAttachments(data.attachments);
      } else {
        // Fallback content if empty
        setContent(`<p>Đang cập nhật nội dung cho chuyên mục <strong>${category?.title}</strong>.</p>`);
      }
    } catch (error) {
      console.error("Failed to fetch document", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocument();
  }, [slug]);

  if (!category) return null;

  return (
    <>
      <main className="flex-1 bg-slate-50 min-h-screen pt-24 pb-20">
        <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-8">
          
          <div className="mb-8">
            <Link 
              href="/resources"
              className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-medium text-sm mb-6"
            >
              <ChevronLeft className="w-4 h-4" /> Quay lại Thư viện
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                {title}
              </h1>
              {isAdmin && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isEditing ? "bg-slate-200 text-slate-700" : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                >
                  <Edit3 className="w-4 h-4" />
                  {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa trang"}
                </button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : isEditing ? (
            <PostEditor
              slug={slug}
              initialTitle={title}
              initialContent={content}
              initialAttachments={attachments}
              onSaveComplete={() => {
                setIsEditing(false);
                fetchDocument(); // re-fetch to show updated content
              }}
            />
          ) : (
            <div className="flex flex-col lg:flex-row gap-10 relative">
              {/* Main Content Area */}
              <div className="flex-1 min-w-0" id="document-content">
                <div 
                  className="prose-light bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 mb-10 max-w-none text-slate-800"
                  dangerouslySetInnerHTML={{ __html: content }}
                />

                {/* Attachments rendering */}
                {attachments.length > 0 && (
                  <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200">
                    <h3 className="text-2xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4">Tài liệu đính kèm</h3>
                    <div className="space-y-10">
                      {attachments.map((file) => (
                        <MediaPreview key={file.id} file={file} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar: Table of Contents */}
              <aside className="w-full lg:w-72 shrink-0 hidden md:block">
                <TableOfContents selector="#document-content" />
              </aside>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}

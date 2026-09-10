"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import PostEditor from "@/app/components/cms/PostEditor";
import { MediaFile } from "@/app/components/cms/MediaPreview";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { DOCUMENT_CATEGORIES } from "@/app/data/clubData";

interface DocumentEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
}

export default function DocumentEditorModal({
  isOpen,
  onClose,
  slug,
}: DocumentEditorModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<MediaFile[]>([]);

  useEffect(() => {
    const fetchDocument = async () => {
      if (!isOpen || !slug || !db) return;
      
      setIsLoading(true);
      try {
        const docRef = doc(db, "resource_pages", slug);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || "");
          setContent(data.content || "");
          setAttachments(data.attachments || []);
        } else {
          // Defaults if not created yet
          const defaultCat = DOCUMENT_CATEGORIES.find(c => c.id === slug);
          setTitle(defaultCat?.title || "");
          setContent("");
          setAttachments([]);
        }
      } catch (err) {
        console.error("Error fetching doc:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [isOpen, slug]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/30 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-3xl bg-surface border border-border shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80">
          <h3 className="font-bold text-base text-ink">
            Chỉnh sửa tài liệu: {slug}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-ink-muted hover:text-ink hover:bg-card flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-0 relative">
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center min-h-[400px]">
              <Loader2 className="w-8 h-8 text-accent animate-spin mb-4" />
              <p className="text-sm font-medium text-ink-muted">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <PostEditor
              slug={slug}
              initialTitle={title}
              initialContent={content}
              initialAttachments={attachments}
              onSaveComplete={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}

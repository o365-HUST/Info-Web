"use client";

import { useState, useCallback, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Save, Trash2, GripVertical, FileUp, X } from "lucide-react";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { storage, db } from "@/app/lib/firebase";
import { Reorder } from "motion/react";
import type { MediaFile, MediaType } from "./MediaPreview";

interface PostEditorProps {
  slug: string;
  initialTitle: string;
  initialContent: string;
  initialAttachments: MediaFile[];
  onSaveComplete: () => void;
}

export default function PostEditor({ slug, initialTitle, initialContent, initialAttachments, onSaveComplete }: PostEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [attachments, setAttachments] = useState<MediaFile[]>(initialAttachments);
  const [uploadingFiles, setUploadingFiles] = useState<{ id: string, name: string, progress: number }[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension,
      LinkExtension.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Nhập nội dung tài liệu..." }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: "prose-light max-w-none focus:outline-none min-h-[400px] px-4 py-6 bg-white text-slate-800 border border-slate-200 rounded-b-xl",
      },
    },
  });

  const detectMediaType = (fileName: string): MediaType => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (!ext) return "other";
    
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return "image";
    if (["mp4", "webm", "mov"].includes(ext)) return "video";
    if (["pdf"].includes(ext)) return "pdf";
    if (["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext)) return "office";
    
    return "other";
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !storage) return;
    
    const files = Array.from(e.target.files);
    
    files.forEach((file) => {
      const uploadId = Math.random().toString(36).substring(7);
      
      setUploadingFiles((prev) => [...prev, { id: uploadId, name: file.name, progress: 0 }]);
      
      const storageRef = ref(storage!, `documents/${slug}/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadingFiles((prev) => 
            prev.map(item => item.id === uploadId ? { ...item, progress } : item)
          );
        },
        (error) => {
          console.error("Upload failed", error);
          setUploadingFiles((prev) => prev.filter(item => item.id !== uploadId));
          alert(`Lỗi khi tải lên file: ${file.name}`);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            const newMedia: MediaFile = {
              id: uploadId,
              name: file.name,
              url: downloadURL,
              type: detectMediaType(file.name),
              size: file.size,
            };
            
            setAttachments((prev) => [...prev, newMedia]);
            setUploadingFiles((prev) => prev.filter(item => item.id !== uploadId));
          });
        }
      );
    });

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeleteAttachment = async (fileToDelete: MediaFile) => {
    if (!confirm(`Bạn có chắc muốn xóa file ${fileToDelete.name}?`)) return;
    
    // Optimistically remove from UI
    setAttachments((prev) => prev.filter(f => f.id !== fileToDelete.id));

    if (!storage) return;

    try {
      // Create a reference from the URL
      const fileRef = ref(storage, fileToDelete.url);
      await deleteObject(fileRef);
    } catch (error) {
      console.error("Failed to delete file from storage", error);
      // It might be a bad URL or already deleted, not failing the UX completely.
    }
  };

  const handleSave = async () => {
    if (!db || !editor) return;
    setIsSaving(true);
    
    try {
      const content = editor.getHTML();
      
      // Save to Firestore
      const docRef = doc(db, "resource_pages", slug);
      await setDoc(docRef, {
        title,
        content,
        attachments,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      onSaveComplete();
    } catch (error) {
      console.error("Failed to save post", error);
      alert("Lỗi khi lưu tài liệu. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!editor) return <div className="p-8 text-center text-slate-500">Đang tải bộ soạn thảo...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
        <h2 className="font-bold text-slate-800">Chế độ chỉnh sửa (Admin)</h2>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>

      <div className="p-6">
        {/* Title Input */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Tiêu đề trang</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold text-lg"
            placeholder="Nhập tiêu đề..."
          />
        </div>

        {/* Editor */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Nội dung</label>
          <div className="bg-slate-50 border border-b-0 border-slate-200 rounded-t-xl p-2 flex flex-wrap gap-1 sticky top-0 z-10">
            <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded hover:bg-slate-200 ${editor.isActive("bold") ? "bg-slate-200 text-blue-600" : "text-slate-600"}`} title="In đậm"><Bold className="w-4 h-4" /></button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded hover:bg-slate-200 ${editor.isActive("italic") ? "bg-slate-200 text-blue-600" : "text-slate-600"}`} title="In nghiêng"><Italic className="w-4 h-4" /></button>
            <div className="w-px h-6 bg-slate-300 mx-1 self-center" />
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`px-2 py-1 text-sm font-bold rounded hover:bg-slate-200 ${editor.isActive("heading", { level: 2 }) ? "bg-slate-200 text-blue-600" : "text-slate-600"}`}>H2</button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`px-2 py-1 text-sm font-bold rounded hover:bg-slate-200 ${editor.isActive("heading", { level: 3 }) ? "bg-slate-200 text-blue-600" : "text-slate-600"}`}>H3</button>
            <div className="w-px h-6 bg-slate-300 mx-1 self-center" />
            <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded hover:bg-slate-200 ${editor.isActive("bulletList") ? "bg-slate-200 text-blue-600" : "text-slate-600"}`}><List className="w-4 h-4" /></button>
            <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 rounded hover:bg-slate-200 ${editor.isActive("orderedList") ? "bg-slate-200 text-blue-600" : "text-slate-600"}`}><ListOrdered className="w-4 h-4" /></button>
            <div className="w-px h-6 bg-slate-300 mx-1 self-center" />
            <button onClick={() => {
              const url = window.prompt("URL:");
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }} className="p-2 rounded hover:bg-slate-200 text-slate-600"><LinkIcon className="w-4 h-4" /></button>
            <button onClick={() => {
              const url = window.prompt("Image URL:");
              if (url) editor.chain().focus().setImage({ src: url }).run();
            }} className="p-2 rounded hover:bg-slate-200 text-slate-600"><ImageIcon className="w-4 h-4" /></button>
          </div>
          <EditorContent editor={editor} />
        </div>

        {/* Attachments Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-semibold text-slate-700">Tệp đính kèm</label>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors font-medium"
            >
              <FileUp className="w-4 h-4" />
              Thêm file
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              multiple
            />
          </div>

          {/* Upload Progress */}
          {uploadingFiles.length > 0 && (
            <div className="mb-4 space-y-2">
              {uploadingFiles.map(file => (
                <div key={file.id} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="truncate text-slate-700 font-medium">{file.name}</span>
                    <span className="text-slate-500 text-xs">{Math.round(file.progress)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${file.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Draggable Attachment List */}
          {attachments.length > 0 ? (
            <Reorder.Group axis="y" values={attachments} onReorder={setAttachments} className="space-y-2">
              {attachments.map((file) => (
                <Reorder.Item 
                  key={file.id} 
                  value={file}
                  className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-3 shadow-sm"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <GripVertical className="w-5 h-5 text-slate-400 cursor-grab active:cursor-grabbing shrink-0" />
                    <span className="font-medium text-slate-700 text-sm truncate">{file.name}</span>
                    <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-500 uppercase tracking-wider font-bold">
                      {file.type}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteAttachment(file)}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors shrink-0"
                    title="Xóa tệp"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
              Chưa có tệp đính kèm. Kéo thả file vào đây hoặc bấm "Thêm file".
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

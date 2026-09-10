import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { DOCUMENT_CATEGORIES } from "@/app/data/clubData";
import Link from "next/link";
import { DownloadCloud, MessageSquare, CalendarDays, BookOpen, ChevronRight, Search } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thư viện tài liệu | CLB o365 - HUST",
  description: "Tổng hợp các hướng dẫn cài đặt, tài liệu ôn thi MOS và cẩm nang kỹ năng phần mềm độc quyền.",
};

const iconMap: Record<string, React.ReactNode> = {
  DownloadCloud: <DownloadCloud className="w-8 h-8" />,
  MessageSquare: <MessageSquare className="w-8 h-8" />,
  CalendarDays: <CalendarDays className="w-8 h-8" />,
  BookOpen: <BookOpen className="w-8 h-8" />,
};

export default function DocumentLibraryPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-slate-50 min-h-screen pt-24 pb-20">
        <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-8">
          
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Thư viện tài liệu
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl">
              Nơi lưu trữ và chia sẻ các tài liệu nội bộ, hướng dẫn kỹ năng số và tài nguyên học tập dành riêng cho sinh viên Bách Khoa.
            </p>
          </div>

          {/* Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {DOCUMENT_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/thu-vien-tai-lieu/${cat.id}`}
                className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-50 group-hover:bg-blue-100 transition-colors pointer-events-none" />
                
                <div className="flex items-start justify-between gap-4 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                    {iconMap[cat.icon]}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>

                <div className="mt-6 relative z-10">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}


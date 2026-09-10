import Link from "next/link";
import { DOCUMENT_CATEGORIES } from "@/app/data/clubData";
import { Folder, ArrowRight, DownloadCloud, MessageSquare, CalendarDays, BookOpen } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  DownloadCloud: <DownloadCloud className="w-6 h-6" />,
  MessageSquare: <MessageSquare className="w-6 h-6" />,
  CalendarDays: <CalendarDays className="w-6 h-6" />,
  BookOpen: <BookOpen className="w-6 h-6" />,
};

export default function DocumentSection() {
  return (
    <section id="documents" className="py-20 relative overflow-hidden bg-slate-50">
      <div className="max-w-[var(--max-width)] mx-auto px-5 sm:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 text-blue-700 text-sm font-semibold mb-4 border border-blue-200">
              <Folder className="w-4 h-4" />
              <span>Thư viện tài liệu</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Nền tảng kiến thức số Bách Khoa
            </h2>
            <p className="text-lg text-slate-600">
              Tổng hợp các hướng dẫn cài đặt, tài liệu ôn thi MOS và cẩm nang kỹ năng phần mềm độc quyền từ CLB o365 - HUST.
            </p>
          </div>
          <Link
            href="/thu-vien-tai-lieu"
            className="shrink-0 inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
          >
            Xem toàn bộ thư viện
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DOCUMENT_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/thu-vien-tai-lieu/${cat.id}`}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-200 transition-all group flex flex-col h-full"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                {iconMap[cat.icon] || <Folder className="w-6 h-6" />}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                {cat.title}
              </h3>
              <p className="text-slate-600 text-sm flex-1">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


import Footer from "../components/Footer";
import ResourceExplorer from "./components/ResourceExplorer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thư viện tài liệu | CLB o365 - HUST",
  description:
    "Tổng hợp hướng dẫn Office 365, Teams, biểu mẫu học tập và tài liệu MOS dành cho sinh viên ĐHBK Hà Nội.",
};

export default function DocumentLibraryPage() {
  return (
    <>
      <main className="flex-1 min-h-screen bg-[var(--bg)]">
        <ResourceExplorer />
      </main>
      <Footer />
    </>
  );
}

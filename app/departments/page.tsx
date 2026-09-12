import type { Metadata } from "next";
import Departments from "@/app/components/Departments";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "Cơ cấu ban | CLB o365 - HUST",
  description:
    "Khám phá các ban chuyên trách của CLB o365 - HUST: Ban Chủ nhiệm, Chuyên môn, Truyền thông, Sự kiện và Tài chính.",
};

export default function DepartmentsPage() {
  return (
    <>
      <main className="flex-1 min-h-screen bg-[var(--bg)]">
        <Departments />
      </main>
      <Footer />
    </>
  );
}

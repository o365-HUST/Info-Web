import type { Metadata } from "next";
import MilestoneTimeline from "@/app/components/MilestoneTimeline";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "Hành trình o365 | CLB o365 - HUST",
  description:
    "Hành trình lịch sử CLB o365 - các cột mốc, thành tích và cựu thành viên tiêu biểu tại Đại học Bách khoa Hà Nội.",
};

export default function StoryPage() {
  return (
    <>
      <main className="flex-1 min-h-screen bg-[var(--bg)]">
        <MilestoneTimeline />
      </main>
      <Footer />
    </>
  );
}

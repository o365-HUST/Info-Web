import type { Metadata } from "next";
import EventsTimeline from "@/app/components/EventsTimeline";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "Sự kiện | CLB o365 - HUST",
  description:
    "Lịch hoạt động, workshop, MOSWC và các chương trình tích lũy ĐRL của CLB o365 - Đại học Bách khoa Hà Nội.",
};

export default function EventsPage() {
  return (
    <>
      <main className="flex-1 min-h-screen bg-[var(--bg)]">
        <EventsTimeline />
      </main>
      <Footer />
    </>
  );
}

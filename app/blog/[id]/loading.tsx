import PostContentSkeleton from "../components/PostContentSkeleton";
import Footer from "@/app/components/Footer";

export default function PostLoading() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-ink flex flex-col">
      <main className="flex-1">
        <PostContentSkeleton />
      </main>
      <Footer />
    </div>
  );
}

import { getPublishedPosts } from "@/app/lib/postsServer";
import BlogArchiveClient from "./BlogArchiveClient";

export const revalidate = 60;

export default async function BlogArchivePage() {
  const posts = await getPublishedPosts();
  return <BlogArchiveClient initialPosts={posts} />;
}

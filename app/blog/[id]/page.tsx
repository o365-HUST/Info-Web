import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPublishedPostById,
  getPublishedPosts,
  getRelatedPostsFromList,
} from "@/app/lib/postsServer";
import BlogPostView from "./BlogPostView";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 60;

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getPublishedPostById(id);
  if (!post) {
    return { title: "Không tìm thấy bài viết | CLB o365 - HUST" };
  }
  return {
    title: `${post.title} | CLB o365 - HUST`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.thumbnail ? [post.thumbnail] : undefined,
    },
  };
}

export default async function SinglePostPage({ params }: PostPageProps) {
  const { id } = await params;
  const post = await getPublishedPostById(id);
  if (!post) notFound();

  const allPosts = await getPublishedPosts();
  const relatedPosts = getRelatedPostsFromList(allPosts, post.id, post.tag, 3);

  return <BlogPostView post={post} relatedPosts={relatedPosts} />;
}

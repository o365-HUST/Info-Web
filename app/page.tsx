import Hero from "./components/Hero";
import AboutUs from "./components/AboutUs";
import Achievements from "./components/Achievements";
import DepartmentsTeaser from "./components/DepartmentsTeaser";
import EventsTeaser from "./components/EventsTeaser";
import BlogPosts from "./components/BlogPosts";
import Footer from "./components/Footer";
import { getPublishedPosts } from "@/app/lib/postsServer";

export const revalidate = 60;

export default async function Page() {
  const posts = await getPublishedPosts();

  return (
    <>
      <main className="flex-1">
        <Hero />
        <AboutUs />
        <Achievements />
        <DepartmentsTeaser />
        <EventsTeaser />
        <BlogPosts initialPosts={posts} />
      </main>
      <Footer />
    </>
  );
}

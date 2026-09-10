import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import GallerySection from "./components/GallerySection";
import AboutStats from "./components/AboutStats";
import Departments from "./components/Departments";
import BlogPosts from "./components/BlogPosts";
import EventsTimeline from "./components/EventsTimeline";
import DocumentSection from "./components/DocumentSection";
import Footer from "./components/Footer";

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <GallerySection />
        <AboutStats />
        <Departments />
        <DocumentSection />
        <BlogPosts />
        <EventsTimeline />
      </main>
      <Footer />
    </>
  );
}

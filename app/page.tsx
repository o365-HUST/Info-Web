import Hero from "./components/Hero";
import AboutUs from "./components/AboutUs";
import Achievements from "./components/Achievements";
import DepartmentsTeaser from "./components/DepartmentsTeaser";
import EventsTeaser from "./components/EventsTeaser";
import BlogPosts from "./components/BlogPosts";
import DocumentSection from "./components/DocumentSection";
import Footer from "./components/Footer";

export default function Page() {
  return (
    <>
      <main className="flex-1">
        <Hero />
        <AboutUs />
        <Achievements />
        <DepartmentsTeaser />
        <EventsTeaser />
        <DocumentSection />
        <BlogPosts />
      </main>
      <Footer />
    </>
  );
}

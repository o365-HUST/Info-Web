import Hero from "./components/Hero";
import AboutUs from "./components/AboutUs";
import Achievements from "./components/Achievements";
import Departments from "./components/Departments";
import BlogPosts from "./components/BlogPosts";
import EventsTimeline from "./components/EventsTimeline";
import Footer from "./components/Footer";

export default function Page() {
  return (
    <>
      <main className="flex-1">
        <Hero />
        <AboutUs />
        <Achievements />
        <Departments />
        <BlogPosts />
        <EventsTimeline />
      </main>
      <Footer />
    </>
  );
}

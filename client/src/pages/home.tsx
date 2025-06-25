import Starfield from "@/components/starfield";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import SpaceTimeline from "@/components/space-timeline";
import AstronomicalCalendar from "@/components/astronomical-calendar";
import SolarTourism from "@/components/solar-tourism";
import SpaceDashboard from "@/components/space-dashboard";
import SpaceQuiz from "@/components/space-quiz";
import FloatingChatbot from "@/components/floating-chatbot";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="relative">
      <Starfield />
      <Navigation />
      <HeroSection />
      <SpaceTimeline />
      <AstronomicalCalendar />
      <SolarTourism />
      <SpaceDashboard />
      <SpaceQuiz />
      <FloatingChatbot />
      <Footer />
    </div>
  );
}

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
import { usePageLoadWebhook } from "@/hooks/use-page-load-webhook";
import FloatingAssets from "@/components/floating-assets";

export default function Home() {
  // Send current date to webhook when page loads
  usePageLoadWebhook();

  return (
    <div className="relative">
      <Starfield />
      <FloatingAssets />
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
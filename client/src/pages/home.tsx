import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import FloatingAssets from "@/components/floating-assets";
import { usePageLoadWebhook } from "@/hooks/use-page-load-webhook";

export default function Home() {
  const [phase, setPhase] = useState<"video" | "gearup" | "site">("video");
  const [videoStarted, setVideoStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  usePageLoadWebhook();

  useEffect(() => {
    const video = videoRef.current;

    if (video && videoStarted) {
      const audio = new Audio("/audint.mp3");
      audioRef.current = audio;

      video.play().catch(console.error);
      audio.play().catch(console.warn);

      video.onended = () => {
        audio.pause();
        setTimeout(() => setPhase("site"), 100);
      };
    }
  }, [videoStarted]);

  useEffect(() => {
  if (phase === "video") {
    // Scroll to top forcefully if in video phase (on reload too)
    window.scrollTo({ top: 0, behavior: "instant" });
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
  };
}, [phase]);

  const handleLaunch = () => setVideoStarted(true);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <AnimatePresence>
        {phase === "video" && (
          <motion.div
            key="intro"
            className="fixed top-0 left-0 w-full h-full z-50 bg-black flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-full h-full relative flex items-center justify-center">
              <video
                ref={videoRef}
                src="/intr.mp4"
                className="w-full h-full object-contain"
                playsInline
                muted
              />

              {/* 🚀 Launch Button - Centered */}
              {!videoStarted && (
                <button
  onClick={handleLaunch}
  className="absolute px-6 py-3 text-xl font-bold text-white bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-full shadow-lg hover:scale-105 transition-all duration-300 
             animate-glow border border-white/20"
>
  🚀 Launch Experience
</button>

              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main site */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={phase === "site" ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className={phase === "site" ? "relative z-10" : "pointer-events-none select-none opacity-0"}
      >
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
      </motion.div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { Satellite, Moon, Image, Zap, Newspaper, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useNasaApi } from "@/hooks/use-nasa-api";

export default function SpaceDashboard() {
  const { data: issData } = useNasaApi('iss');
  const { data: apodData } = useNasaApi('apod');
  const { data: moonData } = useNasaApi('moon');
  const [articles, setArticles] = useState<{ id: number; title: string; url: string; published_at: string }[]>([]);

useEffect(() => {
  fetch("https://api.spaceflightnewsapi.net/v4/articles?limit=8&ordering=-published_at")
    .then((res) => res.json())
    .then((data) => setArticles(data.results || []))
    .catch((err) => console.error("Failed to fetch space news", err));
}, []);

  const dashboardCards = [
    {
      title: "ISS Location",
      icon: Satellite,
      data: issData,
      render: (data: any) => {
        const [liveTime, setLiveTime] = useState('');

    useEffect(() => {
      if (!data?.timestamp) return;

      const baseTime = data.timestamp * 1000; // Convert to milliseconds

      const interval = setInterval(() => {
        const now = Date.now();
        const diff = now - baseTime;
        const live = new Date(baseTime + diff).toLocaleTimeString();
        setLiveTime(live);
      }, 1000);

      return () => clearInterval(interval);
    }, [data?.timestamp]);

    return (
      <>
        <img 
          src="https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" 
          alt="International Space Station" 
          className="w-full h-32 object-cover rounded-lg mb-4"
        />
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-300">Latitude:</span>
            <span className="text-stellar-orange" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              {data?.latitude || '...'}°
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Longitude:</span>
            <span className="text-stellar-orange" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              {data?.longitude || '...'}°
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Altitude:</span>
            <span className="text-stellar-orange">{data?.altitude} km</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Velocity:</span>
            <span className="text-stellar-orange">{data?.velocity} km/h</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Visibility:</span>
            <span className="text-stellar-orange capitalize">{data?.visibility}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Footprint:</span>
            <span className="text-stellar-orange">{data?.footprint} km</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Solar Lat / Lon:</span>
            <span className="text-stellar-orange">{data?.solar_lat}°, {data?.solar_lon}°</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Timestamp:</span>
            <span className="text-stellar-orange">{liveTime || '...'}</span>
          </div>
        </div>
      </>
    );
  }
},

    {
  title: "Moon Phase",
  icon: Moon,
  data: moonData,
  render: (data: any) => {
    const moonEmojis: Record<string, string> = {
      "new moon": "🌑",
      "waxing crescent": "🌒",
      "first quarter": "🌓",
      "waxing gibbous": "🌔",
      "full moon": "🌕",
      "waning gibbous": "🌖",
      "last quarter": "🌗",
      "waning crescent": "🌘"
    };

    const rawPhase = data?.moon_phase || "Waning Crescent";
    const normalizedPhase = rawPhase.trim().toLowerCase();
    const emoji = moonEmojis[normalizedPhase] || "🌙";

    const safeData = {
      moon_phase: rawPhase,
      moon_illumination: data?.moon_illumination || "12",
      moon_distance: data?.moon_distance || "389139",
      next_full_moon: data?.next_full_moon || "2025-07-21",
      moonrise: data?.moonrise || "19:27",
      moonset: data?.moonset || "06:18",
      sunrise: data?.sunrise || "05:43",
      sunset: data?.sunset || "19:12"
    };

    return (
      <>
        <div className="text-center mb-4">
          <div className="text-8xl mb-8">{emoji}</div> 
          <p className="mt-3 font-semibold">{safeData.moon_phase}</p>
          <p className="text-sm text-gray-300">{safeData.moon_illumination}% Illuminated</p>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-300">Next Full Moon:</span>
            <span className="text-stellar-orange">{safeData.next_full_moon}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Distance:</span>
            <span className="text-stellar-orange">{safeData.moon_distance} km</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Moonrise:</span>
            <span className="text-stellar-orange">{safeData.moonrise}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Moonset:</span>
            <span className="text-stellar-orange">{safeData.moonset}</span>
          </div>
        </div>
        <div className="my-4 w-full border-t-2 border-white/80" />
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-300">Sunrise:</span>
            <span className="text-stellar-orange">{safeData.sunrise}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Sunset:</span>
            <span className="text-stellar-orange">{safeData.sunset}</span>
          </div>
        </div>
      </>
    );
  }
},
    {
  title: "NASA APOD",
  icon: Image,
  data: apodData,
  render: (data: any) => (
    <>
      <img 
        src={data?.url || "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"} 
        alt={data?.title || "Space image"} 
        className="w-full h-32 object-cover rounded-lg mb-3"
      />
      <h4 className="font-semibold mb-2">
        {data?.title || 'Eagle Nebula Pillars'}
      </h4>

      {/* Truncated explanation */}
      <p className="text-sm text-gray-300 mb-2">
        {data?.explanation?.length > 150
          ? `${data.explanation.substring(0, 500)}...`
          : data?.explanation || 'The iconic Pillars of Creation in the Eagle Nebula showcase star formation in action...'}
      </p>

      {/* "Read more" button */}
      {data?.url && (
        <a
          href="https://apod.nasa.gov/apod/astropix.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-xs md:text-sm text-blue-400 hover:text-blue-300 transition-colors underline"
        >
          🔗 Read more on NASA APOD
        </a>
      )}
    </>
  )
}
  ];

  return (
    <section id="dashboard" className="py-20" style={{ background: 'linear-gradient(to bottom, hsl(240, 62%, 6%), hsl(220, 69%, 36%, 0.1))' }}>
      <div className="container mx-auto px-6">
        <motion.h2 
          className="text-4xl md:text-6xl text-center mb-16"
          style={{ fontFamily: 'Orbitron, monospace' }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
            Space Today Dashboard
          </span>
        </motion.h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dashboardCards.map((card, index) => (
            <motion.div
              key={card.title}
              className="glass-morphism rounded-xl p-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl mb-4 text-electric-blue flex items-center" style={{ fontFamily: 'Orbitron, monospace' }}>
                <card.icon className="w-5 h-5 mr-2" />
                {card.title}
              </h3>
              {card.render(card.data)}
            </motion.div>
          ))}
          <motion.div
  className="glass-morphism rounded-xl p-6 flex flex-col md:flex-row justify-between gap-6 md:col-span-2"
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3, duration: 0.6 }}
  viewport={{ once: true }}
>
  {/* Left: Astronauts */}
  <div className="flex-1">
    <h3
      className="text-xl mb-4 text-electric-blue flex items-center"
      style={{ fontFamily: "Orbitron, monospace" }}
    >
      <Zap className="w-5 h-5 mr-2" />
      Recent Space Travellers
    </h3>

    <Astronauts />
  </div>

  {/* Right: Sketchfab 3D Model */}
  <div className="w-full md:w-[300px] lg:w-[350px] xl:w-[400px] rounded-lg relative shadow-lg">
    <div
      className="rounded-lg p-1"
      style={{
        background: "linear-gradient(135deg, #1CAAD9, #FF8C00)",
        boxShadow: "0 0 15px 4px rgba(28, 170, 217, 0.4)"
      }}
    >
      <iframe
  title="Animated Astronaut Character"
  src="https://sketchfab.com/models/8fe5c8d3365e4d87bb7bc253d53a64e1/embed?autospin=1&autostart=1&ui_theme=dark&ui_infos=0&ui_controls=0&ui_stop=0&ui_watermark=0"
  width="100%"
  height="300"
  className="rounded-md"
  allow="autoplay; fullscreen; xr-spatial-tracking"
  allowFullScreen
  xr-spatial-tracking="true"
  execution-while-out-of-viewport="true"
  execution-while-not-rendered="true"
  web-share="true"
/>

    </div>
  </div>
</motion.div>

          {/* Space News */}
<motion.div
  className="glass-morphism rounded-xl p-6"
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4, duration: 0.6 }}
  viewport={{ once: true }}
>
  <h3
    className="text-xl mb-4 text-electric-blue flex items-center"
    style={{ fontFamily: "Orbitron, monospace" }}
  >
    <Newspaper className="w-5 h-5 mr-2" />
    Space News
  </h3>

  <div className="space-y-3 max-h-64 overflow-y-auto pr-1 scroll-smooth scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
    {articles.map((article) => (
      <div key={article.id} className="border-b border-gray-600 pb-2">
        <a href={article.url} target="_blank" rel="noopener noreferrer">
          <h4 className="font-semibold text-sm hover:underline">
            {article.title}
          </h4>
        </a>
        <p className="text-xs text-gray-400">
          {new Date(article.published_at).toLocaleString([], {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </div>
    ))}
  </div>
</motion.div>


         
        </div>
      </div>
    </section>
  );
}

function Astronauts() {
  const [astronauts, setAstronauts] = useState<{ name: string; craft: string }[]>([]);

  useEffect(() => {
    fetch("/api/nasa/astronauts") // 👈 now hitting your backend instead of external API
      .then((res) => res.json())
      .then((data) => setAstronauts(data.people || []))
      .catch((err) => console.error("Failed to fetch astronauts", err));
  }, []);

  if (astronauts.length === 0) return null;

  return (
    <div className="mt-4 text-sm text-gray-300">
      <ul className="list-disc list-inside space-y-1">
        {astronauts.map((astro, i) => (
          <li key={i}>
            {astro.name} —{" "}
            <span className="italic text-gray-400">{astro.craft}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
function SpaceNews() {
  const [articles, setArticles] = useState<{ title: string; published_at: string; url: string }[]>([]);

  useEffect(() => {
    fetch("https://api.spaceflightnewsapi.net/v4/articles?limit=5&ordering=-published_at")
      .then(res => res.json())
      .then(data => setArticles(data.results || []))
      .catch(err => console.error("Failed to fetch space news", err));
  }, []);

  if (articles.length === 0) return null;

  return (
    <div className="mt-4 text-sm text-gray-300">
      <h4 className="font-semibold mb-1">Latest Space News</h4>
      <ul className="list-disc list-inside space-y-1">
        {articles.map((article, i) => (
          <li key={i}>
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {article.title}
            </a>{" "}
            — <span className="italic text-gray-400">
              {new Date(article.published_at).toLocaleDateString(undefined, { dateStyle: "medium" })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}



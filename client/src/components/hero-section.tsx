import { useState, useEffect } from "react";
import { Rocket, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

interface SpaceEvent {
  title: string;
  description: string;
  date: string;
  category: string;
  agency: string;
}

export default function HeroSection() {
  const [todayEvent, setTodayEvent] = useState<SpaceEvent | null>(null);
  const [webhookEvent, setWebhookEvent] = useState<SpaceEvent | null>(null);
  const [n8nOutput, setN8nOutput] = useState<string>('');
  const [fetchingN8n, setFetchingN8n] = useState(false);

  const today = new Date();
  const monthDay = `${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
  const fullDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format

  // Send current date to webhook for space history
  const sendDateToWebhook = (currentDate: string) => {
    // Send via server proxy to avoid CORS - uses hero section webhook
    fetch('/api/webhook/hero', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: currentDate,
        monthDay: monthDay,
        timestamp: Date.now(),
        request_type: 'space_history',
        page_load: true,
        user_action: 'page_opened'
      }),
    }).then(response => response.json()).then(data => {
      if (data.success) {
        console.log('✅ Hero webhook sent successfully:', currentDate);
      } else {
        console.log('⚠️ Hero webhook failed:', data.status, currentDate);
      }
    }).catch(() => {
      console.log('📡 Hero webhook attempted, Date:', currentDate);
    });
  };

  // Fetch N8N webhook output
  const fetchN8nOutput = async () => {
    setFetchingN8n(true);
    try {
      const response = await fetch('/api/webhook/hero', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selected_date: fullDate,
          monthDay: monthDay,
          timestamp: Date.now(),
          request_type: 'space_history_fetch',
          user_action: 'fetch_n8n_output'
        }),
      });
      
      const result = await response.json();
      if (result.success) {
        // Parse the webhook response data to extract text
        let outputText = '';
        try {
          if (typeof result.data === 'string') {
            // Try to parse if it's a JSON string
            try {
              const parsed = JSON.parse(result.data);
              if (parsed.text) {
                outputText = parsed.text;
              } else {
                outputText = result.data;
              }
            } catch {
              outputText = result.data;
            }
          } else if (result.data?.text) {
            outputText = result.data.text;
          } else {
            outputText = JSON.stringify(result.data);
          }
        } catch {
          outputText = result.data || 'No data received';
        }
        
        setN8nOutput(outputText);
        console.log('✅ Hero N8N output fetched:', outputText);
      } else {
        setN8nOutput(`Error: ${result.status} - ${result.error}`);
        console.log('⚠️ Hero N8N fetch failed:', result.status);
      }
    } catch (error) {
      setN8nOutput('Failed to fetch N8N output');
      console.log('📡 Hero N8N fetch error:', error);
    } finally {
      setFetchingN8n(false);
    }
  };

  const { data: spaceEvents } = useQuery({
    queryKey: ['/api/space-events/today'],
    queryFn: async () => {
      // Send date to webhook for processing (fire and forget)
      sendDateToWebhook(fullDate);

      // Use static data for display
      const { default: events } = await import("@/data/space-events.json");
      return (events as any)[monthDay] || null;
    }
  });

  useEffect(() => {
    if (spaceEvents) {
      if (spaceEvents.source === 'webhook') {
        setWebhookEvent(spaceEvents);
        setTodayEvent(spaceEvents);
      } else {
        setTodayEvent(spaceEvents);
      }
    }
  }, [spaceEvents]);

  const scrollToTimeline = () => {
    const element = document.querySelector('#timeline');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-cosmic-blue/20 to-space-black/90 z-10"></div>
      
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
        }}
      />
      
      <div className="container mx-auto px-6 relative z-20 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-6"
            style={{ fontFamily: 'Orbitron, monospace' }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-float">
              AstralChronos
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Your Gateway to the Cosmos - Explore Space History, Real-Time Data, and Beyond
          </motion.p>
          
          <motion.div 
            className="glass-morphism rounded-xl p-8 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <h2 className="text-2xl mb-4 flex items-center justify-center gap-2" style={{ fontFamily: 'Orbitron, monospace', color: 'hsl(35, 91%, 48%)' }}>
              <Calendar className="w-6 h-6" />
              Today in Space History
            </h2>
            
            {todayEvent ? (
              <>
                <div className="text-lg mb-2 font-semibold">{todayEvent.title}</div>
                <p className="text-gray-300 mb-4">{todayEvent.description}</p>
                <div className="flex justify-center space-x-4 mb-4">
                  <span className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: 'hsl(220, 69%, 36%, 0.3)' }}>{todayEvent.agency}</span>
                  <span className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: 'hsl(250, 85%, 60%, 0.3)' }}>{todayEvent.category}</span>
                </div>
                
                <button
                  onClick={fetchN8nOutput}
                  disabled={fetchingN8n}
                  className="w-full bg-gradient-to-r from-blue-400 to-purple-400 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-400/80 hover:to-purple-400/80 transition-all disabled:opacity-50 mb-3"
                >
                  {fetchingN8n ? 'Fetching N8N Output...' : 'Get AI Response for Today'}
                </button>
                
                {n8nOutput && (
                  <div className="bg-black/30 border border-blue-400/30 rounded-lg p-4 text-left">
                    <h4 className="text-blue-400 font-medium mb-2">N8N Webhook Response:</h4>
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-auto max-h-32" id="output">
                      {n8nOutput}
                    </pre>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-300">Loading today's space event...</p>
            )}
          </motion.div>

          <motion.button 
            className="glow-button bg-gradient-to-r from-blue-400 to-purple-400 px-8 py-4 rounded-full text-lg font-semibold hover:animate-pulse-glow flex items-center gap-2 mx-auto"
            onClick={scrollToTimeline}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Rocket className="w-5 h-5" />
            Explore the Timeline
          </motion.button>
        </div>
      </div>
    </section>
  );
}

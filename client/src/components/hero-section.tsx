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

  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  const fullDate = localDate.toISOString().split('T')[0];
  const monthDay = `${(localDate.getMonth() + 1).toString().padStart(2, '0')}-${localDate.getDate().toString().padStart(2, '0')}`;


  // Send current date to webhook for space history
  const sendDateToWebhook = (currentDate: string) => {
    setFetchingN8n(true);
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
        // Parse and display the N8N response automatically
        let outputText = '';
        try {
          if (typeof data.data === 'string') {
            try {
              // Try to parse the JSON string from N8N
              const parsed = JSON.parse(data.data);
              if (parsed.text) {
                outputText = parsed.text;
              } else {
                outputText = data.data;
              }
            } catch {
              // If parsing fails, use the raw string
              outputText = data.data;
            }
          } else if (data.data && typeof data.data === 'object' && data.data.text) {
            outputText = data.data.text;
          } else if (data.data) {
            outputText = JSON.stringify(data.data, null, 2);
          } else {
            outputText = 'No data received from N8N workflow';
          }
        } catch (error) {
          outputText = `Error parsing response: ${error}`;
          console.error('Response parsing error:', error, 'Data:', data);
        }
        
        setN8nOutput(outputText);
        console.log('✅ Hero N8N output auto-fetched:', outputText);
      } else {
        console.log('⚠️ Hero webhook failed:', data.status, currentDate);
        setN8nOutput(`Error: ${data.status} - ${data.error || 'Unknown error'}`);
      }
      setFetchingN8n(false);
    }).catch((error) => {
      console.log('📡 Hero webhook error:', error, 'Date:', currentDate);
      setN8nOutput('Failed to connect to N8N workflow');
      setFetchingN8n(false);
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
            try {
              // Try to parse the JSON string from N8N
              const parsed = JSON.parse(result.data);
              if (parsed.text) {
                outputText = parsed.text;
              } else {
                outputText = result.data;
              }
            } catch {
              // If parsing fails, use the raw string
              outputText = result.data;
            }
          } else if (result.data && typeof result.data === 'object' && result.data.text) {
            outputText = result.data.text;
          } else if (result.data) {
            outputText = JSON.stringify(result.data, null, 2);
          } else {
            outputText = 'No data received from N8N workflow';
          }
        } catch (error) {
          outputText = `Error parsing response: ${error}`;
          console.error('Response parsing error:', error, 'Data:', result);
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
             <section className="w-full text-center px-4 mt-20">
     <span className="inline-block break-keep max-w-full bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-float font-bold text-[clamp(2rem,6vw,4.8rem)]">
    AstralChronos
     </span>
            </section>

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
                
                {fetchingN8n ? (
                  <div className="w-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 text-white px-4 py-2 rounded-lg font-medium mb-3 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing workflow...
                  </div>
                ) : n8nOutput ? (
                  <div className="bg-black/30 border border-blue-400/30 rounded-lg p-4 text-left mb-3">
                    <h4 className="text-blue-400 font-medium mb-2">Today's Space History:</h4>
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-auto max-h-32" id="output">
                      {n8nOutput}
                    </pre>
                  </div>
                ) : (
                  <button
                    onClick={fetchN8nOutput}
                    className="w-full bg-gradient-to-r from-blue-400 to-purple-400 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-400/80 hover:to-purple-400/80 transition-all mb-3"
                  >
                    Get AI Response for Today
                  </button>
                )}
              </>
            ) : fetchingN8n ? (
              <div className="text-gray-300 flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-300 mr-2"></div>
                Processing workflow...
              </div>
            ) : n8nOutput ? (
              <div className="bg-black/30 border border-blue-400/30 rounded-lg p-4 text-left mb-3">
                <h4 className="text-blue-400 font-medium mb-2">Today's Space History:</h4>
                <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-auto max-h-32">
                  {n8nOutput}
                </pre>
              </div>
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

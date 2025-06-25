import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Space events endpoint
  app.get("/api/space-events/today", async (req, res) => {
    try {
      const today = new Date();
      const monthDay = `${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
      
      // In a real app, this would come from a database or external API
      const spaceEvents: Record<string, any> = {
        "12-25": {
          title: "James Webb Space Telescope Launch (2021)",
          description: "The most powerful space telescope ever built was launched from French Guiana, marking a new era in astronomical observation and our understanding of the universe.",
          date: "December 25, 2021",
          category: "Launch",
          agency: "NASA"
        },
        "07-20": {
          title: "Apollo 11 Moon Landing (1969)",
          description: "Neil Armstrong and Buzz Aldrin became the first humans to walk on the Moon, with Armstrong famously saying 'That's one small step for man, one giant leap for mankind.'",
          date: "July 20, 1969",
          category: "Landing",
          agency: "NASA"
        }
      };

      const todayEvent = spaceEvents[monthDay] || {
        title: "Explore Space History",
        description: "While no major space events happened on this exact date, every day offers an opportunity to learn about the cosmos!",
        date: today.toLocaleDateString(),
        category: "Educational",
        agency: "AstralChronos"
      };

      res.json(todayEvent);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch today's space event" });
    }
  });

  // NASA API proxy endpoints
  app.get("/api/nasa/apod", async (req, res) => {
    try {
      const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
      const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`);
      
      if (!response.ok) {
        throw new Error('NASA API request failed');
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to fetch NASA APOD",
        fallback: {
          title: "Eagle Nebula Pillars",
          explanation: "The iconic Pillars of Creation in the Eagle Nebula showcase star formation in action...",
          url: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
        }
      });
    }
  });

  app.get("/api/nasa/iss", async (req, res) => {
    try {
      const response = await fetch('http://api.open-notify.org/iss-now.json');
      
      if (!response.ok) {
        throw new Error('ISS API request failed');
      }
      
      const data = await response.json();
      res.json({
        latitude: data.iss_position.latitude,
        longitude: data.iss_position.longitude,
        speed: '27,600'
      });
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to fetch ISS location",
        fallback: {
          latitude: "45.3642",
          longitude: "-121.5278",
          speed: "27,600"
        }
      });
    }
  });

  // Chatbot webhook proxy
  app.post("/api/chatbot", async (req, res) => {
    try {
      const { message } = req.body;
      const webhookUrl = process.env.N8N_CHATBOT_WEBHOOK;

      if (!webhookUrl) {
        return res.json({
          response: "I'm here to help with space questions! Unfortunately, my AI connection is currently unavailable, but I'd love to chat about space exploration, planets, or astronomy."
        });
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        throw new Error('Webhook request failed');
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ 
        error: "Chatbot service unavailable",
        response: "I'm experiencing some technical difficulties. Please try again later!"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

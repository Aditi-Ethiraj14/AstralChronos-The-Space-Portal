import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Webhook proxy endpoint to avoid CORS issues
  app.post('/api/webhook/send', async (req, res) => {
    try {
      const webhookUrl = "https://adie13.app.n8n.cloud/webhook/7825313f-a417-4ce7-802f-ecdd48dabbed";

      console.log('Sending to webhook:', webhookUrl);
      console.log('Payload:', JSON.stringify(req.body, null, 2));

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });

      console.log('Webhook response status:', response.status);

      if (response.ok) {
        const data = await response.text();
        console.log('Webhook response data:', data);
        res.json({ success: true, data, status: response.status });
      } else {
        const errorText = await response.text();
        console.log('Webhook error response:', errorText);
        res.json({ success: false, status: response.status, error: errorText });
      }
    } catch (error) {
      console.log('Webhook request failed:', error);
      res.json({ success: false, error: String(error) });
    }
  });

  

  // Hero section webhook endpoint - separate from calendar
  app.post('/api/webhook/hero', async (req, res) => {
    try {
      // Hero section webhook URL - separate from calendar
      const heroWebhookUrl = "https://adie13.app.n8n.cloud/webhook-test/8f9defba-3665-465a-b86f-5a9ae79449d3";

      console.log('Sending to hero webhook:', heroWebhookUrl);
      console.log('Hero payload:', JSON.stringify(req.body, null, 2));

      const response = await fetch(heroWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });

      console.log('Hero webhook response status:', response.status);

      if (response.ok) {
        const text = await response.text();
        console.log('Hero webhook response:', text);
        res.json({ success: true, data: text, status: response.status });
      } else {
        const errorText = await response.text();
        console.log('Hero webhook error:', errorText);
        res.json({ success: false, status: response.status, error: errorText });
      }
    } catch (error) {
      console.log('Hero webhook request failed:', error);
      res.json({ success: false, error: String(error) });
    }
  });

  // Fetch N8N webhook response endpoint
  app.post('/api/webhook/fetch', async (req, res) => {
    try {
      const webhookUrl = "https://adie13.app.n8n.cloud/webhook-test/7825313f-a417-4ce7-802f-ecdd48dabbed";

      console.log('Fetching from N8N webhook:', webhookUrl);
      console.log('Fetch payload:', JSON.stringify(req.body, null, 2));

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });

      console.log('N8N fetch response status:', response.status);

      if (response.ok) {
        const text = await response.text();
        console.log('N8N fetch response:', text);
        res.json({ success: true, data: text, status: response.status });
      } else {
        const errorText = await response.text();
        console.log('N8N fetch error:', errorText);
        res.json({ success: false, status: response.status, error: errorText });
      }
    } catch (error) {
      console.log('N8N fetch request failed:', error);
      res.json({ success: false, error: String(error) });
    }
  });

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
      const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=uS3paDFSjU5jOcywa5ttAoXDtDnqSMw4CeUu99eU`);

      if (!response.ok) {
        throw new Error('NASA API request failed');
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      // Return fallback data instead of error
      res.json({
        title: "Eagle Nebula Pillars",
        explanation: "The iconic Pillars of Creation in the Eagle Nebula showcase star formation in action with towering columns of gas and dust where new stars are born.",
        url: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
      });
    }
  });

  app.get("/api/nasa/iss", async (req, res) => {
    try {
      const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');

      if (!response.ok) {
        throw new Error('ISS API request failed');
      }

      const data = await response.json();
      res.json({
        latitude: data.latitude.toFixed(4),
        longitude: data.longitude.toFixed(4),
        speed: '27,600',
        altitude: data.altitude.toFixed(2),
        velocity: data.velocity.toFixed(2),
        visibility: data.visibility,
        footprint: data.footprint.toFixed(2),
        timestamp: data.timestamp,
        daynum: data.daynum,
        solar_lat: data.solar_lat.toFixed(4),
        solar_lon: data.solar_lon.toFixed(4),
        units: data.units
      });
    } catch (error) {
      // Return fallback data instead of error
      res.json({
        latitude: "45.3642",
        longitude: "-121.5278",
        speed: "27,600"
      });
    }
  });

  app.get("/api/nasa/moon", async (req, res) => {
  try {
    const response = await fetch(`https://api.ipgeolocation.io/astronomy?apiKey=YOUR_API_KEY&location=New Delhi`);
    
    if (!response.ok) {
      throw new Error("Moon API request failed");
    }

    const data = await response.json();

    res.json({
      moon_phase: data.moon_phase,
      moon_illumination: data.moon_illumination,
      moon_distance: data.moon_distance,
      next_full_moon: data.next_full_moon,
      moonrise: data.moonrise,
      moonset: data.moonset,
      sunrise: data.sunrise,
      sunset: data.sunset,
    });

  } catch (error) {
       // 🧷 Return fallback values
    res.json({
      moon_phase: "Waning Crescent",
      moon_illumination: "12",
      moon_distance: "389139",
      next_full_moon: "2025-07-21",
      moonrise: "19:27",
      moonset: "06:18",
      sunrise: "05:43",
      sunset: "19:12"
    });
  }
});

   // server.js or routes/api.js

app.get("/api/nasa/astronauts", async (req, res) => {
  try {
    const response = await fetch("http://api.open-notify.org/astros.json");

    if (!response.ok) throw new Error("Failed to fetch astronaut data");

    const data = await response.json();

    res.json({ people: data.people || [] });
  } catch (err) {
    // Optional fallback
    res.json({
      people: [
        { name: "Placeholder Astronaut 1", craft: "ISS" },
        { name: "Placeholder Astronaut 2", craft: "ISS" },
      ],
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
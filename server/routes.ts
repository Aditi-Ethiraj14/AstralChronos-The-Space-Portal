import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Webhook proxy endpoint to avoid CORS issues
  app.post('/api/webhook/send', async (req, res) => {
    try {
      const webhookUrl = "https://adie13.app.n8n.cloud/webhook-test/7825313f-a417-4ce7-802f-ecdd48dabbed";

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

  // AI Historical Events endpoint using test webhook
  app.post('/api/webhook/ai-events', async (req, res) => {
    try {
      const webhookUrl = "https://adie13.app.n8n.cloud/webhook-test/7825313f-a417-4ce7-802f-ecdd48dabbed";

      console.log('Sending to AI Events webhook:', webhookUrl);
      console.log('AI Events payload:', JSON.stringify(req.body, null, 2));

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });

      console.log('AI Events response status:', response.status);

      if (response.ok) {
        const text = await response.text();
        console.log('AI Events response:', text);
        
        // Try to parse as JSON first, if it fails return as text
        let responseData;
        try {
          responseData = JSON.parse(text);
        } catch {
          responseData = text;
        }
        
        res.json({ success: true, data: responseData, status: response.status });
      } else {
        const errorText = await response.text();
        console.log('AI Events error:', errorText);
        res.json({ success: false, status: response.status, error: errorText });
      }
    } catch (error) {
      console.log('AI Events request failed:', error);
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
      const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`);

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
        speed: '27,600'
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
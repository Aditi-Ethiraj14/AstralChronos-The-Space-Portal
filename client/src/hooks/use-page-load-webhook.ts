import { useEffect } from 'react';

export function usePageLoadWebhook() {
  useEffect(() => {
    const sendPageLoadData = async () => {
      const webhookUrl = import.meta.env.VITE_N8N_HISTORY_WEBHOOK || "https://adie13.app.n8n.cloud/webhook/7825313f-a417-4ce7-802f-ecdd48dabbed";
      const today = new Date();
      const currentDate = today.toISOString().split('T')[0];
      const monthDay = `${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
      
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: currentDate,
            monthDay: monthDay,
            timestamp: Date.now(),
            request_type: 'page_load',
            user_action: 'website_opened',
            current_time: today.toISOString(),
            browser_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          }),
        });
        
        console.log('Page load date sent to webhook:', currentDate);
      } catch (error) {
        console.log('Page load webhook sent to:', webhookUrl, 'Date:', currentDate);
      }
    };

    // Send immediately when component mounts
    sendPageLoadData();
  }, []);
}
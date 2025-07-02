import { useEffect } from 'react';

export function usePageLoadWebhook() {
  useEffect(() => {
    const sendPageLoadData = () => {
      const today = new Date();
      const currentDate = today.toISOString().split('T')[0];
      const monthDay = `${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
      
      // Send via server proxy to avoid CORS
      fetch('/api/webhook/send', {
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
      }).then(response => response.json()).then(data => {
        if (data.success) {
          console.log('✅ Page load webhook sent successfully:', currentDate);
        } else {
          console.log('⚠️ Page load webhook failed:', data.status, currentDate);
        }
      }).catch(() => {
        console.log('📡 Page load webhook attempted, Date:', currentDate);
      });
    };

    // Send immediately when component mounts
    sendPageLoadData();
  }, []);
}
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

export default function AstronomicalCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [n8nOutput, setN8nOutput] = useState<string>('');
  const [fetchingN8n, setFetchingN8n] = useState(false);

  // Send date selection to webhook
  const sendDateToWebhook = (date: Date) => {
    // Send via server proxy to avoid CORS
    fetch('/api/webhook/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        selected_date: date.toISOString().split('T')[0],
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        day: date.getDate(),
        timestamp: Date.now(),
        request_type: 'calendar_selection',
        user_action: 'date_clicked'
      }),
    }).then(response => response.json()).then(data => {
      if (data.success) {
        console.log('✅ Calendar webhook sent successfully:', date.toISOString().split('T')[0]);
      } else {
        console.log('⚠️ Calendar webhook failed:', data.status, date.toISOString().split('T')[0]);
      }
    }).catch(() => {
      console.log('📡 Calendar webhook attempted, Date:', date.toISOString().split('T')[0]);
    });
  };

  const { data: calendarEvents } = useQuery({
    queryKey: ['/api/calendar-events', currentDate.getMonth(), currentDate.getFullYear()],
    queryFn: async () => {
      // Fallback to static data
      const { default: events } = await import("@/data/space-events.json");
      return (events as any).calendar || {};
    }
  });

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    
    // Send selected date to webhook (fire and forget)
    sendDateToWebhook(date);
    
    // Clear previous N8N output when selecting new date
    setN8nOutput('');
  };

  // Fetch AI Historical Events from N8N workflow for selected date
  const fetchN8nOutput = async () => {
    if (!selectedDate) return;
    
    setFetchingN8n(true);
    setN8nOutput(''); // Clear previous output
    
    try {
      // Use the same webhook endpoint that works, but wait for response
      const response = await fetch('/api/webhook/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selected_date: selectedDate.toISOString().split('T')[0],
          month: selectedDate.getMonth() + 1,
          year: selectedDate.getFullYear(),
          day: selectedDate.getDate(),
          timestamp: Date.now(),
          request_type: 'ai_historical_events',
          user_action: 'fetch_ai_events_for_date'
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
        console.log('✅ AI Historical Events fetched:', outputText);
      } else {
        setN8nOutput(`Error: ${result.status} - ${result.error || 'Failed to get AI response'}`);
        console.log('⚠️ AI Historical Events fetch failed:', result.status);
      }
    } catch (error) {
      setN8nOutput('Failed to fetch AI Historical Events. Please try again.');
      console.log('📡 AI Historical Events fetch error:', error);
    } finally {
      setFetchingN8n(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const hasEvent = (date: Date | null) => {
    if (!date || !calendarEvents) return false;
    const dateKey = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    return !!(calendarEvents as any)[dateKey];
  };

  const getEventsForDate = (date: Date | null) => {
    if (!date || !calendarEvents) return [];
    const dateKey = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    return (calendarEvents as any)[dateKey] || [];
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <section id="calendar" className="py-20" style={{ background: 'linear-gradient(to bottom, hsl(240, 62%, 6%), hsl(220, 69%, 36%, 0.1))' }}>
      <div className="container mx-auto px-6">
        <motion.h2 
          className="text-4xl md:text-6xl text-center mb-16"
          style={{ fontFamily: 'Orbitron, monospace' }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Astronomical Calendar
          </span>
        </motion.h2>
        
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="glass-morphism rounded-xl p-8 mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 rounded-lg transition-colors hover:bg-blue-400/20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h3 className="text-2xl" style={{ fontFamily: 'Orbitron, monospace' }}>
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 rounded-lg transition-colors hover:bg-blue-400/20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-2 mb-4">
              {weekdays.map((day) => (
                <div key={day} className="text-center p-2 text-gray-400 font-semibold">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {getDaysInMonth(currentDate).map((date, index) => (
                <div
                  key={index}
                  className={`aspect-square p-2 rounded-lg cursor-pointer transition-colors relative ${
                    date ? 'hover:bg-blue-400/20' : ''
                  } ${
                    selectedDate && date && selectedDate.toDateString() === date.toDateString()
                      ? 'bg-blue-400/40'
                      : ''
                  }`}
                  onClick={() => date && handleDateClick(date)}
                >
                  {date && (
                    <>
                      <span className="text-sm">{date.getDate()}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            className="glass-morphism rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl mb-4" style={{ fontFamily: 'Orbitron, monospace', color: 'hsl(35, 91%, 48%)' }}>
              {selectedDate ? `Events for ${selectedDate.toLocaleDateString()}` : 'Select a date to see events'}
            </h4>
            <div className="space-y-4">
              {selectedDate && getEventsForDate(selectedDate).length > 0 ? (
                getEventsForDate(selectedDate).map((event: any, index: number) => (
                  <div key={index} className="border-l-4 pl-4" style={{ borderColor: 'hsl(207, 90%, 54%)' }}>
                    <h5 className="font-semibold">{event.title}</h5>
                    <p className="text-gray-300 text-sm">{event.description}</p>
                  </div>
                ))
              ) : selectedDate ? (
                <p className="text-gray-400">No space events recorded for this date.</p>
              ) : (
                <p className="text-gray-400">Click on a date to see historical space events.</p>
              )}
              
              {selectedDate && (
                <div className="mt-6 space-y-4">
                  <button
                    onClick={fetchN8nOutput}
                    disabled={fetchingN8n}
                    className="w-full bg-gradient-to-r from-blue-400 to-purple-400 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-400/80 hover:to-purple-400/80 transition-all disabled:opacity-50"
                  >
                    {fetchingN8n ? 'Loading AI Historical Events...' : 'Get AI Historical Events'}
                  </button>
                  
                  {fetchingN8n && (
                    <div className="bg-black/30 border border-blue-400/30 rounded-lg p-4 text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mx-auto mb-2"></div>
                      <p className="text-blue-400 text-sm">Processing your request...</p>
                    </div>
                  )}
                  
                  {n8nOutput && !fetchingN8n && (
                    <div className="bg-black/30 border border-blue-400/30 rounded-lg p-4 text-left">
                      <h4 className="text-blue-400 font-medium mb-2">AI Historical Events:</h4>
                      <div className="text-sm text-gray-300 whitespace-pre-wrap overflow-auto max-h-64">
                        {n8nOutput}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

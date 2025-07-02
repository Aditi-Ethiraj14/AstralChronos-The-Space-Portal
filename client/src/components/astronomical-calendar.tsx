import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

export default function AstronomicalCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Send date selection to webhook
  const sendDateToWebhook = async (date: Date) => {
    const webhookUrl = import.meta.env.VITE_N8N_CALENDAR_WEBHOOK;
    if (!webhookUrl) return null;

    try {
      const response = await fetch(webhookUrl, {
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
          request_type: 'calendar_selection'
        }),
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log('Calendar webhook not configured or unavailable');
    }
    return null;
  };

  const { data: calendarEvents } = useQuery({
    queryKey: ['/api/calendar-events', currentDate.getMonth(), currentDate.getFullYear()],
    queryFn: async () => {
      // Try webhook first for dynamic calendar data
      const webhookData = await sendDateToWebhook(currentDate);
      if (webhookData && webhookData.calendar_events) {
        return webhookData.calendar_events;
      }

      // Fallback to static data
      const { default: events } = await import("@/data/space-events.json");
      return (events as any).calendar || {};
    }
  });

  const handleDateClick = async (date: Date) => {
    setSelectedDate(date);
    
    // Send selected date to webhook
    await sendDateToWebhook(date);
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
                      {hasEvent(date) && (
                        <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full" style={{ backgroundColor: 'hsl(35, 91%, 48%)' }} />
                      )}
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
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

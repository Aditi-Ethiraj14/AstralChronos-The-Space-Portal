import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  date: string;
  category: string;
  image: string;
}

export default function SpaceTimeline() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const { data: timelineEvents = [] } = useQuery({
    queryKey: ['/api/space-timeline'],
    queryFn: async () => {
      const { default: events } = await import("@/data/space-events.json");
      return events.timeline || [];
    }
  });

  return (
    <section id="timeline" className="py-20 relative" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.h2 
          className="text-4xl md:text-6xl text-center mb-16"
          style={{ fontFamily: 'Orbitron, monospace' }}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent">
            Space Timeline
          </span>
        </motion.h2>
        
        <div className="relative overflow-x-auto pb-6">
          <div className="flex space-x-8 min-w-max px-4" style={{ width: `${timelineEvents.length * 350}px` }}>
            {timelineEvents.map((event: TimelineEvent, index: number) => (
              <motion.div
                key={`${event.year}-${index}`}
                className="timeline-item flex-shrink-0 w-80"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <div className="glass-morphism rounded-xl p-6 h-[450px] flex flex-col hover:scale-105 transition-transform duration-300 group">
                  <div className="text-4xl mb-3 font-bold" style={{ fontFamily: 'Orbitron, monospace', color: 'hsl(35, 91%, 48%)' }}>
                    {event.year}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-400 transition-colors">{event.title}</h3>
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-40 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300"
                  />
                  <p className="text-gray-300 flex-grow text-sm leading-relaxed">
                    {event.description}
                  </p>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
                    <span className="text-sm font-medium" style={{ fontFamily: 'JetBrains Mono, monospace', color: 'hsl(207, 90%, 54%)' }}>
                      {event.date}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ 
                      backgroundColor: event.category === 'Launch' ? 'hsl(35, 91%, 48%, 0.2)' :
                                     event.category === 'Landing' ? 'hsl(142, 76%, 36%, 0.2)' :
                                     event.category === 'Discovery' ? 'hsl(271, 91%, 65%, 0.2)' :
                                     'hsl(220, 69%, 36%, 0.2)',
                      color: event.category === 'Launch' ? 'hsl(35, 91%, 48%)' :
                             event.category === 'Landing' ? 'hsl(142, 76%, 36%)' :
                             event.category === 'Discovery' ? 'hsl(271, 91%, 65%)' :
                             'hsl(207, 90%, 54%)'
                    }}>
                      {event.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Timeline Navigation Hint */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            ← Scroll horizontally to explore {timelineEvents.length} major space milestones →
          </p>
        </div>
      </div>
    </section>
  );
}

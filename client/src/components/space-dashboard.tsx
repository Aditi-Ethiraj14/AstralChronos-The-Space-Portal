import { useEffect, useState } from "react";
import { Satellite, Moon, Image, Zap, Newspaper, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useNasaApi } from "@/hooks/use-nasa-api";

export default function SpaceDashboard() {
  const { data: issData } = useNasaApi('iss');
  const { data: apodData } = useNasaApi('apod');
  const { data: moonData } = useNasaApi('moon');

  const dashboardCards = [
    {
      title: "ISS Location",
      icon: Satellite,
      data: issData,
      render: (data: any) => (
        <>
          <img 
            src="https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" 
            alt="International Space Station" 
            className="w-full h-32 object-cover rounded-lg mb-4"
          />
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">Latitude:</span>
              <span className="text-stellar-orange" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                {data?.latitude || 'Loading...'}°
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Longitude:</span>
              <span className="text-stellar-orange" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                {data?.longitude || 'Loading...'}°
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Speed:</span>
              <span className="text-stellar-orange" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                {data?.speed || '27,600'} km/h
              </span>
            </div>
          </div>
        </>
      )
    },
    {
      title: "Moon Phase",
      icon: Moon,
      data: moonData,
      render: (data: any) => (
        <>
          <div className="text-center mb-4">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full shadow-lg"></div>
            <p className="mt-3 font-semibold">{data?.phase || 'Waxing Gibbous'}</p>
            <p className="text-sm text-gray-300">{data?.illumination || '87%'} Illuminated</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Next Full Moon:</span>
              <span className="text-stellar-orange">{data?.nextFull || 'Loading...'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Distance:</span>
              <span className="text-stellar-orange">{data?.distance || '384,400 km'}</span>
            </div>
          </div>
        </>
      )
    },
    {
      title: "NASA APOD",
      icon: Image,
      data: apodData,
      render: (data: any) => (
        <>
          <img 
            src={data?.url || "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"} 
            alt={data?.title || "Space image"} 
            className="w-full h-32 object-cover rounded-lg mb-3"
          />
          <h4 className="font-semibold mb-2">{data?.title || 'Eagle Nebula Pillars'}</h4>
          <p className="text-sm text-gray-300">
            {data?.explanation?.substring(0, 100) || 'The iconic Pillars of Creation in the Eagle Nebula showcase star formation in action...'}
            {data?.explanation?.length > 100 && '...'}
          </p>
        </>
      )
    }
  ];

  return (
    <section id="dashboard" className="py-20" style={{ background: 'linear-gradient(to bottom, hsl(240, 62%, 6%), hsl(220, 69%, 36%, 0.1))' }}>
      <div className="container mx-auto px-6">
        <motion.h2 
          className="text-4xl md:text-6xl text-center mb-16"
          style={{ fontFamily: 'Orbitron, monospace' }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
            Space Today Dashboard
          </span>
        </motion.h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dashboardCards.map((card, index) => (
            <motion.div
              key={card.title}
              className="glass-morphism rounded-xl p-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl mb-4 text-electric-blue flex items-center" style={{ fontFamily: 'Orbitron, monospace' }}>
                <card.icon className="w-5 h-5 mr-2" />
                {card.title}
              </h3>
              {card.render(card.data)}
            </motion.div>
          ))}

          {/* Meteor Showers */}
          <motion.div
            className="glass-morphism rounded-xl p-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl mb-4 text-electric-blue flex items-center" style={{ fontFamily: 'Orbitron, monospace' }}>
              <Zap className="w-5 h-5 mr-2" />
              Meteor Showers
            </h3>
            <div className="space-y-3">
              <div className="border-l-4 pl-3" style={{ borderColor: 'hsl(35, 91%, 48%)' }}>
                <h4 className="font-semibold">Geminids (Active)</h4>
                <p className="text-sm text-gray-300">Peak: Dec 13-14</p>
                <p className="text-xs text-gray-400">60 meteors/hour</p>
              </div>
              <div className="border-l-4 border-gray-500 pl-3">
                <h4 className="font-semibold">Quadrantids (Upcoming)</h4>
                <p className="text-sm text-gray-300">Peak: Jan 3-4</p>
                <p className="text-xs text-gray-400">40 meteors/hour</p>
              </div>
            </div>
          </motion.div>

          {/* Space News */}
          <motion.div
            className="glass-morphism rounded-xl p-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl mb-4 text-electric-blue flex items-center" style={{ fontFamily: 'Orbitron, monospace' }}>
              <Newspaper className="w-5 h-5 mr-2" />
              Space News
            </h3>
            <div className="space-y-3">
              <div className="border-b border-gray-600 pb-2">
                <h4 className="font-semibold text-sm">SpaceX Starship Test Success</h4>
                <p className="text-xs text-gray-400">2 hours ago</p>
              </div>
              <div className="border-b border-gray-600 pb-2">
                <h4 className="font-semibold text-sm">James Webb Discovers New Exoplanet</h4>
                <p className="text-xs text-gray-400">5 hours ago</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Mars Sample Return Mission Update</h4>
                <p className="text-xs text-gray-400">1 day ago</p>
              </div>
            </div>
          </motion.div>

          {/* Solar Activity */}
          <motion.div
            className="glass-morphism rounded-xl p-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl mb-4 text-electric-blue flex items-center" style={{ fontFamily: 'Orbitron, monospace' }}>
              <Sun className="w-5 h-5 mr-2" />
              Solar Activity
            </h3>
            <img 
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=150" 
              alt="Solar flares" 
              className="w-full h-20 object-cover rounded-lg mb-3"
            />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Solar Wind:</span>
                <span style={{ color: 'hsl(35, 91%, 48%)' }}>450 km/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Geomag Field:</span>
                <span className="text-green-400">Quiet</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">X-ray Level:</span>
                <span className="text-yellow-400">C2.1</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

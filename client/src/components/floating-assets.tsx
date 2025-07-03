
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingAsset {
  id: string;
  image: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const spaceAssets = [
  '/space-assets/ice-asteroid.png',
  '/space-assets/fire-planet.png', 
  '/space-assets/fire-asteroid.png',
  '/space-assets/blue-planet.png',
  '/space-assets/astronaut.png',
  '/space-assets/green-crystal.png'
];

export default function FloatingAssets() {
  const [assets, setAssets] = useState<FloatingAsset[]>([]);

  useEffect(() => {
    const generateAssets = () => {
      const newAssets: FloatingAsset[] = [];
      
      // Generate 12 floating assets
      for (let i = 0; i < 12; i++) {
        newAssets.push({
          id: `asset-${i}`,
          image: spaceAssets[Math.floor(Math.random() * spaceAssets.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 40 + 30, // 30-70px
          duration: Math.random() * 25 + 15, // 15-40s
          delay: Math.random() * 8, // 0-8s delay
        });
      }
      
      setAssets(newAssets);
    };

    generateAssets();
    
    // Regenerate assets every 45 seconds for variety
    const interval = setInterval(generateAssets, 45000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      <AnimatePresence>
        {assets.map((asset) => (
          <motion.div
            key={asset.id}
            className="absolute select-none"
            initial={{ 
              x: `${asset.x}vw`, 
              y: `${asset.y}vh`,
              scale: 0,
              rotate: 0,
              opacity: 0
            }}
            animate={{
              x: [`${asset.x}vw`, `${(asset.x + 30) % 100}vw`, `${(asset.x + 60) % 100}vw`],
              y: [`${asset.y}vh`, `${(asset.y + 20) % 100}vh`, `${(asset.y + 40) % 100}vh`],
              scale: [0, 1, 1, 0.8, 0],
              rotate: [0, 180, 360, 540],
              opacity: [0, 0.8, 0.9, 0.6, 0]
            }}
            transition={{
              duration: asset.duration,
              delay: asset.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              width: `${asset.size}px`,
              height: `${asset.size}px`,
              filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.4))'
            }}
          >
            <img 
              src={asset.image} 
              alt="Space Asset"
              className="w-full h-full object-contain"
              style={{
                filter: 'brightness(1.1) contrast(1.2)',
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Enhanced shooting stars effect */}
      <div className="shooting-stars">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`shooting-${i}`}
            className="absolute w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
            initial={{
              x: -30,
              y: Math.random() * window.innerHeight,
              opacity: 0
            }}
            animate={{
              x: window.innerWidth + 30,
              y: Math.random() * window.innerHeight + 150,
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: 4,
              delay: i * 5,
              repeat: Infinity,
              ease: "easeOut"
            }}
            style={{
              boxShadow: '0 0 25px rgba(59, 130, 246, 0.9), 0 0 50px rgba(147, 51, 234, 0.7)'
            }}
          />
        ))}
      </div>
    </div>
  );
}

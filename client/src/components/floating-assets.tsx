
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingAsset {
  id: string;
  emoji: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const spaceEmojis = [
  '🚀', '🛸', '🌌', '⭐', '🌟', '✨', '🪐', '🌍', '🌎', '🌏', 
  '🌙', '☄️', '🛰️', '👨‍🚀', '👩‍🚀', '🔭', '🌠', '🪨', '🌞', '🌑'
];

export default function FloatingAssets() {
  const [assets, setAssets] = useState<FloatingAsset[]>([]);

  useEffect(() => {
    const generateAssets = () => {
      const newAssets: FloatingAsset[] = [];
      
      // Generate 15 floating assets
      for (let i = 0; i < 15; i++) {
        newAssets.push({
          id: `asset-${i}`,
          emoji: spaceEmojis[Math.floor(Math.random() * spaceEmojis.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 30 + 20, // 20-50px
          duration: Math.random() * 20 + 10, // 10-30s
          delay: Math.random() * 5, // 0-5s delay
        });
      }
      
      setAssets(newAssets);
    };

    generateAssets();
    
    // Regenerate assets every 30 seconds for variety
    const interval = setInterval(generateAssets, 30000);
    
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
              x: [`${asset.x}vw`, `${(asset.x + 20) % 100}vw`, `${(asset.x + 40) % 100}vw`],
              y: [`${asset.y}vh`, `${(asset.y + 15) % 100}vh`, `${(asset.y + 30) % 100}vh`],
              scale: [0, 1, 1, 0],
              rotate: [0, 360, 720],
              opacity: [0, 0.7, 0.7, 0]
            }}
            transition={{
              duration: asset.duration,
              delay: asset.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              fontSize: `${asset.size}px`,
              filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))'
            }}
          >
            {asset.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Shooting stars effect */}
      <div className="shooting-stars">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`shooting-${i}`}
            className="absolute w-2 h-2 bg-white rounded-full"
            initial={{
              x: -20,
              y: Math.random() * window.innerHeight,
              opacity: 0
            }}
            animate={{
              x: window.innerWidth + 20,
              y: Math.random() * window.innerHeight + 100,
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              delay: i * 4,
              repeat: Infinity,
              ease: "easeOut"
            }}
            style={{
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(59, 130, 246, 0.6)'
            }}
          />
        ))}
      </div>
    </div>
  );
}

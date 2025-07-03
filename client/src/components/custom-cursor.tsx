
import { useEffect, useState } from 'react';

const cursorEmojis = ['🚀', '🛸', '⭐', '🌟', '🛰️', '👨‍🚀'];

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState('🚀');

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.classList.contains('cursor-pointer')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    // Change cursor emoji every 3 seconds
    const emojiInterval = setInterval(() => {
      setCurrentEmoji(cursorEmojis[Math.floor(Math.random() * cursorEmojis.length)]);
    }, 3000);

    document.addEventListener('mousemove', updatePosition);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mouseover', handleMouseOver);
      clearInterval(emojiInterval);
    };
  }, []);

  return (
    <div
      className={`custom-cursor ${isHovering ? 'hover' : ''}`}
      style={{
        left: position.x,
        top: position.y,
        filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))'
      }}
    >
      {currentEmoji}
    </div>
  );
}

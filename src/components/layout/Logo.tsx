import React from 'react';
import { Home } from 'lucide-react';

interface LogoProps {
  color?: string;
  size?: number;
  bgColor?: string;
  scale?: number;
}

const Logo: React.FC<LogoProps> = ({ color = 'currentColor', size = 32, bgColor, scale = 1 }) => {
  return (
    <span
      className="inline-flex items-center gap-2 font-bold text-2xl"
      style={{
        backgroundColor: bgColor || 'transparent',
        color: color,
        transform: `scale(${scale})`,
        transformOrigin: 'left center',
      }}
    >
      <Home size={size} strokeWidth={2.5} />
      <span style={{ color }}>Serene Stays</span>
    </span>
  );
};

export default Logo;

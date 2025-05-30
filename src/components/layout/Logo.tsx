import React from 'react';

interface LogoProps {
  color?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ color = 'currentColor', size = 32 }) => {
  return (
    <img 
      src="https://plumeriaretreat.com/wp-content/uploads/2024/09/WhatsApp-Image-2024-09-03-at-1.58.21-PM.jpeg"
      alt="Plumeria Retreat"
      className="h-8 w-auto"
    />
  );
};

export default Logo;
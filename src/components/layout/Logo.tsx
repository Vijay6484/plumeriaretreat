import React from 'react';

interface LogoProps {
  color?: string;
  size?: number;
  bgColor?: string;
  scale?: number; // Optional scale prop
}

const Logo: React.FC<LogoProps> = ({ color = 'currentColor', size = 32, bgColor, scale = 1.5 }) => {
  return (
    <span
      className="inline-flex items-center justify-center rounded"
      style={{
        backgroundColor: bgColor || 'transparent',
        height: size,
        width: 'auto',
        padding: 2,
        transform: `scale(${scale})`, // Zoom out the logo
        transformOrigin: 'center',
      }}
    >
      <img 
        src="https://plumeriaretreat.com/wp-content/uploads/2024/09/WhatsApp-Image-2024-09-03-at-1.58.21-PM.jpeg"
        // src="/home/shubham/Project_Paid/Plumeria_2/plumeriaretreat/public/plumeria-removebg-preview.png"
        alt="Plumeria Retreat"
        style={{
          height: size,
          width: 'auto',
          display: 'block',
        }}
      />
    </span>
  );
};

export default Logo;
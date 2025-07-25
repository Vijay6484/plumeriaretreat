import React from 'react';
import plumeriaLogo from './plumeria-removebg-preview.png'; // Adjust the path as necessary
interface LogoProps {
  color?: string;
  size?: number;
  bgColor?: string;
  scale?: number; // Optional scale prop
}

const Logo: React.FC<LogoProps> = ({ color = 'currentColor', size = 32, bgColor, scale = 1.5 }) => {
  // console.log("logo file", plumeriaLogo);
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
        src={plumeriaLogo} // Adjust the path as necessary
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
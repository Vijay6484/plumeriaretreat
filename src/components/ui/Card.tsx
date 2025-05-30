import React from 'react';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  className = '', 
  children, 
  hoverable = true 
}) => {
  const baseClasses = 'bg-baby-powder rounded-lg shadow-md overflow-hidden';
  const hoverClasses = hoverable ? 'transition-transform duration-300 hover:shadow-lg hover:translate-y-[-4px]' : '';
  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
};

export interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const CardImage: React.FC<CardImageProps> = ({ src, alt, className = '' }) => (
  <div className={`w-full overflow-hidden ${className}`}>
    <img 
      src={src} 
      alt={alt} 
      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
    />
  </div>
);

export interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({ className = '', children }) => (
  <div className={`p-5 ${className}`}>
    {children}
  </div>
);

export interface CardTitleProps {
  className?: string;
  children: React.ReactNode;
}

export const CardTitle: React.FC<CardTitleProps> = ({ className = '', children }) => (
  <h3 className={`text-xl font-bold text-brunswick-green mb-2 ${className}`}>
    {children}
  </h3>
);

export default Card;
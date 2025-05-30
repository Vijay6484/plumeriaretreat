import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  children, 
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-brunswick-green text-baby-powder hover:bg-brunswick-green/90 hover:shadow-lg hover:scale-105 focus:ring-brunswick-green/50',
    secondary: 'bg-rose-taupe text-baby-powder hover:bg-rose-taupe/90 hover:shadow-lg hover:scale-105 focus:ring-rose-taupe/50',
    accent: 'bg-mardi-gras text-baby-powder hover:bg-mardi-gras/90 hover:shadow-lg hover:scale-105 focus:ring-mardi-gras/50',
    outline: 'bg-transparent border-2 border-brunswick-green text-brunswick-green hover:bg-brunswick-green/10 hover:shadow-lg focus:ring-brunswick-green/50'
  };
  
  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-6 text-base',
    lg: 'py-3 px-8 text-lg'
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;
  
  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
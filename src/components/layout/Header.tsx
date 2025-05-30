
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Button from '../ui/Button';
import { navItems } from '../../data';
import Logo from './Logo';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  const toggleMenu = () => setIsOpen(!isOpen);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    // Close mobile menu when route changes
    setIsOpen(false);
  }, [location]);
  
  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-baby-powder shadow-md' 
          : isHomePage 
            ? 'bg-transparent'
            : 'bg-brunswick-green'
      }`}
    >
      <div className="container-custom flex justify-between items-center py-4">
        <Link to="/" className="flex items-center">
          <Logo color={isScrolled ? '#065143' : isHomePage ? 'white' : 'white'} />
          <span className={`ml-2 text-2xl font-bold font-montserrat ${
            isScrolled 
              ? 'text-brunswick-green'
              : 'text-baby-powder'
          }`}>Plumeria</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`font-medium transition-colors ${
                isScrolled 
                  ? 'text-brunswick-green hover:text-rose-taupe'
                  : 'text-baby-powder hover:text-rose-taupe'
              } ${
                location.pathname === item.path ? 'border-b-2 border-rose-taupe' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Button 
            variant={isScrolled ? "primary" : "secondary"} 
            size="md"
          >
            <Link to="/book">Book Now</Link>
          </Button>
        </nav>
        
        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X size={24} className={isScrolled ? 'text-brunswick-green' : 'text-baby-powder'} />
          ) : (
            <Menu size={24} className={isScrolled ? 'text-brunswick-green' : 'text-baby-powder'} />
          )}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-brunswick-green shadow-lg">
          <nav className="container-custom py-4 flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium py-2 px-4 text-baby-powder hover:bg-brunswick-green/80 rounded ${
                  location.pathname === item.path ? 'bg-brunswick-green/80' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Button variant="secondary" size="md" fullWidth className="mt-4">
              <Link to="/book">Book Now</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

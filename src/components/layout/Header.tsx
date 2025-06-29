import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Button from '../ui/Button';
import { navItems } from '../../data';
import Logo from './Logo';

interface NavItem {
  label: string;
  path: string;
  sectionId?: string;
}

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleNavigation = (item: NavItem) => {
    if (item.sectionId) {
      if (isHomePage) {
        // Scroll to section on home page
        const element = document.getElementById(item.sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Navigate to home page then scroll to section
        navigate('/', { state: { scrollTo: item.sectionId } });
      }
    } else {
      // Regular navigation to other pages
      navigate(item.path);
    }
  };

  // Check for scroll target after navigation
  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
          // Clear the state to prevent re-scrolling
          navigate(location.pathname, { replace: true, state: {} });
        }, 100);
      }
    }
  }, [location.state, navigate, location.pathname]);

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-baby-powder shadow-md'
          : isHomePage
            ? 'bg-transparent'
            : 'bg-brunswick-green'
        }`}
    >
      <div className="container-custom flex justify-between items-center py-4">
        <Link to="/" className="flex items-center">
          <Logo color={isScrolled ? '#065143' : isHomePage ? 'white' : 'white'} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={`${item.path}-${item.sectionId || ''}`}
              onClick={() => handleNavigation(item)}
              className={`font-medium transition-colors cursor-pointer ${isScrolled
                  ? 'text-brunswick-green hover:text-rose-taupe'
                  : 'text-baby-powder hover:text-rose-taupe'
                } ${(location.pathname === item.path &&
                  (!item.sectionId || location.hash === `#${item.sectionId}`))
                  ? 'border-b-2 border-rose-taupe'
                  : ''
                }`}
            >
              {item.label}
            </button>
          ))}
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
              <button
                key={`${item.path}-${item.sectionId || ''}`}
                onClick={() => {
                  handleNavigation(item);
                  setIsOpen(false);
                }}
                className={`font-medium py-2 px-4 text-baby-powder hover:bg-brunswick-green/80 rounded cursor-pointer ${(location.pathname === item.path &&
                    (!item.sectionId || location.hash === `#${item.sectionId}`))
                    ? 'bg-brunswick-green/80'
                    : ''
                  }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
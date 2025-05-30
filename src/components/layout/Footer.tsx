import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import Logo from './Logo';
import { navItems } from '../../data';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-brunswick-green text-baby-powder pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div>
            <Link to="/" className="flex items-center mb-4">
              <Logo color="white" />
              <span className="ml-2 text-2xl font-bold font-montserrat">Plumeria</span>
            </Link>
            <p className="mb-4 text-baby-powder/80">
              Experience the perfect lakeside getaway with our premium cottages, luxury tents and exciting activities.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-baby-powder hover:text-rose-taupe transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-baby-powder hover:text-rose-taupe transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-baby-powder hover:text-rose-taupe transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-montserrat">Quick Links</h3>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className="hover:text-rose-taupe transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  to="/book" 
                  className="hover:text-rose-taupe transition-colors"
                >
                  Book Now
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-montserrat">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={20} className="mr-2 mt-1 flex-shrink-0" />
                <span>123 Lakeside Drive, Nature Valley, CA 94123</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 flex-shrink-0" />
                <span>info@plumeriaretreat.com</span>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-montserrat">Newsletter</h3>
            <p className="mb-4 text-baby-powder/80">
              Subscribe to our newsletter for special deals and updates.
            </p>
            <form className="flex flex-col">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 mb-2 rounded bg-white/10 border border-white/20 text-baby-powder placeholder:text-baby-powder/60 focus:outline-none focus:ring-2 focus:ring-rose-taupe"
              />
              <button
                type="submit"
                className="bg-rose-taupe text-baby-powder py-2 px-4 rounded transition-colors hover:bg-rose-taupe/90"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-12 pt-8 text-center text-baby-powder/60">
          <p>&copy; {currentYear} Plumeria Retreat. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
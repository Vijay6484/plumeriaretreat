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
            </Link>
            <p className="mb-4 text-baby-powder/80">
              Experience the perfect lakeside getaway with our premium cottages, luxury tents and exciting activities.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/share/19pYGAqJzH/" className="text-baby-powder hover:text-rose-taupe transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/plumeriaretreatpawnalake?utm_source=qr&igsh=OGgzYWY0b3FzbWUw" className="text-baby-powder hover:text-rose-taupe transition-colors">
                <Instagram size={20} />
              </a>
              {/* <a href="#" className="text-baby-powder hover:text-rose-taupe transition-colors">
                <Twitter size={20} />
              </a> */}
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
            </ul>
          </div>
          
          {/* Legal Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-montserrat">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/terms-conditions" 
                  className="hover:text-rose-taupe transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link 
                  to="/cancellation-policy" 
                  className="hover:text-rose-taupe transition-colors"
                >
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy-policy" 
                  className="hover:text-rose-taupe transition-colors"
                >
                  Privacy Policy
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
                <span>Pawna lakeside Cottages
Address:
At-Bramhanoli, Fangne,
Post- Pawna nagar, Tel- Maval,
Dist- Pune, Pawna Lake,
Maharashtra 410406</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 flex-shrink-0" />
                <span>+919226869678</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 flex-shrink-0" />
                <span>booking@plumeriaretreat.com</span>
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
        
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-baby-powder/60">
            <div className="text-center md:text-left">
              <p>&copy; {currentYear} Plumeria Retreat. All rights reserved.</p>
              <p className="text-sm mt-1">Operated by Pawanai Agro Tourism</p>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <span className="mr-2">Powered by</span>
              <a 
                href="https://digitaldiaries.in.net" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center hover:text-rose-taupe transition-colors"
              >
                <img 
                  src="https://digitaldiaries.in.net/black_logo.png" 
                  alt="Digital Diaries" 
                  className="h-6 mr-2 rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling!.textContent = 'Digital Diaries';
                  }}
                />
                <span className="text-white">Digital Diaries</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
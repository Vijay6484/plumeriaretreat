import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';
import Logo from './Logo';
import { navItems } from '../../data';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-primary via-primary-dark to-neutral-dark text-neutral-light pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center mb-4">
              <Logo color="white" size={28} />
            </Link>
            <p className="mb-4 text-neutral-light/80 leading-relaxed">
              Elevate your getaway experience with our exclusive lakeside cottages, sophisticated accommodations, and unforgettable adventures.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/share/19pYGAqJzH/"
                className="text-neutral-light hover:text-secondary transition-colors p-2 rounded-lg hover:bg-white/10"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/plumeriaretreatpawnalake?utm_source=qr&igsh=OGgzYWY0b3FzbWUw"
                className="text-neutral-light hover:text-secondary transition-colors p-2 rounded-lg hover:bg-white/10"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 font-montserrat">Quick Links</h3>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="hover:text-secondary transition-colors hover:pl-2 inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 font-montserrat">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/terms-conditions"
                  className="hover:text-secondary transition-colors hover:pl-2 inline-block"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/cancellation-policy"
                  className="hover:text-secondary transition-colors hover:pl-2 inline-block"
                >
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-secondary transition-colors hover:pl-2 inline-block"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 font-montserrat">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={20} className="mr-2 mt-1 flex-shrink-0 text-secondary" />
                <span className="text-sm">Pawna Lakeside, At-Bramhanoli, Fangne, Post-Pawna Nagar, Tal-Maval, Dist-Pune, Maharashtra 410406</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 flex-shrink-0 text-secondary" />
                <a href="tel:+919226869678" className="hover:text-secondary transition-colors">+91 9226869678</a>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 flex-shrink-0 text-secondary" />
                <a href="mailto:booking@plumeriaretreat.com" className="hover:text-secondary transition-colors text-sm">booking@plumeriaretreat.com</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 font-montserrat">Stay Updated</h3>
            <p className="mb-4 text-neutral-light/80 text-sm">
              Join our newsletter for exclusive offers and curated experiences.
            </p>
            <form className="flex flex-col">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 mb-2 rounded-lg bg-white/10 border border-white/20 text-neutral-light placeholder:text-neutral-light/50 focus:outline-none focus:ring-2 focus:ring-secondary backdrop-blur-sm"
              />
              <button
                type="submit"
                className="bg-secondary text-white py-3 px-4 rounded-lg font-medium transition-all hover:bg-secondary/90 hover:shadow-lg"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-neutral-light/70">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p>&copy; {currentYear} Serene Stays. All rights reserved.</p>
              <p className="text-sm mt-1">Operated by Pawanai Agro Tourism</p>
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-sm">Powered by</span>
              <a
                href="https://digitaldiaries.in.net"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:text-secondary transition-colors"
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
                <span className="text-white font-medium">Digital Diaries</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

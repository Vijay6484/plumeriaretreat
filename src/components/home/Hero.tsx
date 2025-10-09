import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { navItems } from '../../data';

const Hero: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleScrollToSection = (sectionId: string) => {
    if (location.pathname === '/') {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <div className="relative min-h-screen bg-hero-pattern bg-cover bg-center flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-secondary/60 to-primary-dark/70"></div>

      <div className="container-custom relative z-10 text-neutral-light">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
              Premium Waterfront Experience
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold font-montserrat mb-6 text-shadow leading-tight">
            Discover Your Perfect
            <span className="block text-secondary mt-2">Lakeside Retreat</span>
          </h1>

          <p className="text-xl md:text-2xl mb-10 text-shadow opacity-95 leading-relaxed max-w-2xl">
            Indulge in luxurious accommodations and unforgettable adventures. Where tranquility meets sophistication.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => handleScrollToSection('campsites')}
              className="shadow-xl hover:shadow-2xl"
            >
              Browse Accommodations
            </Button>
            <Button
              variant="outline"
              size="lg"
              as={Link}
              to="/gallery"
              className="!text-neutral-light !border-neutral-light/80 !bg-white/5 backdrop-blur-sm !hover:bg-white/15 !hover:text-neutral-light !hover:border-neutral-light shadow-lg"
            >
              Explore Gallery
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-12 left-0 right-0 flex justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          <a
            href="#highlights"
            className="text-neutral-light flex flex-col items-center animate-bounce opacity-80 hover:opacity-100 transition-opacity"
            aria-label="Scroll down"
          >
            <span className="mb-2 text-sm font-medium">Scroll to Explore</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 13L12 18L17 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 7L12 12L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;

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
      // Already on home page - scroll to section
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to home first then scroll
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
  <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-black/80 via-black/0 to-black/90"></div>


      
      <div className="container-custom relative z-10 text-baby-powder">
       <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  className="max-w-3xl text-center mx-auto flex flex-col items-center"
>
  <h1 className="uppercase text-3xl md:text-6xl font-bold font-montserrat mb-4 text-shadow">
    Plumeria Retreat
  </h1>

  <h4 className="text-xl md:text-3xl font-bold font-montserrat mb-3 text-shadow">
    Pawna lake side cottages
  </h4>

  {/* <p className="text-xl md:text-2xl mb-8 text-shadow">
    Tents, cottages & campfires under the stars. Experience nature's beauty with modern comforts.
  </p> */}

  {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
    <Button 
      variant="secondary" 
      size="lg"
      onClick={() => handleScrollToSection('campsites')}
    >
      Explore Campsites
    </Button>

    <Button 
      variant="outline" 
      size="lg"
      as={Link}
      to="/gallery"
      className="!text-baby-powder !border-baby-powder !bg-transparent !hover:bg-white/10 !hover:text-baby-powder !hover:border-baby-powder"
    >
      View Gallery
    </Button>
  </div> */}
</motion.div>

      </div>
      
      
      <div className="absolute bottom-10 left-0 right-0 flex justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <a 
            href="#highlights" 
            className="text-baby-powder flex flex-col items-center animate-bounce"
            aria-label="Scroll down"
          >
            <span className="mb-2">Discover More</span>
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
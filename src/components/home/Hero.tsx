import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-hero-pattern bg-cover bg-center flex items-center">
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-brunswick-green/60"></div>
      
      <div className="container-custom relative z-10 text-baby-powder">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold font-montserrat mb-4 text-shadow">
            Your Lakeside Escape Awaits!
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-shadow">
            Tents, cottages & campfires under the stars. Experience nature's beauty with modern comforts.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="secondary" 
              size="lg"
              as={Link}
              to="/campsites"
            >
              Explore Campsites
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              as={Link}
              to="/book"
              className="text-baby-powder border-baby-powder bg-black/30 hover:bg-black/40 .btn-secondary"
            >
              Book Now
            </Button>
          </div>
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
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

const heroSlides = [
  {
    title: "Plumeria Retreat",
    subtitle: "Pawna lake side cottages",
    bgClass: "bg-hero-pattern"
  },
  {
    title: "Luxury Cottages",
    subtitle: "Experience comfort in the lap of nature",
    bgImage: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1"
  },
  {
    title: "Premium Villas",
    subtitle: "Your private sanctuary by the lake",
    bgImage: "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1"
  },
  {
    title: "Adventure Tents",
    subtitle: "Camp under the stars with modern amenities",
    bgImage: "https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1"
  }
];

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Images with Crossfade */}
      {heroSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10'
          } ${slide.bgClass || ''}`}
          style={slide.bgImage ? { backgroundImage: `url('${slide.bgImage}')` } : undefined}
        />
      ))}

      {/* Dark Overlay for Text Readability */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-black/80 via-black/40 to-black/90 z-10"></div>
      
      {/* Dynamic Content */}
      <div className="container-custom relative z-20 text-baby-powder w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl text-center mx-auto flex flex-col items-center"
          >
            <h1 className="uppercase text-3xl md:text-6xl font-bold font-montserrat mb-4 text-shadow tracking-wide drop-shadow-xl">
              {heroSlides[currentSlide].title}
            </h1>
            <h4 className="text-xl md:text-3xl font-montserrat mb-3 text-shadow drop-shadow-md text-white/90">
              {heroSlides[currentSlide].subtitle}
            </h4>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Scroll Down Indicator */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center z-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <a 
            href="#highlights" 
            className="text-baby-powder flex flex-col items-center animate-bounce hover:text-white transition-colors"
            aria-label="Scroll down"
          >
            <span className="mb-2 font-medium tracking-wide">Discover More</span>
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
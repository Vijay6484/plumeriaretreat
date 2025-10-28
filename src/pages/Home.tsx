import React, { useEffect } from 'react';
import Hero from '../components/home/Hero';
import Highlights from '../components/home/Highlights';
import Campsites from '../components/home/Campsites';
import GalleryPreview from '../components/home/GalleryPreview';
import WeatherWidget from '../components/home/WeatherWidget';
import CallToAction from '../components/home/CallToAction';
import NearbyLocations from '../components/home/NearbyLocations';
import WhatsAppButton from '../components/ui/WhatsAppButton';
import { trackPageView } from '../utils/analytics';

const Home: React.FC = () => {
  useEffect(() => {
    document.title = 'Plumeria Retreat - Lakeside Camping & Cottages';
    
    // Track page view for Google Analytics
    trackPageView('/', 'Home');
    
    // Handle scroll to section if hash is present in URL
    if (window.location.hash) {
      const sectionId = window.location.hash.substring(1);
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);
  
  return (
    <div className="relative">
      <section id="home">
        <Hero />
      </section>
      <Highlights />
      <section id="campsites">
        <Campsites />
      </section>
      <WeatherWidget />
      <section id="gallery">
        <GalleryPreview />
      </section>
      <NearbyLocations />
      <WhatsAppButton />
    </div>
  );
};

export default Home;
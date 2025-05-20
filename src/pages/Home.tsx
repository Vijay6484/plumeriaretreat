import React, { useEffect } from 'react';
import Hero from '../components/home/Hero';
import Highlights from '../components/home/Highlights';
import FeaturedCampsites from '../components/home/FeaturedCampsites';
import Testimonials from '../components/home/Testimonials';
import GalleryPreview from '../components/home/GalleryPreview';
import WeatherWidget from '../components/home/WeatherWidget';
import CallToAction from '../components/home/CallToAction';
import NearbyLocations from '../components/home/NearbyLocations';

const Home: React.FC = () => {
  useEffect(() => {
    document.title = 'Plumeria Retreat - Lakeside Camping & Cottages';
  }, []);
  
  return (
    <div>
      <Hero />
      <Highlights />
      <FeaturedCampsites />
      <WeatherWidget />
      <NearbyLocations />
      <Testimonials />
      <GalleryPreview />
      <CallToAction />
    </div>
  );
};

export default Home;
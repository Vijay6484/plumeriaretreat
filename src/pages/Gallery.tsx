import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface GalleryImage {
  id: number;
  url: string;
  alt: string;
  category: string;
  source: string;
}

const Gallery: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'nature' | 'accommodation' | 'package' | 'activity' | 'testimonial' | 'nearby'>('all');
  const [images, setImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    document.title = 'Gallery - Plumeria Retreat';
    fetch('https://plumeriaretreatback-production.up.railway.app/api/all-images')
      .then(res => res.json())
      .then(setImages)
      .catch(() => setImages([]));
  }, []);

  const filteredImages = images.filter(image =>
    filter === 'all' ? true : image.category === filter
  );

  return (
    <div className="min-h-screen bg-baby-powder">
      <div className="h-[40vh] bg-brunswick-green relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/3045272/pexels-photo-3045272.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')"
          }}
        ></div>
        <div className="container-custom h-full flex items-center relative z-10">
          <div className="text-baby-powder">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Gallery</h1>
            <p className="text-xl opacity-90">Explore the beauty of Plumeria Retreat</p>
          </div>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="flex justify-center mb-8 space-x-4">
          <button onClick={() => setFilter('all')} className={`px-6 py-2 rounded-full ${filter === 'all' ? 'bg-brunswick-green text-baby-powder' : 'bg-brunswick-green/10 text-brunswick-green hover:bg-brunswick-green/20'}`}>All</button>
          <button onClick={() => setFilter('nature')} className={`px-6 py-2 rounded-full ${filter === 'nature' ? 'bg-brunswick-green text-baby-powder' : 'bg-brunswick-green/10 text-brunswick-green hover:bg-brunswick-green/20'}`}>Nature</button>
          <button onClick={() => setFilter('accommodation')} className={`px-6 py-2 rounded-full ${filter === 'accommodation' ? 'bg-brunswick-green text-baby-powder' : 'bg-brunswick-green/10 text-brunswick-green hover:bg-brunswick-green/20'}`}>Accommodation</button>
          <button onClick={() => setFilter('package')} className={`px-6 py-2 rounded-full ${filter === 'package' ? 'bg-brunswick-green text-baby-powder' : 'bg-brunswick-green/10 text-brunswick-green hover:bg-brunswick-green/20'}`}>Package</button>
          <button onClick={() => setFilter('activity')} className={`px-6 py-2 rounded-full ${filter === 'activity' ? 'bg-brunswick-green text-baby-powder' : 'bg-brunswick-green/10 text-brunswick-green hover:bg-brunswick-green/20'}`}>Activity</button>
          <button onClick={() => setFilter('testimonial')} className={`px-6 py-2 rounded-full ${filter === 'testimonial' ? 'bg-brunswick-green text-baby-powder' : 'bg-brunswick-green/10 text-brunswick-green hover:bg-brunswick-green/20'}`}>Testimonial</button>
          <button onClick={() => setFilter('nearby')} className={`px-6 py-2 rounded-full ${filter === 'nearby' ? 'bg-brunswick-green text-baby-powder' : 'bg-brunswick-green/10 text-brunswick-green hover:bg-brunswick-green/20'}`}>Nearby</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.source + '-' + image.id + '-' + index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group overflow-hidden rounded-lg aspect-square"
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-brunswick-green/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-baby-powder font-medium text-shadow px-4 text-center">
                  {image.alt}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
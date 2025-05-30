import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { galleryImages } from '../../data';
import Button from '../ui/Button';

const GalleryPreview: React.FC = () => {
  // Select 4 images for the preview
  const previewImages = galleryImages.slice(0, 4);
  
  return (
    <section className="section-padding bg-baby-powder">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-montserrat text-brunswick-green">
            Moments at Plumeria
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-black/70">
            Explore snapshots of adventures, accommodations, and the natural beauty of our retreat.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {previewImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative group overflow-hidden rounded-lg"
            >
              <img 
                src={image.src} 
                alt={image.alt} 
                className="w-full h-48 md:h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-brunswick-green/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-baby-powder font-medium text-shadow">{image.alt}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Button variant="secondary">
            <Link to="/gallery">View Full Gallery</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GalleryPreview;
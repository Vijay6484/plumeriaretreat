import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './Gallery.css'; // Assuming you have a CSS file for custom styles
interface GalleryImage {
  id: number;
  url: string;
  alt: string;
  category: string;
  source: string;
}

const API_BASE_URL = 'https://plumeriaretreatback-production.up.railway.app';

// Use this for local development:
// const API_BASE_URL = 'http://localhost:5001';

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
        <div className="flex overflow-x-auto space-x-4 mb-8 px-4 sm:justify-center no-scrollbar">
          <button onClick={() => setFilter('all')} className={`px-6 py-2 rounded-full ${filter === 'all' ? 'bg-brunswick-green text-baby-powder' : 'bg-brunswick-green/10 text-brunswick-green hover:bg-brunswick-green/20'}`}>All</button>
          <button onClick={() => setFilter('nature')} className={`px-6 py-2 rounded-full ${filter === 'nature' ? 'bg-brunswick-green text-baby-powder' : 'bg-brunswick-green/10 text-brunswick-green hover:bg-brunswick-green/20'}`}>Nature</button>
          <button onClick={() => setFilter('accommodation')} className={`px-6 py-2 rounded-full ${filter === 'accommodation' ? 'bg-brunswick-green text-baby-powder' : 'bg-brunswick-green/10 text-brunswick-green hover:bg-brunswick-green/20'}`}>Accommodation</button>
          <button onClick={() => setFilter('activity')} className={`px-6 py-2 rounded-full ${filter === 'activity' ? 'bg-brunswick-green text-baby-powder' : 'bg-brunswick-green/10 text-brunswick-green hover:bg-brunswick-green/20'}`}>Activity</button>
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



// import React, { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';

// interface GalleryImage {
//   id: number;
//   url: string;
//   alt: string;
//   category: string;
//   source: string;
// }

// const API_BASE_URL = 'https://plumeriaretreatback-production.up.railway.app';
// // const API_BASE_URL = 'http://localhost:5001'; // Use for local dev

// const Gallery: React.FC = () => {
//   const [filter, setFilter] = useState<string>('all');
//   const [images, setImages] = useState<GalleryImage[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<boolean>(false);

//   useEffect(() => {
//     document.title = 'Gallery - Plumeria Retreat';
//     console.log('Fetching images from API:', `${API_BASE_URL}/api/all-images`);
//     fetch(`${API_BASE_URL}/api/all-images`)
//       .then(res => res.json())
//       .then(data => {
//         console.log('Fetched images:', data);
//         setImages(data);
//         setError(false);
//       })
//       .catch(() => {
//         setError(true);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   // Unique categories from images + "all"
//   const categories = ['all', ...Array.from(new Set(images.map(img => img.category)))];

//   const filteredImages = images.filter(image =>
//     filter === 'all' ? true : image.category === filter
//   );

//   return (
//     <div className="min-h-screen bg-baby-powder">
//       {/* Banner Section */}
//       <div className="h-[40vh] bg-brunswick-green relative overflow-hidden">
//         <div 
//           className="absolute inset-0 bg-cover bg-center opacity-30"
//           style={{ 
//             backgroundImage: "url('https://images.pexels.com/photos/3045272/pexels-photo-3045272.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')"
//           }}
//         />
//         <div className="container-custom h-full flex items-center relative z-10">
//           <div className="text-baby-powder">
//             <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Gallery</h1>
//             <p className="text-xl opacity-90">Explore the beauty of Plumeria Retreat</p>
//           </div>
//         </div>
//       </div>

//       {/* Content Section */}
//       <div className="container-custom py-16">
//         {/* Filter Buttons */}
//         <div className="flex flex-wrap justify-center gap-4 mb-10">
//           {categories.map(cat => (
//             <button
//               key={cat}
//               onClick={() => setFilter(cat)}
//               className={`px-6 py-2 rounded-full capitalize ${
//                 filter === cat
//                   ? 'bg-brunswick-green text-baby-powder'
//                   : 'bg-brunswick-green/10 text-brunswick-green hover:bg-brunswick-green/20'
//               }`}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>

//         {/* Error / Loading */}
//         {loading && <p className="text-center text-gray-500">Loading images...</p>}
//         {error && <p className="text-center text-red-500">Failed to load gallery images.</p>}

//         {/* Image Grid */}
//         {!loading && !error && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredImages.map((image, index) => (
//               <motion.div
//                 key={image.source + '-' + image.id + '-' + index}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.1 }}
//                 className="relative group overflow-hidden rounded-lg aspect-square"
//               >
//                 <img
//                   src={image.url}
//                   alt={image.alt}
//                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                 />
//                 <div className="absolute inset-0 bg-brunswick-green/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
//                   <p className="text-baby-powder font-medium text-shadow px-4 text-center">
//                     {image.alt}
//                   </p>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Gallery;

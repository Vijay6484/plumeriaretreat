import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './Gallery.css';

interface GalleryImage {
  id: number;
  url: string;
  alt: string;
  category: string;
  source: string;
}

const API_BASE_URL = 'https://api.plumeriaretreat.com/user';

// Local fallback image (you can replace this with your own image)
const FALLBACK_IMAGE = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500"%3E%3Crect fill="%23f0f0f0" width="500" height="500"/%3E%3Ctext fill="%23666" font-family="sans-serif" font-size="16" dy=".35em" x="50%" y="50%" text-anchor="middle"%3EImage Not Available%3C/text%3E%3C/svg%3E';

const Gallery: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'nature' | 'accommodation' | 'package' | 'activity' | 'testimonial' | 'nearby'>('all');
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Gallery - Plumeria Retreat';
    const fetchImages = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/all-images`);
        if (!response.ok) throw new Error('Failed to fetch images');
        
        let data: GalleryImage[] = await response.json();
        
        // Clean up the data
        data = data.map(img => ({
          ...img,
          // Fix malformed URL if it's an array string
          url: img.url.startsWith('["') ? JSON.parse(img.url)[0] : img.url,
          // Ensure all images have a valid category
          category: img.category || 'uncategorized'
        }));
        
        setImages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        console.error('Error fetching images:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const filteredImages = images.filter(image =>
    filter === 'all' ? true : image.category.toLowerCase() === filter
  );

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = FALLBACK_IMAGE;
    target.alt = 'Image not available';
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;

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
        
        {filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-brunswick-green">No images found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image, index) => (
              <motion.div
                key={`${image.source}-${image.id}-${index}`}
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
                  onError={handleImageError}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-brunswick-green/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <p className="text-baby-powder font-medium text-shadow px-4 text-center">
                    {image.alt}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
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

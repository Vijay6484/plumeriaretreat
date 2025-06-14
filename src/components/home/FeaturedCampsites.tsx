// import React from 'react';
// import { motion } from 'framer-motion';
// import { Link } from 'react-router-dom';
// // import { packages } from '../../data';
// import Card, { CardImage, CardContent, CardTitle } from '../ui/Card';
// import Button from '../ui/Button';

// const FeaturedCampsites: React.FC = () => {
//   // Display only the first 2 packages
//   const featuredPackages = packages.slice(0, 2);

//   return (
//     <section className="section-padding bg-brunswick-green/5">
//       <div className="container-custom">
//         <motion.div
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           viewport={{ once: true }}
//           className="text-center mb-12"
//         >
//           <h2 className="text-3xl md:text-4xl font-bold mb-4 font-montserrat text-brunswick-green">
//             Featured Packages
//           </h2>
//           <p className="text-lg max-w-2xl mx-auto text-black/70">
//             From luxury cottages to authentic camping experiences, find the perfect stay for your retreat.
//           </p>
//         </motion.div>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {featuredPackages.map((pkg, index) => (
//             <motion.div
//               key={pkg.id}
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: index * 0.2, duration: 0.5 }}
//             >
//               <Card className="h-full flex flex-col">
//                 <CardImage 
//                   src={pkg.image_url} 
//                   alt={pkg.name}
//                   className="h-48 sm:h-64 object-cover"
//                 />
//                 <CardContent className="flex-1 flex flex-col">
//                   <div className="flex-1">
//                     <div className="flex items-center mb-2">
//                       <span className="text-xs font-semibold px-2 py-1 bg-brunswick-green text-baby-powder rounded-full mr-2">
//                         {pkg.duration} Nights
//                       </span>
//                       <span className="text-xs font-semibold px-2 py-1 bg-brunswick-green/10 text-brunswick-green rounded-full">
//                         Up to {pkg.max_guests} guests
//                       </span>
//                     </div>
//                     <CardTitle>{pkg.name}</CardTitle>
//                     <p className="text-black/70 mb-3 line-clamp-3">{pkg.description}</p>
//                     <div className="flex flex-wrap gap-1 mb-4">
//                       {pkg.includes.slice(0, 3).map((feature: string, i: number) => (
//                         <span key={i} className="text-xs px-2 py-1 bg-rose-taupe/10 text-rose-taupe rounded-full">
//                           {feature}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                   <div className="flex justify-between items-center mt-4">
//                     <p className="font-bold text-brunswick-green">
//                       ₹{pkg.price}
//                       <span className="text-black/60 font-normal text-sm"> / package</span>
//                     </p>
//                     <Button variant="primary" size="sm">
//                       <Link to={`/packages/${pkg.id}`}>View Details</Link>
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           ))}
//         </div>
        
//         <div className="text-center mt-12">
//           <Button variant="secondary" size="lg">
//             <Link to="/packages">View All Packages</Link>
//           </Button>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default FeaturedCampsites;
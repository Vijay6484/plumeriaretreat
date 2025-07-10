import React from 'react';
import { motion } from 'framer-motion';
import { nearbyLocations } from '../../data';
import Card, { CardImage, CardContent } from '../ui/Card';
import { MapPin } from 'lucide-react';

const NearbyLocations: React.FC = () => {
  // Group locations into sets of 3 for the stacked layout
  const groupedLocations = [];
  for (let i = 0; i < nearbyLocations.length; i += 3) {
    groupedLocations.push(nearbyLocations.slice(i, i + 3));
  }

  return (
    <section className="section-padding bg-brunswick-green/5 py-16">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-montserrat text-brunswick-green">
            Explore Nearby Locations
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-black/70">
            Discover amazing attractions and historical sites within easy reach of Plumeria Retreat
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {groupedLocations.map((group, groupIndex) => (
            <div key={groupIndex} className="relative h-80 w-full max-w-sm mx-auto">
              {/* Stacked Cards Layout */}
              {group.map((location, cardIndex) => {
                const isTopCard = cardIndex === 0;
                const isMiddleCard = cardIndex === 1;
                const isBottomCard = cardIndex === 2;
                
                return (
                  <motion.div
                    key={location.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (groupIndex * 3 + cardIndex) * 0.1 }}
                    className={`absolute w-full transition-all duration-300 hover:z-30 group cursor-pointer ${
                      isTopCard 
                        ? 'z-20 top-0 left-0 hover:scale-105 hover:-translate-y-2' 
                        : isMiddleCard 
                        ? 'z-10 top-4 left-2 hover:scale-105 hover:-translate-y-1 hover:translate-x-1' 
                        : 'z-0 top-8 left-4 hover:scale-105 hover:translate-x-2'
                    }`}
                    style={{
                      transform: isTopCard 
                        ? 'none' 
                        : isMiddleCard 
                        ? 'rotate(-2deg)' 
                        : 'rotate(-4deg)'
                    }}
                  >
                    <Card className={`h-72 flex flex-col shadow-lg rounded-lg overflow-hidden bg-white border-2 transition-all duration-300 ${
                      isTopCard 
                        ? 'border-brunswick-green shadow-xl' 
                        : isMiddleCard 
                        ? 'border-rose-taupe/50 shadow-lg' 
                        : 'border-gray-300 shadow-md'
                    } group-hover:border-brunswick-green group-hover:shadow-2xl`}>
                      <CardImage
                        src={location.image}
                        alt={location.name}
                        className="h-40 w-full object-cover"
                      />
                      <CardContent className="flex-1 flex flex-col justify-between p-3">
                        <div>
                          <h3 className={`font-bold mb-2 text-brunswick-green transition-all duration-300 ${
                            isTopCard ? 'text-lg' : 'text-base'
                          }`}>
                            {location.name}
                          </h3>
                          <div className="flex items-center mb-2 text-rose-taupe">
                            <MapPin size={14} className="mr-1" />
                            <span className="text-sm">{location.distance} km away</span>
                          </div>
                          <p className={`text-black/70 line-clamp-2 ${
                            isTopCard ? 'text-sm' : 'text-xs'
                          }`}>
                            {location.description}
                          </p>
                        </div>
                        
                        {/* Card indicator */}
                        <div className="flex justify-center mt-2">
                          <div className={`w-2 h-2 rounded-full ${
                            isTopCard 
                              ? 'bg-brunswick-green' 
                              : isMiddleCard 
                              ? 'bg-rose-taupe' 
                              : 'bg-gray-400'
                          }`}></div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
              
              {/* Stack indicator */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {group.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === 0 
                        ? 'bg-brunswick-green' 
                        : index === 1 
                        ? 'bg-rose-taupe' 
                        : 'bg-gray-400'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex justify-center mt-12 space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-brunswick-green rounded-full mr-2"></div>
            <span className="text-gray-600">Featured Location</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-rose-taupe rounded-full mr-2"></div>
            <span className="text-gray-600">Popular Spot</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
            <span className="text-gray-600">Worth Visiting</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NearbyLocations;
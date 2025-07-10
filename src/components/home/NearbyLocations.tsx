import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';
import { nearbyLocations } from '../../data';
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const NearbyLocations: React.FC = () => {
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

        <div className="relative max-w-6xl mx-auto">
          <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            modules={[EffectCoverflow, Pagination, Navigation]}
            className="nearby-locations-swiper"
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
            }}
          >
            {nearbyLocations.map((location, index) => (
              <SwiperSlide key={location.id} className="nearby-slide">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="h-full"
                >
                  <div className="nearby-slide-card bg-white rounded-2xl shadow-xl overflow-hidden h-96 relative group cursor-pointer transform transition-all duration-300 hover:scale-105">
                    <div className="nearby-slide-img h-64 overflow-hidden">
                      <img
                        src={location.image}
                        alt={location.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    
                    <div className="nearby-slide-content absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                      <div className="absolute top-4 right-4">
                        <span className="bg-brunswick-green text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {location.distance} km
                        </span>
                      </div>
                      
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="text-xl font-bold mb-2 text-shadow">
                          {location.name}
                        </h3>
                        <div className="flex items-center mb-2">
                          <MapPin size={16} className="mr-1 text-rose-taupe" />
                          <span className="text-sm opacity-90">{location.distance} km away</span>
                        </div>
                        <p className="text-sm opacity-90 line-clamp-2">
                          {location.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <div className="swiper-navigation-controls">
            <button className="swiper-button-prev-custom slider-arrow">
              <ChevronLeft size={24} />
            </button>
            <button className="swiper-button-next-custom slider-arrow">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NearbyLocations;
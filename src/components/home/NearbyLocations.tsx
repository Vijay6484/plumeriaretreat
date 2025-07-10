import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';
import { nearbyLocations } from '../../data';
import Card, { CardImage, CardContent } from '../ui/Card';
import { MapPin } from 'lucide-react';
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

        <div className="relative">
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
            navigation={true}
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
              <SwiperSlide key={location.id} className="max-w-sm">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="h-full px-2"
                >
                  <Card className="h-full flex flex-col shadow-lg rounded-lg overflow-hidden bg-white">
                    <CardImage
                      src={location.image}
                      alt={location.name}
                      className="h-48 w-full object-cover"
                    />
                    <CardContent className="flex-1 flex flex-col justify-between p-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-brunswick-green">{location.name}</h3>
                        <div className="flex items-center mb-2 text-rose-taupe">
                          <MapPin size={16} className="mr-1" />
                          <span>{location.distance} km away</span>
                        </div>
                        <p className="text-black/70">{location.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default NearbyLocations;
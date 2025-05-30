import React from 'react';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import { nearbyLocations } from '../../data';
import Card, { CardImage, CardContent } from '../ui/Card';
import { MapPin } from 'lucide-react';

const NearbyLocations: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <section className="section-padding bg-brunswick-green/5">
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

        <Slider {...settings} className="nearby-locations-slider">
          {nearbyLocations.map((location, index) => (
            <div key={location.id} className="px-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardImage
                    src={location.image}
                    alt={location.name}
                    className="h-48"
                  />
                  <CardContent>
                    <h3 className="text-xl font-bold mb-2 text-brunswick-green">{location.name}</h3>
                    <div className="flex items-center mb-2 text-rose-taupe">
                      <MapPin size={16} className="mr-1" />
                      <span>{location.distance} km away</span>
                    </div>
                    <p className="text-black/70">{location.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default NearbyLocations;
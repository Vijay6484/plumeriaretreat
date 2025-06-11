import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { accommodations } from '../data';
import { formatCurrency } from '../utils/helpers';
import Card, { CardImage, CardContent, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';

const Campsites: React.FC = () => {
  useEffect(() => {
    document.title = 'Campsites - Plumeria Retreat';
  }, []);

  return (
    <div className="min-h-screen bg-baby-powder">
      <div className="h-[40vh] bg-brunswick-green relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/2662816/pexels-photo-2662816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')"
          }}
        ></div>
        <div className="container-custom h-full flex items-center relative z-10">
          <div className="text-baby-powder">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Accommodations</h1>
            <p className="text-xl opacity-90">Find your perfect stay at Plumeria Retreat</p>
          </div>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {accommodations.map((accommodation, index) => (
            <motion.div
              key={accommodation.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="h-full flex flex-col">
                <CardImage 
                  src={accommodation.image} 
                  alt={accommodation.title}
                  className="h-48 sm:h-64"
                />
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-xs font-semibold px-2 py-1 bg-brunswick-green text-baby-powder rounded-full mr-2">
                        {accommodation.type}
                      </span>
                      <span className="text-xs font-semibold px-2 py-1 bg-brunswick-green/10 text-brunswick-green rounded-full">
                        Up to {accommodation.capacity} people
                      </span>
                    </div>
                    <CardTitle>{accommodation.title}</CardTitle>
                    <p className="text-black/70 mb-3">{accommodation.description}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {accommodation.features.slice(0, 3).map((feature, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-rose-taupe/10 text-rose-taupe rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-brunswick-green mb-2">
                      {accommodation.availableRooms} rooms available
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <p className="font-bold text-brunswick-green">
                      {formatCurrency(accommodation.price)}
                      <span className="text-black/60 font-normal text-sm"> / night</span>
                    </p>
                    <Button variant="primary" size="sm">
                      <Link to={`/campsites/${accommodation.id}`}>Book Now</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Campsites;
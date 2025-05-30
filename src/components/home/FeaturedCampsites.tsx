import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { accommodations } from '../../data';
import { formatCurrency } from '../../utils/helpers';
import Card, { CardImage, CardContent, CardTitle } from '../ui/Card';
import Button from '../ui/Button';

const FeaturedCampsites: React.FC = () => {
  // Display only the first 3 accommodations
  const featuredCampsites = accommodations.slice(0, 3);
  
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
            Featured Accommodations
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-black/70">
            From luxury cottages to authentic camping experiences, find the perfect stay for your retreat.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCampsites.map((campsite, index) => (
            <motion.div
              key={campsite.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <Card className="h-full flex flex-col">
                <CardImage 
                  src={campsite.image} 
                  alt={campsite.title}
                  className="h-48 sm:h-64"
                />
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-xs font-semibold px-2 py-1 bg-brunswick-green text-baby-powder rounded-full mr-2">
                        {campsite.type}
                      </span>
                      <span className="text-xs font-semibold px-2 py-1 bg-brunswick-green/10 text-brunswick-green rounded-full">
                        Up to {campsite.capacity} people
                      </span>
                    </div>
                    <CardTitle>{campsite.title}</CardTitle>
                    <p className="text-black/70 mb-3 line-clamp-3">{campsite.description}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {campsite.features.slice(0, 3).map((feature, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-rose-taupe/10 text-rose-taupe rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <p className="font-bold text-brunswick-green">
                      {formatCurrency(campsite.price)}
                      <span className="text-black/60 font-normal text-sm"> / night</span>
                    </p>
                    <Button variant="primary" size="sm">
                      <Link to={`/campsites/${campsite.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="secondary" size="lg">
            <Link to="/campsites">View All Accommodations</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCampsites;
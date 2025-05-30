import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { formatCurrency } from '../utils/helpers';
import Card, { CardImage, CardContent, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';

const API_BASE_URL = 'https://plumeriaretreatback-production.up.railway.app/api';

interface Accommodation {
  id: number;
  title: string;
  description: string;
  price: number;
  available_rooms: number;
  amenities: string[];
  image_url: string;
  available: boolean;
}

const Campsites: React.FC = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Campsites - Plumeria Retreat';
    
    const fetchAccommodations = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/accommodations`);
        if (!response.ok) {
          throw new Error('Failed to fetch accommodations');
        }
        const data = await response.json();
        setAccommodations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodations();
  }, []);

  const handleBookNow = (accommodationId: number) => {
    // Navigate to booking page with accommodation ID
    window.location.href = `/book?accommodation=${accommodationId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-baby-powder flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brunswick-green"></div>
          <p className="mt-4 text-brunswick-green">Loading accommodations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-baby-powder flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-brunswick-green mb-4">Error Loading Accommodations</h2>
          <p className="text-black/70">{error}</p>
          <Button 
            variant="primary" 
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

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
        {accommodations.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-brunswick-green mb-4">No Accommodations Available</h2>
            <p className="text-black/70">Please check back later for available rooms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {accommodations.map((accommodation, index) => (
              <motion.div
                key={accommodation.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className={`h-full flex flex-col ${!accommodation.available ? 'opacity-75' : ''}`}>
                  <CardImage 
                    src={accommodation.image_url} 
                    alt={accommodation.title}
                    className="h-48 sm:h-64"
                  />
                  <CardContent className="flex-1 flex flex-col">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full mr-2 ${
                          accommodation.available 
                            ? 'bg-brunswick-green text-baby-powder' 
                            : 'bg-gray-400 text-white'
                        }`}>
                          {accommodation.available ? 'Available' : 'Unavailable'}
                        </span>
                        <span className="text-xs font-semibold px-2 py-1 bg-brunswick-green/10 text-brunswick-green rounded-full">
                          {accommodation.available_rooms} rooms available
                        </span>
                      </div>
                      <CardTitle>{accommodation.title}</CardTitle>
                      <p className="text-black/70 mb-3">{accommodation.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {accommodation.amenities && Array.isArray(accommodation.amenities) && accommodation.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                              {accommodation.amenities.map((amenity, index) => (
                                <span 
                                  key={index}
                                  className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                                >
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <p className="font-bold text-brunswick-green">
                        {formatCurrency(accommodation.price)}
                        <span className="text-black/60 font-normal text-sm"> / night</span>
                      </p>
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => handleBookNow(accommodation.id)}
                        disabled={!accommodation.available || accommodation.available_rooms === 0}
                      >
                        {accommodation.available && accommodation.available_rooms > 0 ? 'Book Now' : 'Unavailable'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Campsites;
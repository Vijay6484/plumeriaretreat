import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/helpers';
import Card, { CardImage, CardContent, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';

interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: string;
  maxGuests: number;
  imageUrl: string;
  includes: string;
  active: boolean;
  detailedInfo: string;
}

interface RawAccommodation {
  id: number;
  type: string;
  title: string;
  description: string;
  available: boolean;
  price: string;
  capacity: number;
  features: string;
  image: string;
  has_ac: number;
  has_attached_bath: number;
  available_rooms: number;
  detailed_info: string;
  packages?: Package[];
}

interface Accommodation {
  id: number;
  type: string;
  title: string;
  description: string;
  available: boolean;
  price: number;
  capacity: number;
  features: string;
  image: string;
  hasAC: boolean;
  hasAttachedBath: boolean;
  availableRooms: number;
  detailedInfo: string;
  packages?: Package[];

}

const API_BASE_URL = 'https://u.plumeriaretreat.com';

const Campsites: React.FC = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Campsites - Plumeria Retreat';
    fetchAccommodations();
  }, []);

  const fetchAccommodations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/accommodations`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data: RawAccommodation[] = await response.json();
      console.log('Fetched accommodations:', data);

      const mapped: Accommodation[] = data.map((item) => {
        let imageUrl = '';
        try {
          const parsed = JSON.parse(item.image);
          if (Array.isArray(parsed)) imageUrl = parsed[0];
        } catch {
          imageUrl = item.image;
        }

        return {
          id: item.id,
          type: item.type,
          title: item.title,
          description: item.description,
          price: parseFloat(item.price),
          capacity: item.capacity,
          features: item.features,
          image: imageUrl,
          hasAC: item.has_ac === 1,
          hasAttachedBath: item.has_attached_bath === 1,
          availableRooms: item.available_rooms,
          detailedInfo: item.detailed_info,
          packages: item.packages || [],
          available: Boolean(item.available),
        };
      });

      // ✅ Keep only available accommodations
      const onlyAvailable = mapped.filter((item) => item.available === true);

      // ✅ Also remove duplicates by id
      const unique = onlyAvailable.filter(
        (item, index, self) => index === self.findIndex((t) => t.id === item.id)
      );

      setAccommodations(unique);
      setError(null);
    } catch (err) {
      console.error('Error fetching accommodations:', err);
      setError('Failed to load accommodations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };


  const parseFeatures = (featuresValue: any): string[] => {
    if (!featuresValue) return [];
    if (Array.isArray(featuresValue)) return featuresValue;
    if (typeof featuresValue === 'string') {
      try {
        if (featuresValue.startsWith('[')) {
          return JSON.parse(featuresValue);
        }
        return featuresValue.split(',').map(f => f.trim());
      } catch {
        return featuresValue.split(',').map(f => f.trim());
      }
    }
    return [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-baby-powder flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brunswick-green mx-auto mb-4"></div>
          <p className="text-brunswick-green text-lg">Loading accommodations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-baby-powder flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">!</div>
          <h2 className="text-2xl font-bold text-brunswick-green mb-2">Oops! Something went wrong</h2>
          <p className="text-black/70 mb-4">{error}</p>
          <Button variant="primary" onClick={fetchAccommodations}>
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
          style={{ backgroundImage: "url('https://images.pexels.com/photos/2662816/pexels-photo-2662816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" }}
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
            <p className="text-brunswick-green text-lg">No accommodations available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {accommodations.map((accommodation, index) => {
              const features = parseFeatures(accommodation.features);

              return (
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

                        <div className="flex flex-wrap gap-1 mb-2">
                          {accommodation.hasAC && (
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">AC</span>
                          )}
                          {accommodation.hasAttachedBath && (
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Attached Bath</span>
                          )}
                        </div>

                        <CardTitle>{accommodation.title}</CardTitle>
                        <p className="text-black/70 mb-3">{accommodation.description}</p>

                        {features.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {features.slice(0, 3).map((feature, i) => (
                              <span key={i} className="text-xs px-2 py-1 bg-rose-taupe/10 text-rose-taupe rounded-full">
                                {feature}
                              </span>
                            ))}
                            {features.length > 3 && (
                              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                +{features.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                        <p className="text-sm text-brunswick-green mb-2">
                          {accommodation.availableRooms} rooms available
                        </p>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <p className="font-bold text-brunswick-green">
                          {formatCurrency(accommodation.price)}
                          <span className="text-black/60 font-normal text-sm"> / person</span>
                        </p>
                        <Link to={`/campsites/${accommodation.id}`}>
                          <Button variant="primary" size="sm">Book Now</Button>
                        </Link>

                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Campsites;
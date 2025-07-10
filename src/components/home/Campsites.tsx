import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { formatCurrency } from '../../utils/helpers';
import Card, { CardContent, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { CheckCircle } from 'lucide-react';

interface Accommodation {
  id: number;
  name: string;
  type: string;
  description: string;
  price: number;
  capacity: number;
  rooms: number;
  available: boolean;
  features: string[];
  images: string[];
  amenity_ids: string[];
  address: string;
  latitude: number;
  longitude: number;
  package?: {
    name?: string;
    description?: string;
    images?: string[];
    pricing?: {
      adult?: number;
      child?: number;
      maxGuests?: number;
    };
  };
}

const API_BASE_URL = 'https://a.plumeriaretreat.com';

const Campsites: React.FC = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);

  const parseStringToArray = (value: any): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value.map(String);
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed.map(String) : [String(parsed)];
      } catch {
        return value.split(',').map((item: string) => item.trim());
      }
    }
    return [String(value)];
  };

  const fetchAccommodations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/properties/accommodations`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const responseData = await response.json();
      console.log('Fetched accommodations:', responseData);

      const data = responseData.data || [];

      const mapped: Accommodation[] = data.map((item: any) => ({
        id: item.id || 0,
        name: item.name || '',
        type: item.type || '',
        description: item.description || '',
        price: parseFloat(item.price) || 0,
        capacity: item.capacity || 0,
        rooms: item.rooms || 0,
        available: Boolean(item.available),
        features: parseStringToArray(item.features),
        images: item.package?.images?.length > 0
          ? parseStringToArray(item.package.images)
          : parseStringToArray(item.images),
        amenity_ids: parseStringToArray(item.amenity_ids),
        address: item.address || '',
        latitude: parseFloat(item.latitude) || 0,
        longitude: parseFloat(item.longitude) || 0,
        package: item.package || undefined,
      }));

      const unique = mapped.filter(
        (item, index, self) => index === self.findIndex((t) => t.id === item.id)
      );
      setAccommodations(unique);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load accommodations. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasFetchedRef.current) {
      fetchAccommodations();
      hasFetchedRef.current = true;
    }
  }, [fetchAccommodations]);

  const outerSliderSettings = {
    dots: true,
    infinite: accommodations.length >= 3,
    speed: 500,
    slidesToShow: Math.min(accommodations.length, 3),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: Math.min(accommodations.length, 2),
          slidesToScroll: 1,
          arrows: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: true
        }
      }
    ]
  };

  if (loading) {
    return (
      <section className="section-padding bg-baby-powder">
        <div className="container mx-auto text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brunswick-green mx-auto mb-4"></div>
          <p className="text-brunswick-green text-lg">Loading campsites...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-padding bg-baby-powder">
        <div className="container mx-auto text-center py-12">
          <div className="text-red-500 text-6xl mb-4">!</div>
          <h2 className="text-2xl font-bold text-brunswick-green mb-2">Oops! Something went wrong</h2>
          <p className="text-black/70 mb-4">{error}</p>
          <Button variant="primary" onClick={fetchAccommodations}>Try Again</Button>
        </div>
      </section>
    );
  }

  const renderCard = (accommodation: Accommodation, index: number) => (
    <div key={accommodation.id} className="px-2 sm:px-4 mb-8 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        className="h-full"
      >
        <Card className="h-full flex flex-col shadow-md hover:shadow-lg transition-shadow duration-300" 
          style={{ minHeight: '500px', maxWidth: '100%', margin: '0 auto' }}>
          
          {/* Image Slider */}
          {accommodation.images.length > 0 ? (
            <div className="relative h-56 sm:h-64 overflow-hidden rounded-t-lg">
              <Slider
                dots={true}
                infinite={true}
                speed={500}
                slidesToShow={1}
                slidesToScroll={1}
                autoplay={true}
                autoplaySpeed={4000}
                arrows={false}
                className="h-full w-full"
              >
                {accommodation.images.map((img: string, idx: number) => (
                  <div key={idx} className="h-full">
                    <img
                      src={img}
                      alt={`${accommodation.name}-${idx}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.pexels.com/photos/2662816/pexels-photo-2662816.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1';
                      }}
                    />
                  </div>
                ))}
              </Slider>
            </div>
          ) : (
            <div className="bg-gray-200 h-56 sm:h-64 flex items-center justify-center">
              <span className="text-gray-500">No image available</span>
            </div>
          )}

          <CardContent className="flex-1 flex flex-col p-4 sm:p-5">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs font-semibold px-2 py-1 bg-brunswick-green text-white rounded-full">
                  {accommodation.type}
                </span>
                <span className="text-xs font-semibold px-2 py-1 bg-brunswick-green/10 text-brunswick-green rounded-full">
                  {accommodation.capacity} max guests
                </span>
              </div>

              <CardTitle className="text-lg sm:text-xl font-bold mb-2">{accommodation.name}</CardTitle>
              
              <div className="h-16 mb-3 overflow-hidden">
                <p className="text-gray-600 text-sm line-clamp-3">
                  {accommodation.description}
                </p>
              </div>

              {accommodation.features.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {accommodation.features.slice(0, 3).map((feature, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-rose-taupe/10 text-rose-taupe rounded-full">
                      {feature}
                    </span>
                  ))}
                  {accommodation.features.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      +{accommodation.features.length - 3} more
                    </span>
                  )}
                </div>
              )}
              
              <div className="mb-4 border border-green-300 bg-green-50 text-green-700 px-3 py-2 rounded-lg">
                <p className="text-sm font-medium flex items-center justify-center">
                  <CheckCircle className="mr-1" size={14} />
                  Reserve for exciting offers!
                </p>
              </div>

              <p className={`text-sm mb-2 ${accommodation.available ? 'text-brunswick-green' : 'text-rose-taupe'}`}>
                {accommodation.available ? `${accommodation.rooms} Room Available` : 'Currently Unavailable'}
              </p>
            </div>

            <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
              <div>
                <p className="font-bold text-brunswick-green">
                  {formatCurrency(accommodation.price)}
                  <span className="text-gray-500 font-normal text-sm"> / night</span>
                </p>
                {accommodation.package?.pricing && (
                  <p className="text-xs text-gray-500">Max {accommodation.package.pricing.maxGuests} guests</p>
                )}
              </div>
              <Button variant="primary" size="sm" className="whitespace-nowrap">
                <Link to={`/campsites/${accommodation.id}`} className="block w-full h-full">
                  Book Now
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );

  return (
    <section className="py-12 sm:py-16 bg-baby-powder">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-montserrat text-brunswick-green">
            Our Campsites
          </h2>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto text-gray-600">
            Discover our range of accommodations from luxury cottages to adventure tents
          </p>
        </motion.div>

        {accommodations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-brunswick-green text-lg">No campsites available at the moment.</p>
          </div>
        ) : (
          <div className="relative">
            {accommodations.length >= 3 ? (
              <Slider {...outerSliderSettings} className="campsites-slider pb-2">
                {accommodations.map((a, i) => renderCard(a, i))}
              </Slider>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {accommodations.map((a, i) => renderCard(a, i))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Campsites;
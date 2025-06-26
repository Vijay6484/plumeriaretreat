import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { formatCurrency } from '../../utils/helpers';
import Card, { CardImage, CardContent, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface Accommodation {
  id: number;
  type: string;
  title: string;
  description: string;
  price: number;
  capacity: number;
  features: string;
  image: string;
  hasAC: boolean;
  hasAttachedBath: boolean;
  availableRooms: number;
  detailedInfo: string;
}

const API_BASE_URL = 'https://plumeriaretreat-back.onrender.com';

const Campsites: React.FC = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);

  const fetchAccommodations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/accommodations`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      const mapped = data.map((item: any): Accommodation => {
        let imageUrl = item.image;
        try {
          const parsedImage = JSON.parse(item.image);
          if (Array.isArray(parsedImage)) {
            imageUrl = parsedImage[0];
          }
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
        };
      });

      const unique = mapped.filter(
        (item: Accommodation, index: number, self: Accommodation[]) =>
          index === self.findIndex((t: Accommodation) => t.id === item.id)
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

  const parseFeatures = (featuresValue: any): string[] => {
    if (!featuresValue) return [];
    if (Array.isArray(featuresValue)) return featuresValue;
    if (typeof featuresValue === 'string') {
      try {
        return JSON.parse(featuresValue);
      } catch {
        return featuresValue.split(',').map((f) => f.trim());
      }
    }
    return [];
  };

  const sliderSettings = {
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
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(accommodations.length, 2),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (loading) {
    return (
      <section className="section-padding bg-baby-powder">
        <div className="container-custom text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brunswick-green mx-auto mb-4"></div>
          <p className="text-brunswick-green text-lg">Loading campsites...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-padding bg-baby-powder">
        <div className="container-custom text-center">
          <div className="text-red-500 text-6xl mb-4">!</div>
          <h2 className="text-2xl font-bold text-brunswick-green mb-2">Oops! Something went wrong</h2>
          <p className="text-black/70 mb-4">{error}</p>
          <Button variant="primary" onClick={fetchAccommodations}>Try Again</Button>
        </div>
      </section>
    );
  }

  const renderCard = (accommodation: Accommodation, index: number) => {
    const features = parseFeatures(accommodation.features);

    return (
      <div key={accommodation.id} className="px-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="h-full"
        >
          <Card className="h-full flex flex-col">
            <CardImage
              src={
                accommodation.image ||
                'https://images.pexels.com/photos/2662816/pexels-photo-2662816.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1'
              }
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
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      Attached Bath
                    </span>
                  )}
                </div>

                <CardTitle>{accommodation.title}</CardTitle>
                <p className="text-black/70 mb-3">{accommodation.description}</p>

                {features.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {features.slice(0, 3).map((feature, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 bg-rose-taupe/10 text-rose-taupe rounded-full"
                      >
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
                  <span className="text-black/60 font-normal text-sm"> / person / night</span>
                </p>
                <Button variant="primary" size="sm">
                  <Link to={`/campsites/${accommodation.id}`}>Book Now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  };

  return (
    <section className="section-padding bg-baby-powder">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-montserrat text-brunswick-green">
            Our Campsites
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-black/70">
            Discover our range of accommodations from luxury cottages to adventure tents
          </p>
        </motion.div>

        {accommodations.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-brunswick-green text-lg">No campsites available at the moment.</p>
          </div>
        ) : accommodations.length >= 3 ? (
          <Slider {...sliderSettings} className="campsites-slider">
            {accommodations.map((a, i) => renderCard(a, i))}
          </Slider>
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            {accommodations.map((a, i) => renderCard(a, i))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button variant="secondary" size="lg">
            <Link to="/campsites">View All Campsites</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Campsites;

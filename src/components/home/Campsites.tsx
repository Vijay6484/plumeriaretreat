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

    // ✅ Only available items
    const onlyAvailable = mapped.filter((item) => item.available === true);

    // ✅ Remove duplicates
    const unique = onlyAvailable.filter(
      (item, index, self) => index === self.findIndex((t) => t.id === item.id)
    );

    // ✅ Sort by id (ascending)
    const sorted = [...unique].sort((a, b) => a.id - b.id);

    setAccommodations(sorted);
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

  // const outerSliderSettings = {
  //   dots: true,
  //   infinite: accommodations.length >= 3,
  //   speed: 500,
  //   slidesToShow: Math.min(accommodations.length, 3),
  //   slidesToScroll: 1,
  //   autoplay: true,
  //   autoplaySpeed: 4000,
  //   arrows: true,
  //   responsive: [
  //     {
  //       breakpoint: 1280,
  //       settings: {
  //         slidesToShow: Math.min(accommodations.length, 2),
  //         slidesToScroll: 1,
  //         arrows: true
  //       }
  //     },
  //     {
  //       breakpoint: 768,
  //       settings: {
  //         slidesToShow: 1,
  //         slidesToScroll: 1,
  //         arrows: false,
  //         dots: true
  //       }
  //     }
  //   ]
  // };

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
        <Card className="h-full flex flex-col shadow-md hover:shadow-lg transition-shadow duration-300" >
          
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
                className=""
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
                  <svg 
                    className="mr-1" 
                    width="18" 
                    height="18" 
                    viewBox="0 0 195.803 195.803" 
                    fill="currentColor"
                    style={{ fontWeight: 'bold', strokeWidth: '2' }}
                  >
                    <g>
                      <g>
                        <g>
                          <path strokeWidth="2" d="M195.803,104.175l-15.958-18.141l9.688-19.612l-19.494-9.616l1.525-23.685l-24.182-1.557
                            l-7.315-21.616l-20.915,7.086L104.173,0.002L86.504,15.541L65.146,4.991L54.939,25.648l-21.82-1.396L31.68,46.67L8.668,54.461
                            l7.716,22.769L0,91.628l14.315,16.277l-10.604,21.48l21.978,10.851l-1.442,22.457l21.552,1.385l7.383,21.777l22.887-7.748
                            l15.561,17.694l16.745-14.731l19.727,9.742l10.275-20.815l24.322,1.568l1.492-23.313l20.389-6.907l-7.125-21.033L195.803,104.175
                            z M158.303,143.743l-1.364,21.273l-22.268-1.424l-9.369,18.975l-17.898-8.84l-15.21,13.378l-14.208-16.162l-20.947,7.097
                            l-6.735-19.852l-19.512-1.249l1.306-20.414l-20.135-9.942l9.706-19.644L8.7,92.197l14.838-13.048l-7.054-20.829l21.083-7.143
                            l1.303-20.392l19.784,1.267l9.284-18.814l19.541,9.656l16.141-14.197l13.618,15.489l18.975-6.428l6.671,19.687l22.139,1.417
                            l-1.385,21.638l17.654,8.722L172.504,87l14.609,16.617L170.3,118.401l6.471,19.082L158.303,143.743z"/>
                        </g>
                        <g>
                          <path strokeWidth="2" d="M120.707,90.797c-9.18,0-16.763,7.791-16.763,21.784c0.1,13.879,7.58,20.818,16.23,20.818
                            c8.868,0,16.552-7.258,16.552-21.895C136.73,98.27,130.431,90.797,120.707,90.797z M120.389,127.742
                            c-5.766,0-9.183-6.725-9.076-15.582c0-8.761,3.203-15.7,9.076-15.7c6.51,0,8.965,7.047,8.965,15.489
                            C129.354,121.121,126.584,127.742,120.389,127.742z"/>
                        </g>
                        <g>
                          <path strokeWidth="2" d="M91.558,82.791c0-13.238-6.406-20.722-16.123-20.722c-9.183,0-16.763,7.802-16.763,21.681
                            c0.107,13.983,7.58,20.922,16.23,20.922C83.87,104.676,91.558,97.415,91.558,82.791z M66.144,83.432
                            c0-8.761,3.103-15.7,8.969-15.7c6.514,0,8.969,7.047,8.969,15.489c0,9.176-2.777,15.797-8.969,15.797
                            C69.247,99.014,65.93,92.29,66.144,83.432z"/>
                        </g>
                        <g>
                          <polygon strokeWidth="2" points="115.049,62.07 74.258,133.829 80.234,133.829 121.03,62.07"/>
                        </g>
                      </g>
                    </g>
                  </svg>
                  <span className="font-bold">Reserve for exciting offers!</span>
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
           <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-8">
                {accommodations.map((a, i) => renderCard(a, i))}
                </div>

          </div>
        )}
      </div>
    </section>
  );
};

export default Campsites;
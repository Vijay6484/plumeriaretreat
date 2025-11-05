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
interface Coupon {
  id: number;
  code: string;
  discountType: 'fixed' | 'percentage';
  discount: string; // keep as string to match API, parse when needed
  minAmount?: string;
  maxDiscount?: string | null;
  expiryDate?: string;
  active?: number;
  accommodationType?: string;
  accommodationId?: number;
}

const API_BASE_URL = 'https://a.plumeriaretreat.com';

const Campsites: React.FC = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);
  const [promoCoupon, setPromoCoupon] = useState<Coupon | null>(null);

  // raw coupons list
  const [couponsList, setCouponsList] = useState<any[]>([]);

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

      // Only available items
      const onlyAvailable = mapped.filter((item) => item.available === true);

      // Remove duplicates
      const unique = onlyAvailable.filter(
        (item, index, self) => index === self.findIndex((t) => t.id === item.id)
      );

      // Sort by id (ascending)
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

  useEffect(() => {
    let mounted = true;
    const fetchCoupons = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/coupons`);
        if (!res.ok) return;
        const json = await res.json();
        const coupons: any[] = json.data || [];
        console.log(coupons);

        if (mounted) {
          // store raw coupons for per-accommodation lookup
          setCouponsList(coupons);
        }

        // filter active and not expired (global fallback promo)
        const now = new Date();
        const valid = coupons.filter(c => Number(c.active) === 1).filter(c => {
          const exp = c.expiryDate || c.expiry_date;
          if (!exp) return true;
          const d = new Date(exp);
          return d >= now;
        });
        if (valid.length === 0) return;
        // prefer percentage coupons and the highest percentage
        const percentCoupons = valid.filter(c => (c.discountType || c.discount_type || '').toString().toLowerCase() === 'percentage');
        const pick = (percentCoupons.length > 0 ? percentCoupons : valid)
          .sort((a,b) => Number(b.discount) - Number(a.discount))[0];
        if (mounted) setPromoCoupon({
          id: pick.id || 0,
          code: pick.code || pick.coupon_code || '',
          discountType: (pick.discountType || pick.discount_type || '').toString().toLowerCase() === 'percentage' ? 'percentage' : 'fixed',
          discount: pick.discount?.toString() || '0',
          minAmount: pick.minAmount || pick.min_amount,
          maxDiscount: pick.maxDiscount || pick.max_discount,
          expiryDate: pick.expiryDate || pick.expiry_date,
          active: pick.active,
          accommodationType: pick.accommodationType || pick.accommodation_type,
          accommodationId: pick.accommodation_id || pick.accommodationId || pick.accommodation?.id
        });
      } catch (e) {
        console.error('Coupons fetch error', e);
      }
    };
    fetchCoupons();
    
    return () => { mounted = false; };
  }, []);

  // pick best coupon for a given accommodation id/type (returns Coupon or null)
  const getBestCouponForAccommodation = useCallback((accom: Accommodation): Coupon | null => {
    if (!couponsList || couponsList.length === 0) return null;
    const now = new Date();
    
    const candidates = couponsList
      .filter((c: any) => Number(c.active) === 1) // Must be active
      .filter((c: any) => { // Must not be expired
        const exp = c.expiryDate || c.expiry_date;
        if (!exp) return true;
        return new Date(exp) >= now;
      })
      .filter((c: any) => { // This is the updated logic block
        const accomId = c.accommodation_id || c.accommodationId || c.accommodation?.id;
        
        // Get the value from the coupon, convert to lowercase, and trim whitespace
        const couponAccomType = (c.accommodationType || c.accommodation_type || '').toString().toLowerCase().trim();
        
        // Get the accommodation's name, convert to lowercase, and trim whitespace
        const currentAccomName = (accom.name || '').toLowerCase().trim();

        // 1. Specific ID match (highest priority)
        if (accomId != null) {
          return Number(accomId) === accom.id;
        }

        // 2. Type/Name match
        if (couponAccomType) {
          // 2a. Check for "all" type
          if (couponAccomType === 'all') {
            return true; // This coupon applies to all types
          }
          // 2b. Check for specific name match
          // *** THIS IS THE NEW LOGIC: Match coupon's type field against accommodation's name ***
          return couponAccomType === currentAccomName;
        }
        
        // 3. Global coupon (no accomId and no accommodationType specified)
        return true;
      });

    if (candidates.length === 0) return null;
    
    // Pick the best discount (percentage preferred, then highest amount)
    const pct = candidates.filter((c: any) => (c.discountType || c.discount_type || '').toString().toLowerCase() === 'percentage');
    const pick = (pct.length ? pct : candidates).sort((a:any,b:any) => Number(b.discount) - Number(a.discount))[0];

    return {
      id: pick.id || 0,
      code: pick.code || pick.coupon_code || '',
      discountType: (pick.discountType || pick.discount_type || '').toString().toLowerCase() === 'percentage' ? 'percentage' : 'fixed',
      discount: pick.discount?.toString() || '0',
      minAmount: pick.minAmount || pick.min_amount,
      maxDiscount: pick.maxDiscount || pick.max_discount,
      expiryDate: pick.expiryDate || pick.expiry_date,
      active: pick.active,
      accommodationType: pick.accommodationType || pick.accommodation_type,
      accommodationId: pick.accommodation_id || pick.accommodationId || pick.accommodation?.id
    };
  }, [couponsList]);

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

  const renderCard = (accommodation: Accommodation, index: number) => {
    // get per-accommodation coupon (accommodation-specific -> type-specific -> global)
    const localPromo = getBestCouponForAccommodation(accommodation);

    return (
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

              {/* === Compact Split Coupon Design === */}
{localPromo ? (
  <div className="mb-4 rounded-md border border-green-300 flex overflow-hidden shadow-sm">
    {/* Left Side: The Discount Amount */}
    <div className="flex flex-col items-center justify-center bg-green-900 text-white px-3 py-1 flex-shrink-0">
      <span className="text-xs font-medium">GET</span>
      <span className="text-xl font-bold leading-tight">
        {localPromo.discountType === 'percentage'
          ? `${localPromo.discount}%`
          : `${formatCurrency(Number(localPromo.discount) || 0)}`
        }
      </span>
      <span className="text-xs font-medium">OFF</span>
    </div>
    
    {/* Right Side: The Code */}
    <div className="flex-1 bg-green-50 p-2 flex flex-col justify-center items-center">
      <span className="block text-xs text-green-700 font-semibold uppercase">Use Code:</span>
      <div className="mt-1 inline-block bg-white border-2 border-dashed border-green-400 px-2 py-0.5 rounded-md">
        <strong className="text-base font-mono text-green-900 tracking-wider">
          {localPromo.code}
        </strong>
      </div>
    </div>
  </div>
) : (
  // --- Compact Fallback Design ---
  <div className="mb-4 border-2 border-dashed border-gray-300 bg-gray-50 text-gray-700 px-3 py-2 rounded-lg">
    <p className="text-sm font-medium flex items-center justify-center">
      {/* Embedded Gift Icon (Slightly smaller) */}
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-gray-500">
        <rect x="3" y="8" width="18" height="4" rx="1"/>
        <path d="M12 8v13"/>
        <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/>
        <path d="M7.5 8a2.5 2.5 0 0 1 0-5A2.5 2.5 0 0 1 10 8"/>
        <path d="M16.5 8a2.5 2.5 0 0 0 0-5A2.5 2.5 0 0 0 14 8"/>
      </svg>
      <span className="font-semibold">Reserve for exciting offers!</span>
    </p>
  </div>
)}
{/* === END OF Compact Design === */}

                <p className={`text-sm mb-2 ${accommodation.available ? 'text-brunswick-green' : 'text-rose-taupe'}`}>
                  {accommodation.available ? `${accommodation.rooms} Room Available` : 'Currently Unavailable'}
                </p>
              </div>

              <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
                <div>
                  <p className="font-bold text-brunswick-green">
                    {formatCurrency(accommodation.price)}
                    <span className="text-gray-500 font-normal text-sm">
                      {(accommodation.type || '').toLowerCase() === 'villa' ? ' / Day' : ' / Person'}
                    </span>
                  </p>
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
  };

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
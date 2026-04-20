import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { formatCurrency } from '../../utils/helpers';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { 
  Users, 
  BedDouble, 
  Star, 
  Info, 
  Ticket, 
  Sparkles 
} from 'lucide-react';

// Interfaces remain the same as your original file
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
}

interface Coupon {
  id: number;
  code: string;
  discountType: 'fixed' | 'percentage';
  discount: string;
  active?: number;
}

const API_BASE_URL = 'https://a.plumeriaretreat.com';

const Campsites: React.FC = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [couponsList, setCouponsList] = useState<any[]>([]);
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
      const data = responseData.data || [];

      const mapped: Accommodation[] = data.map((item: any) => ({
        id: item.id || 0,
        name: item.name || '',
        type: item.type || '',
        description: item.description || '',
        price: parseFloat(item.price) || 0,
        capacity: item.capacity || 0,
        rooms: item.rooms || 0,
        // FIX: Boolean(item.available) handles 1, "1", or true correctly
        available: Boolean(item.available) || item.available === 1 || item.available === "1", 
        features: parseStringToArray(item.features),
        images: item.package?.images?.length > 0
          ? parseStringToArray(item.package.images)
          : parseStringToArray(item.images),
        amenity_ids: parseStringToArray(item.amenity_ids),
      }));

      // FIX: Ensure the filter isn't too strict
      const availableItems = mapped.filter((item) => item.available);
      
      const unique = availableItems.filter(
        (item, index, self) => index === self.findIndex((t) => t.id === item.id)
      );

      setAccommodations(unique.sort((a, b) => a.id - b.id));
      setError(null);
    } catch (err) {
      setError('Failed to load accommodations.');
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

  // Coupon Logic (Same as your original)
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/coupons`);
        if (!res.ok) return;
        const json = await res.json();
        setCouponsList(json.data || []);
      } catch (e) { console.error(e); }
    };
    fetchCoupons();
  }, []);

  const getBestCoupon = (accom: Accommodation): Coupon | null => {
    if (!couponsList.length) return null;
    const candidates = couponsList.filter((c: any) => 
        Number(c.active) === 1 && 
        ((c.accommodation_type || '').toLowerCase() === (accom.name || '').toLowerCase() || 
         (c.accommodation_type || '').toLowerCase() === 'all')
    );
    if (!candidates.length) return null;
    const pick = candidates[0];
    return {
      id: pick.id,
      code: pick.code || pick.coupon_code,
      discountType: (pick.discount_type || '').toLowerCase() === 'percentage' ? 'percentage' : 'fixed',
      discount: pick.discount?.toString() || '0'
    };
  };

  const renderCard = (accommodation: Accommodation, index: number) => {
    const promo = getBestCoupon(accommodation);

    return (
      <motion.div
        key={accommodation.id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-xl transition-all duration-500"
      >
        {/* Top Image Section */}
        <div className="relative h-64 overflow-hidden">
          {accommodation.images.length > 0 ? (
            <Slider dots={false} infinite speed={500} slidesToShow={1} autoplay arrows={false}>
              {accommodation.images.map((img, idx) => (
                <div key={idx} className="h-64 outline-none">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </Slider>
          ) : (
            <div className="bg-slate-200 h-full w-full" />
          )}
          
          <div className="absolute top-4 left-4">
            <span className="bg-[#3B82F6] text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider">
              {accommodation.type}
            </span>
          </div>

          <div className="absolute top-4 right-4 bg-white px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-bold text-slate-800">4.8</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-slate-900 mb-2">{accommodation.name}</h3>
          <p className="text-slate-500 text-sm mb-6 line-clamp-2">{accommodation.description}</p>

          {/* Icons Row */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-slate-600 bg-blue-50/50 px-3 py-1.5 rounded-xl">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold">{accommodation.capacity} Guests</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 bg-emerald-50/50 px-3 py-1.5 rounded-xl">
              <BedDouble className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold">{accommodation.rooms} Rooms</span>
            </div>
          </div>

          {/* Amenities Pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {accommodation.features.slice(0, 4).map((f, i) => (
              <span key={i} className="bg-slate-50 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-lg border border-slate-100">
                {f}
              </span>
            ))}
          </div>

          {/* Grey Pricing Area (MATCHES IMAGE) */}
          <div className="mt-auto bg-[#F8FAFC] border border-slate-100 rounded-[24px] p-4 mb-6 flex items-center justify-between">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Starting From</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900 leading-none">
                  {formatCurrency(accommodation.price)}
                </span>
                <span className="text-slate-400 text-xs font-medium">/night</span>
              </div>
              <p className="text-[9px] text-slate-400 mt-2">For 2 persons • +₹500 per extra guest</p>
            </div>

            {/* Promo Badge */}
            {promo && (
              <div className="bg-[#EBF5FF] border border-blue-100 p-2 rounded-2xl text-center min-w-[70px]">
                <div className="flex justify-center gap-1 mb-0.5">
                    <Ticket className="w-3 h-3 text-blue-600" />
                    <Sparkles className="w-3 h-3 text-blue-400" />
                </div>
                <span className="block text-[10px] font-black text-blue-700">{promo.code}</span>
                <span className="block text-[10px] font-black text-blue-600 bg-white px-1 py-0.5 rounded-md mt-1">
                    {promo.discountType === 'percentage' ? `${promo.discount}% OFF` : 'OFFER'}
                </span>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Link to={`/campsites/${accommodation.id}`}>
              <button className="w-full flex items-center justify-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 py-3 rounded-2xl font-bold text-xs transition-all">
                <Info className="w-4 h-4" /> View Details
              </button>
            </Link>
            <Link to={`/campsites/${accommodation.id}`}>
              <button className="w-full bg-[#2563EB] hover:bg-blue-700 text-white py-3 rounded-2xl font-bold text-xs transition-all shadow-lg shadow-blue-600/20">
                Book Now
              </button>
            </Link>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <section className="py-20 bg-[#F1F5F9]">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4">Our Campsites</h2>
          <p className="text-slate-500">Luxury cottages to adventure tents</p>
        </div>

        {accommodations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-400">No campsites available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {accommodations.map((a, i) => renderCard(a, i))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Campsites;
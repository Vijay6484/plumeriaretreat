import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/helpers';
import { 
  Users, Wind, Bath, ArrowRight, BedDouble, 
  Star, Info, Ticket, Sparkles 
} from 'lucide-react';

interface Accommodation {
  id: number;
  type: string;
  title: string;
  description: string;
  available: boolean;
  price: number;
  capacity: number;
  rooms: number;
  features: string;
  image: string;
  hasAC: boolean;
  hasAttachedBath: boolean;
  availableRooms: number;
  detailedInfo: string;
}

const API_BASE_URL = 'https://u.plumeriaretreat.com';

const Campsites: React.FC = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Luxury Stays | Plumeria Retreat';
    fetchAccommodations();
  }, []);

  const fetchAccommodations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/accommodations`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      const mapped: Accommodation[] = data.map((item: any) => {
        let imageUrl = '';
        try {
          const parsed = JSON.parse(item.image);
          if (Array.isArray(parsed)) imageUrl = parsed[0];
        } catch { imageUrl = item.image; }

        return {
          id: item.id,
          type: item.type || 'Standard',
          title: item.title,
          description: item.description,
          price: parseFloat(item.price),
          capacity: item.capacity,
          rooms: item.rooms || 1,
          features: item.features,
          image: imageUrl,
          hasAC: item.has_ac === 1,
          hasAttachedBath: item.has_attached_bath === 1,
          availableRooms: item.available_rooms,
          detailedInfo: item.detailed_info,
          available: Boolean(item.available),
        };
      });

      setAccommodations(mapped.filter(item => item.available));
    } catch (err) {
      setError('Failed to load accommodations.');
    } finally {
      setLoading(false);
    }
  };

  const parseFeatures = (featuresValue: any): string[] => {
    if (!featuresValue) return [];
    if (Array.isArray(featuresValue)) return featuresValue;
    return String(featuresValue).split(',').map(f => f.trim());
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 md:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Discover Your Perfect Stay</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">Luxury camping and premium rooms designed for ultimate comfort.</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {accommodations.map((item, idx) => {
          const features = parseFeatures(item.features);
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100 flex flex-col h-full"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider">
                    {item.type}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-bold text-slate-700">4.8</span>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed line-clamp-2">
                  {item.description}
                </p>

                {/* Capacity & Rooms Info */}
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-2 text-slate-600 bg-blue-50/50 px-3 py-2 rounded-xl">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-bold">{item.capacity} Guests</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 bg-emerald-50/50 px-3 py-2 rounded-xl">
                    <BedDouble className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-bold">{item.rooms} Rooms</span>
                  </div>
                </div>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {features.slice(0, 4).map((f, i) => (
                    <span key={i} className="bg-slate-50 text-slate-500 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-slate-100">
                      {f}
                    </span>
                  ))}
                  {features.length > 4 && (
                    <span className="text-[11px] font-bold text-slate-400 py-1.5 px-2">+{features.length - 4} more</span>
                  )}
                </div>

                {/* Pricing Box - Styled to match image */}
                <div className="mt-auto bg-[#F8FAFC] border border-slate-100 rounded-3xl p-5 mb-6 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Starting From</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-900 leading-none">
                        {formatCurrency(item.price)}
                      </span>
                      <span className="text-slate-400 text-sm font-medium">/night</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2">For 2 persons • +₹500 per extra guest</p>
                  </div>

                  {/* Promo Badge */}
                  <div className="bg-blue-50 border border-blue-100 p-3 rounded-2xl text-center flex flex-col items-center">
                    <div className="flex gap-1 mb-1">
                      <Ticket className="w-3 h-3 text-blue-600" />
                      <Sparkles className="w-3 h-3 text-blue-400" />
                    </div>
                    <span className="block text-[10px] font-black text-blue-700 tracking-wider">TENT15</span>
                    <span className="block text-[11px] font-black text-blue-600 bg-white px-2 py-0.5 rounded-md mt-1">15% OFF</span>
                  </div>
                </div>

                {/* Split Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Link to={`/campsites/${item.id}`} className="w-full">
                    <button className="w-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                      <Info className="w-4 h-4" />
                      View Details
                    </button>
                  </Link>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                    Book Now
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Campsites;
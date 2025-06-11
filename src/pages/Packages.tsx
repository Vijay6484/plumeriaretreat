import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Clock, CheckCircle } from 'lucide-react';
import { packages } from '../data';

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

const formatDuration = (days: number): string => {
  if (days === 1) return '1 Day';
  if (days < 7) return `${days} Days`;
  const weeks = Math.floor(days / 7);
  const remainingDays = days % 7;
  if (weeks === 1 && remainingDays === 0) return '1 Week';
  if (remainingDays === 0) return `${weeks} Weeks`;
  return `${weeks} Week${weeks > 1 ? 's' : ''} ${remainingDays} Day${remainingDays > 1 ? 's' : ''}`;
};

const Packages: React.FC = () => {
  useEffect(() => {
    document.title = 'Retreat Packages - Plumeria Retreat';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[50vh] bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')"
          }}
        ></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Plumeria Packages
            </h1>
            <p className="text-xl sm:text-2xl opacity-90 leading-relaxed">
              Discover transformative experiences crafted for your wellness journey
            </p>
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {packages.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-xl shadow-sm p-12 max-w-lg mx-auto">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No Packages Available</h2>
              <p className="text-gray-600">Our retreat packages will be available soon. Please check back later.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div
                key={pkg.id}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ${
                  !pkg.active ? 'opacity-75 grayscale' : ''
                }`}
                style={{
                  animationDelay: `${index * 150}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                {/* Package Image */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={pkg.image_url || 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2'} 
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      pkg.active 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-gray-500 text-white'
                    }`}>
                      {pkg.active ? 'Available' : 'Coming Soon'}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Package Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-emerald-600 transition-colors">
                    {pkg.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {pkg.description}
                  </p>

                  {/* Package Details */}
                  <div className="flex items-center justify-between mb-4 text-sm">
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{formatDuration(pkg.duration)}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Users className="w-4 h-4 mr-1" />
                      <span>Up to {pkg.max_guests} guests</span>
                    </div>
                  </div>

                  {/* Includes Section */}
                  {pkg.includes && Array.isArray(pkg.includes) && pkg.includes.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" />
                        Package Includes:
                      </h4>
                      <div className="space-y-2">
                        {pkg.includes.slice(0, 4).map((item, index) => (
                          <div key={index} className="flex items-start">
                            <CheckCircle className="w-4 h-4 mr-2 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{item}</span>
                          </div>
                        ))}
                        {pkg.includes.length > 4 && (
                          <div className="text-sm text-emerald-600 font-medium">
                            +{pkg.includes.length - 4} more included
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Price and Book Button */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-3xl font-bold text-emerald-600">
                        {formatCurrency(pkg.price)}
                      </span>
                      <span className="text-gray-500 text-sm ml-1">
                        / {pkg.duration === 1 ? 'day' : 'package'}
                      </span>
                    </div>
                    <Link 
                      to={`/packages/${pkg.id}`}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                        pkg.active
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg transform hover:-translate-y-0.5'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none'
                      }`}
                    >
                      {pkg.active ? 'Book Now' : 'Coming Soon'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Add CSS animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

export default Packages;
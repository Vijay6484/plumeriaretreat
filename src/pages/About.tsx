import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield, Users, TreePine, MapPin, Phone, Mail, Star, Award, Leaf, Mountain } from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';

const About: React.FC = () => {
  const handleBookNow = () => {
    window.location.href = `/campsites/1`;
  };

  useEffect(() => {
    document.title = 'About Us - Plumeria Retreat';
  }, []);

  const values = [
    {
      icon: <Heart size={32} />,
      title: 'Passion for Nature',
      description: 'We are dedicated to providing authentic outdoor experiences while preserving the natural beauty of our surroundings.',
      gradient: 'from-red-400 to-pink-500'
    },
    {
      icon: <Shield size={32} />,
      title: 'Safety First',
      description: 'Your safety is our priority. All our activities and accommodations meet the highest safety standards.',
      gradient: 'from-blue-400 to-indigo-500'
    },
    {
      icon: <Users size={32} />,
      title: 'Community Focus',
      description: 'We create spaces for meaningful connections between travelers and support our local community.',
      gradient: 'from-green-400 to-emerald-500'
    },
    {
      icon: <TreePine size={32} />,
      title: 'Eco-Friendly',
      description: 'Our commitment to sustainability guides every decision we make, from waste management to energy use.',
      gradient: 'from-teal-400 to-cyan-500'
    }
  ];

  const stats = [
    { icon: <Star size={24} />, number: '500+', label: 'Happy Guests' },
    { icon: <Award size={24} />, number: '5', label: 'Years Experience' },
    { icon: <Leaf size={24} />, number: '100%', label: 'Eco-Friendly' },
    { icon: <Mountain size={24} />, number: '10+', label: 'Activities' }
  ];

  return (
    <div className="min-h-screen bg-baby-powder">
      {/* Hero Section with Parallax Effect */}
      <div className="relative h-[60vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')"
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-brunswick-green/80 to-rose-taupe/60"></div>
        <div className="container-custom h-full flex items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-baby-powder max-w-2xl"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">About Us</h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
              Creating unforgettable outdoor experiences at the heart of nature
            </p>
            <div className="mt-8 flex items-center space-x-4">
              <div className="w-16 h-1 bg-rose-taupe rounded-full"></div>
              <span className="text-lg font-medium">Est. 2019</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative -mt-20 z-10">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-brunswick-green mb-3 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-brunswick-green mb-1">{stat.number}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-20">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-block">
              <span className="bg-brunswick-green/10 text-brunswick-green px-4 py-2 rounded-full text-sm font-semibold">
                Our Story
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-brunswick-green leading-tight">
              Plumeria Retreat
            </h2>
            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              <p>
                Welcome to Plumeria Retreat Cottage Stay, your ideal getaway near the serene Pawna Lake. 
                Nestled amidst lush greenery, just a stone's throw from the tranquil waters of Pawna Lake, 
                our retreat offers a perfect blend of nature and luxury.
              </p>
              <p>
                At Plumeria Retreat, we are dedicated to providing an unforgettable experience that goes 
                beyond just a stay; it's a journey into relaxation, adventure, and rejuvenation.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.pexels.com/photos/2662816/pexels-photo-2662816.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1" 
                alt="Plumeria Retreat" 
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brunswick-green/30 to-transparent"></div>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-rose-taupe text-white p-6 rounded-2xl shadow-xl">
              <div className="text-2xl font-bold">5+</div>
              <div className="text-sm">Years of Excellence</div>
            </div>
          </motion.div>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-brunswick-green to-brunswick-green/80 text-white p-8 rounded-3xl"
          >
            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
            <p className="text-lg leading-relaxed opacity-90">
              Our vision is to create a sanctuary where guests can unwind and reconnect with nature, 
              all while enjoying the stunning backdrop of Pawna Lake. We strive to offer a unique blend 
              of comfort, outdoor adventure, and personalized service.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-rose-taupe to-rose-taupe/80 text-white p-8 rounded-3xl"
          >
            <h3 className="text-2xl font-bold mb-4">What We Offer</h3>
            <p className="text-lg leading-relaxed opacity-90">
              Our cottages are thoughtfully designed to complement the natural beauty of the Pawna Lake area. 
              Each stay includes an all-inclusive package, featuring delicious meals made with locally sourced 
              ingredients and a variety of activities.
            </p>
          </motion.div>
        </div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="bg-brunswick-green/10 text-brunswick-green px-4 py-2 rounded-full text-sm font-semibold">
            Our Values
          </span>
          <h2 className="text-4xl font-bold mt-4 mb-6 text-brunswick-green">What Drives Us</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our core values shape every aspect of your experience at Plumeria Retreat
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Card className="h-full hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-white">
                <CardContent className="text-center p-8">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${value.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-brunswick-green">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Why Choose Us */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-brunswick-green/5 to-rose-taupe/5 rounded-3xl p-8 md:p-12 mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-brunswick-green mb-4">Why Choose Us?</h2>
            <div className="w-24 h-1 bg-rose-taupe mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-brunswick-green text-white p-2 rounded-lg flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-brunswick-green mb-2">Prime Location near Pawna Lake</h4>
                  <p className="text-gray-600">Enjoy the beauty and tranquility of Pawna Lake right at your doorstep.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-rose-taupe text-white p-2 rounded-lg flex-shrink-0">
                  <Heart size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-brunswick-green mb-2">Comfortable Cottages</h4>
                  <p className="text-gray-600">Our cottages offer a cozy and intimate atmosphere, perfect for relaxing after a day of exploring.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-brunswick-green text-white p-2 rounded-lg flex-shrink-0">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-brunswick-green mb-2">All-Inclusive Packages</h4>
                  <p className="text-gray-600">We provide everything you need for a stress-free stay, including meals and activities.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-rose-taupe text-white p-2 rounded-lg flex-shrink-0">
                  <TreePine size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-brunswick-green mb-2">Activities for Every Guest</h4>
                  <p className="text-gray-600">Whether you're into water sports, hiking, or simply lounging by the lake, we have something for everyone.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-brunswick-green to-rose-taupe"></div>
          <div className="relative z-10 text-center py-16 px-8 text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Join Our Journey</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
              Whether you're looking for a weekend escape, a romantic retreat, or a family vacation, 
              Plumeria Retreat Cottage Stay near Pawna Lake is your perfect destination.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="flex items-center space-x-2">
                <Phone size={20} />
                <span className="text-lg font-semibold">9226869678</span>
              </div>
              <div className="hidden sm:block w-1 h-6 bg-white/30 rounded-full"></div>
              <div className="flex items-center space-x-2">
                <Mail size={20} />
                <span className="text-lg">campatpawna@gmail.com</span>
              </div>
            </div>
            
            <button 
              onClick={handleBookNow}
              className="bg-white text-brunswick-green px-8 py-4 rounded-full font-bold text-lg hover:bg-baby-powder transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Book Your Stay Today
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
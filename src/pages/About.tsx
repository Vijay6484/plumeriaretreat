import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield, Users, TreePine } from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';

const About: React.FC = () => {
  const handleBookNow = () => {
    // Navigate to booking page with accommodation ID
    window.location.href = `/book`;
  };
  useEffect(() => {
    document.title = 'About Us - Plumeria Retreat';
  }, []);

  const values = [
    {
      icon: <Heart size={32} />,
      title: 'Passion for Nature',
      description: 'We are dedicated to providing authentic outdoor experiences while preserving the natural beauty of our surroundings.'
    },
    {
      icon: <Shield size={32} />,
      title: 'Safety First',
      description: 'Your safety is our priority. All our activities and accommodations meet the highest safety standards.'
    },
    {
      icon: <Users size={32} />,
      title: 'Community Focus',
      description: 'We create spaces for meaningful connections between travelers and support our local community.'
    },
    {
      icon: <TreePine size={32} />,
      title: 'Eco-Friendly',
      description: 'Our commitment to sustainability guides every decision we make, from waste management to energy use.'
    }
  ];

  return (
    <div className="min-h-screen bg-baby-powder">
      <div className="h-[40vh] bg-brunswick-green relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')"
          }}
        ></div>
        <div className="container-custom h-full flex items-center relative z-10">
          <div className="text-baby-powder">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
            <p className="text-xl opacity-90">Creating unforgettable outdoor experiences</p>
          </div>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-brunswick-green">About Us <br /> Plumeria Retreat Cottage Stay</h2>
            <p className="text-lg text-black/70 mb-4">
              Welcome to Plumeria Retreat Cottage Stay, your ideal getaway near the serene Pawna Lake. Nestled amidst lush greenery, just a stone’s throw from the tranquil waters of Pawna Lake, our retreat offers a perfect blend of nature and luxury. At Plumeria Retreat, we are dedicated to providing an unforgettable experience that goes beyond just a stay; it’s a journey into relaxation, adventure, and rejuvenation.
            </p>
            <p className="text-lg text-black/70">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-brunswick-green">Our Vision</h2>

Our vision is to create a sanctuary where guests can unwind and reconnect with nature, all while enjoying the stunning backdrop of Pawna Lake. We strive to offer a unique blend of comfort, outdoor adventure, and personalized service, ensuring that every moment spent with us is cherished.

 <h2 className="text-3xl md:text-4xl font-bold mb-6 text-brunswick-green">What We Offer</h2>

At Plumeria Retreat, our cottages are thoughtfully designed to complement the natural beauty of the Pawna Lake area. Each stay includes an all-inclusive package, featuring delicious meals made with locally sourced ingredients and a variety of activities to suit every traveler, whether you’re here to explore or simply relax by the lake.
<h2 className="text-3xl md:text-4xl font-bold mb-6 text-brunswick-green">Why Choose Us?</h2>

Prime Location near Pawna Lake: Enjoy the beauty and tranquility of Pawna Lake right at your doorstep.
Comfortable Cottages: Our cottages offer a cozy and intimate atmosphere, perfect for relaxing after a day of exploring.
All-Inclusive Packages: We provide everything you need for a stress-free stay, including meals and activities.
Activities for Every Guest: Whether you’re into water sports, hiking, or simply lounging by the lake, we have something for everyone. <br />
<h2 className="text-3xl md:text-4xl font-bold mb-6 text-brunswick-green">Our Commitment</h2>

At Plumeria Retreat, we are committed to exceeding your expectations with exceptional service and attention to detail. Whether you’re seeking a peaceful getaway, an adventure-filled retreat, or simply a place to relax and unwind, we promise an experience that will leave you rejuvenated and longing to return.


            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="h-full">
                <CardContent className="flex flex-col items-center text-center">
                  <div className="text-brunswick-green mb-4 p-3 bg-brunswick-green/10 rounded-full">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-brunswick-green">{value.title}</h3>
                  <p className="text-black/70">{value.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-brunswick-green text-baby-powder rounded-lg p-8 md:p-12"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Journey</h2>
            <p className="text-lg mb-8 opacity-90">
            Whether you’re looking for a weekend escape, a romantic retreat, or a family vacation, Plumeria Retreat Cottage Stay near Pawna Lake is your perfect destination. Come and experience the ultimate blend of nature, comfort, and adventure with us.

Contact: 9226869678
            </p>
            <button className="bg-rose-taupe text-baby-powder px-8 py-3 rounded-full font-medium hover:bg-rose-taupe/90 transition-colors"
            onClick={() => handleBookNow()}
            > 
              Book Your Stay
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
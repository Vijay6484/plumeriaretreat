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
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-brunswick-green">Our Story</h2>
            <p className="text-lg text-black/70 mb-4">
              Founded in 2020, Plumeria Retreat was born from a passion for connecting people with nature. 
              What started as a simple campground has grown into a premier destination for outdoor enthusiasts 
              seeking both adventure and comfort.
            </p>
            <p className="text-lg text-black/70">
              Today, we pride ourselves on offering diverse accommodation options and activities that cater to 
              every type of traveler, while maintaining our commitment to environmental stewardship and 
              authentic outdoor experiences.
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
              Whether you're seeking adventure, relaxation, or a bit of both, we invite you to 
              experience the magic of Plumeria Retreat. Come be part of our story.
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
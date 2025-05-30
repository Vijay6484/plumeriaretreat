import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin } from 'lucide-react';
import { faqs } from '../data';
import Card, { CardContent } from '../components/ui/Card';

const Contact: React.FC = () => {
  useEffect(() => {
    document.title = 'Contact Us - Plumeria Retreat';
  }, []);

  return (
    <div className="min-h-screen bg-baby-powder">
      <div className="h-[40vh] bg-brunswick-green relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/4553618/pexels-photo-4553618.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')"
          }}
        ></div>
        <div className="container-custom h-full flex items-center relative z-10">
          <div className="text-baby-powder">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl opacity-90">Get in touch with our team</p>
          </div>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6 text-brunswick-green">Send Us a Message</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brunswick-green focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brunswick-green focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brunswick-green focus:border-transparent"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-brunswick-green text-baby-powder py-3 rounded-lg font-medium hover:bg-brunswick-green/90 transition-colors"
              >
                Send Message
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6 text-brunswick-green">Contact Information</h2>
            <div className="space-y-6 mb-12">
              <div className="flex items-start">
                <MapPin size={24} className="text-brunswick-green mt-1" />
                <div className="ml-4">
                  <h3 className="font-semibold text-lg">Address</h3>
                  <p className="text-black/70">123 Lakeside Drive, Nature Valley, CA 94123</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone size={24} className="text-brunswick-green mt-1" />
                <div className="ml-4">
                  <h3 className="font-semibold text-lg">Phone</h3>
                  <p className="text-black/70">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail size={24} className="text-brunswick-green mt-1" />
                <div className="ml-4">
                  <h3 className="font-semibold text-lg">Email</h3>
                  <p className="text-black/70">info@plumeriaretreat.com</p>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-6 text-brunswick-green">FAQs</h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <Card key={faq.id}>
                  <CardContent>
                    <h3 className="font-semibold text-lg mb-2 text-brunswick-green">{faq.question}</h3>
                    <p className="text-black/70">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const TermsConditions: React.FC = () => {
  useEffect(() => {
    document.title = 'Terms & Conditions - Plumeria Retreat';
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
            <p className="text-xl opacity-90">Please read these terms carefully</p>
          </div>
        </div>
      </div>

      <div className="container-custom py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
            
            <section>
              <h2 className="text-2xl font-bold text-brunswick-green mb-4">1. About Us</h2>
              <p className="text-gray-700 leading-relaxed">
                Plumeria Retreat is operated under Pawanai Agro Tourism, a registered agro-tourism company. 
                We provide lakeside camping and cottage accommodation services at Pawna Lake, Maharashtra.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brunswick-green mb-4">2. Booking Terms</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>All bookings are subject to availability and confirmation</li>
                <li>Advance payment is required to confirm your booking</li>
                <li>Check-in time is 3:00 PM and check-out time is 11:00 AM</li>
                <li>Valid ID proof is mandatory for all guests during check-in</li>
                <li>Maximum occupancy limits must be strictly followed</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brunswick-green mb-4">3. Payment Terms</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Advance payment of 30% is required at the time of booking</li>
                <li>Remaining amount must be paid at the property during check-in</li>
                <li>All payments are processed securely through our payment gateway</li>
                <li>Prices are subject to change without prior notice</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brunswick-green mb-4">4. Guest Responsibilities</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Guests must maintain the property and respect other visitors</li>
                <li>Smoking and alcohol consumption are prohibited in accommodation areas</li>
                <li>Loud music and noise after 10:00 PM is not permitted</li>
                <li>Guests are responsible for any damage to property</li>
                <li>Pets are not allowed unless prior permission is obtained</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brunswick-green mb-4">5. Safety and Security</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Guests participate in activities at their own risk</li>
                <li>Children must be supervised by adults at all times</li>
                <li>Swimming and water activities are at guest's own risk</li>
                <li>We recommend travel insurance for all guests</li>
                <li>Emergency contact numbers will be provided upon check-in</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brunswick-green mb-4">6. Force Majeure</h2>
              <p className="text-gray-700 leading-relaxed">
                Pawanai Agro Tourism shall not be liable for any failure to perform due to unforeseen circumstances 
                including but not limited to natural disasters, government restrictions, or other events beyond our control.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brunswick-green mb-4">7. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These terms and conditions are governed by the laws of India. Any disputes shall be subject to 
                the jurisdiction of courts in Pune, Maharashtra.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brunswick-green mb-4">8. Contact Information</h2>
              <div className="text-gray-700">
                <p><strong>Pawanai Agro Tourism</strong></p>
                <p>Operating: Plumeria Retreat</p>
                <p>Email: campatpawna@gmail.com</p>
                <p>Phone: +91 9226869678</p>
                <p>Address: At-Bramhanoli, Fangne, Post- Pawna nagar, Tel- Maval, Dist- Pune, Maharashtra 410406</p>
              </div>
            </section>

            <div className="bg-brunswick-green/10 p-6 rounded-lg border-l-4 border-brunswick-green">
              <p className="text-brunswick-green font-semibold">
                By making a booking with us, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsConditions;
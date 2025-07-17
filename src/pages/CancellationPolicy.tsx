import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, XCircle, Clock, Phone } from 'lucide-react';

const CancellationPolicy: React.FC = () => {
  useEffect(() => {
    document.title = 'Cancellation Policy - Plumeria Retreat';
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Cancellation Policy</h1>
            <p className="text-xl opacity-90">Important information about booking cancellations</p>
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
          {/* Zero Refund Alert */}
          <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8 rounded-lg">
            <div className="flex items-center mb-4">
              <XCircle className="text-red-500 mr-3" size={24} />
              <h2 className="text-xl font-bold text-red-700">Zero Refund Policy</h2>
            </div>
            <p className="text-red-700 font-semibold text-lg">
              Please note that Plumeria Retreat operates under a strict ZERO REFUND policy. 
              All bookings are final and non-refundable under any circumstances.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
            
            <section>
              <h2 className="text-2xl font-bold text-brunswick-green mb-4">Policy Overview</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Pawanai Agro Tourism, operating Plumeria Retreat, maintains a zero refund policy to ensure 
                operational efficiency and fair pricing for all guests. This policy applies to all bookings 
                regardless of the reason for cancellation.
              </p>
            </section>

            <section>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
                <div className="flex items-center mb-3">
                  <AlertTriangle className="text-yellow-600 mr-3" size={20} />
                  <h3 className="text-lg font-semibold text-yellow-800">Important Notice</h3>
                </div>
                <ul className="list-disc pl-6 space-y-2 text-yellow-800">
                  <li>No refunds will be provided for any cancellations</li>
                  <li>No refunds for early check-out or unused services</li>
                  <li>No refunds due to weather conditions</li>
                  <li>No refunds for personal emergencies or changes in plans</li>
                  <li>No refunds for force majeure events</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brunswick-green mb-4">Booking Modification</h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="flex items-center mb-3">
                  <Clock className="text-blue-600 mr-3" size={20} />
                  <h3 className="text-lg font-semibold text-blue-800">Date Changes</h3>
                </div>
                <ul className="list-disc pl-6 space-y-2 text-blue-800">
                  <li>Date modifications may be possible subject to availability</li>
                  <li>Changes must be requested at least 48 hours before check-in</li>
                  <li>Additional charges may apply for date changes</li>
                  <li>Only one date change is permitted per booking</li>
                  <li>Final confirmation depends on property availability</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brunswick-green mb-4">No-Show Policy</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Guests who fail to arrive on the scheduled date will be considered "No-Show"</li>
                  <li>No refund will be provided for no-show bookings</li>
                  <li>The entire booking amount will be forfeited</li>
                  <li>Please inform us if you're running late to avoid no-show classification</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brunswick-green mb-4">Special Circumstances</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-gray-400 pl-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Medical Emergencies</h4>
                  <p className="text-gray-700">
                    While we understand that medical emergencies can occur, our zero refund policy applies 
                    to all situations. We recommend purchasing travel insurance to cover such contingencies.
                  </p>
                </div>
                
                <div className="border-l-4 border-gray-400 pl-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Weather Conditions</h4>
                  <p className="text-gray-700">
                    Bookings are not refundable due to adverse weather conditions. Our facilities remain 
                    operational in most weather conditions, and indoor activities are available.
                  </p>
                </div>

                <div className="border-l-4 border-gray-400 pl-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Government Restrictions</h4>
                  <p className="text-gray-700">
                    In case of government-imposed restrictions that prevent operations, we will work with 
                    guests to reschedule their visit. However, refunds will not be provided.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brunswick-green mb-4">Recommendations</h2>
              <div className="bg-green-50 p-6 rounded-lg">
                <ul className="list-disc pl-6 space-y-2 text-green-800">
                  <li>Purchase comprehensive travel insurance before booking</li>
                  <li>Ensure your travel dates are confirmed before making payment</li>
                  <li>Check weather forecasts and plan accordingly</li>
                  <li>Keep emergency contacts handy for any last-minute issues</li>
                  <li>Read all terms and conditions carefully before booking</li>
                </ul>
              </div>
            </section>

            <section>
              <div className="bg-brunswick-green text-white p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <Phone className="mr-3" size={24} />
                  <h3 className="text-xl font-semibold">Need Assistance?</h3>
                </div>
                <p className="mb-4">
                  If you have questions about our cancellation policy or need to discuss your booking, 
                  please contact us:
                </p>
                <div className="space-y-2">
                  <p><strong>Phone:</strong> +91 9226869678</p>
                  <p><strong>Email:</strong> campatpawna@gmail.com</p>
                  <p><strong>Operating Hours:</strong> 9:00 AM - 8:00 PM</p>
                </div>
              </div>
            </section>

            <div className="bg-brunswick-green/10 p-6 rounded-lg border-l-4 border-brunswick-green">
              <p className="text-brunswick-green font-semibold">
                By proceeding with your booking, you acknowledge and accept our zero refund cancellation policy. 
                Please ensure you understand these terms before making your payment.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CancellationPolicy;
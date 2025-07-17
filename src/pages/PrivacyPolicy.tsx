import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Database, Mail } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    document.title = 'Privacy Policy - Plumeria Retreat';
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl opacity-90">How we protect and use your information</p>
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
              <div className="flex items-center mb-4">
                <Shield className="text-brunswick-green mr-3" size={24} />
                <h2 className="text-2xl font-bold text-brunswick-green">Our Commitment to Privacy</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Pawanai Agro Tourism, operating Plumeria Retreat, is committed to protecting your privacy and 
                personal information. This policy explains how we collect, use, and safeguard your data when 
                you visit our website or use our services.
              </p>
            </section>

            <section>
              <div className="flex items-center mb-4">
                <Database className="text-brunswick-green mr-3" size={24} />
                <h2 className="text-2xl font-bold text-brunswick-green">Information We Collect</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Personal Information</h4>
                  <ul className="list-disc pl-6 space-y-1 text-blue-700">
                    <li>Name, email address, and phone number</li>
                    <li>Billing and payment information</li>
                    <li>Government-issued ID details for verification</li>
                    <li>Emergency contact information</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Booking Information</h4>
                  <ul className="list-disc pl-6 space-y-1 text-green-700">
                    <li>Check-in and check-out dates</li>
                    <li>Number of guests and room preferences</li>
                    <li>Special requests and dietary requirements</li>
                    <li>Previous booking history</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Technical Information</h4>
                  <ul className="list-disc pl-6 space-y-1 text-purple-700">
                    <li>IP address and browser information</li>
                    <li>Device type and operating system</li>
                    <li>Website usage patterns and preferences</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-4">
                <Eye className="text-brunswick-green mr-3" size={24} />
                <h2 className="text-2xl font-bold text-brunswick-green">How We Use Your Information</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">Service Delivery</h4>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Process and confirm bookings</li>
                    <li>Provide customer support</li>
                    <li>Send booking confirmations and updates</li>
                    <li>Facilitate check-in and check-out</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">Communication</h4>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Send promotional offers and updates</li>
                    <li>Respond to inquiries and feedback</li>
                    <li>Provide important service notifications</li>
                    <li>Conduct customer satisfaction surveys</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">Legal Compliance</h4>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Comply with government regulations</li>
                    <li>Maintain guest registration records</li>
                    <li>Process payments and maintain financial records</li>
                    <li>Respond to legal requests</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">Improvement</h4>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Analyze website usage and performance</li>
                    <li>Improve our services and facilities</li>
                    <li>Develop new features and offerings</li>
                    <li>Personalize your experience</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-4">
                <Lock className="text-brunswick-green mr-3" size={24} />
                <h2 className="text-2xl font-bold text-brunswick-green">Data Protection & Security</h2>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-brunswick-green rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>All personal data is encrypted during transmission using SSL technology</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-brunswick-green rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Payment information is processed through secure, PCI-compliant payment gateways</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-brunswick-green rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Access to personal data is restricted to authorized personnel only</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-brunswick-green rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Regular security audits and updates are performed on our systems</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-brunswick-green rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Data backups are stored securely and encrypted</span>
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brunswick-green mb-4">Information Sharing</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4 bg-green-50 p-4 rounded-r-lg">
                  <h4 className="font-semibold text-green-800 mb-2">We DO Share With:</h4>
                  <ul className="list-disc pl-6 space-y-1 text-green-700">
                    <li>Payment processors for transaction processing</li>
                    <li>Government authorities when legally required</li>
                    <li>Service providers who assist in our operations</li>
                    <li>Emergency services if guest safety is at risk</li>
                  </ul>
                </div>

                <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-4 rounded-r-lg">
                  <h4 className="font-semibold text-red-800 mb-2">We DO NOT Share With:</h4>
                  <ul className="list-disc pl-6 space-y-1 text-red-700">
                    <li>Third-party marketers or advertisers</li>
                    <li>Social media platforms without consent</li>
                    <li>Other guests or unauthorized parties</li>
                    <li>Data brokers or analytics companies</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brunswick-green mb-4">Your Rights</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">Access & Control</h4>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Request access to your personal data</li>
                    <li>Update or correct your information</li>
                    <li>Delete your account and data</li>
                    <li>Opt-out of marketing communications</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">Data Portability</h4>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Export your booking history</li>
                    <li>Transfer data to another service</li>
                    <li>Receive data in a readable format</li>
                    <li>Restrict processing of your data</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brunswick-green mb-4">Cookies & Tracking</h2>
              <div className="bg-yellow-50 p-6 rounded-lg">
                <p className="text-yellow-800 mb-4">
                  We use cookies and similar technologies to enhance your browsing experience and analyze website usage.
                </p>
                <div className="space-y-2 text-yellow-700">
                  <p><strong>Essential Cookies:</strong> Required for basic website functionality</p>
                  <p><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</p>
                  <p><strong>Marketing Cookies:</strong> Used to show relevant advertisements</p>
                  <p className="text-sm mt-4">
                    You can manage cookie preferences through your browser settings or our cookie consent banner.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brunswick-green mb-4">Data Retention</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="space-y-2 text-gray-700">
                  <li><strong>Booking Records:</strong> Retained for 7 years for legal compliance</li>
                  <li><strong>Payment Information:</strong> Processed and not stored on our servers</li>
                  <li><strong>Marketing Data:</strong> Retained until you opt-out or request deletion</li>
                  <li><strong>Website Analytics:</strong> Anonymized data retained for 2 years</li>
                </ul>
              </div>
            </section>

            <section>
              <div className="bg-brunswick-green text-white p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <Mail className="mr-3" size={24} />
                  <h3 className="text-xl font-semibold">Contact Us About Privacy</h3>
                </div>
                <p className="mb-4">
                  If you have questions about this privacy policy or want to exercise your rights, contact us:
                </p>
                <div className="space-y-2">
                  <p><strong>Email:</strong> campatpawna@gmail.com</p>
                  <p><strong>Phone:</strong> +91 9226869678</p>
                  <p><strong>Address:</strong> At-Bramhanoli, Fangne, Post- Pawna nagar, Tel- Maval, Dist- Pune, Maharashtra 410406</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brunswick-green mb-4">Policy Updates</h2>
              <div className="bg-brunswick-green/10 p-6 rounded-lg border-l-4 border-brunswick-green">
                <p className="text-brunswick-green">
                  This privacy policy may be updated periodically to reflect changes in our practices or legal requirements. 
                  We will notify you of significant changes via email or website notice. The last update date is shown at the top of this policy.
                </p>
                <p className="text-brunswick-green mt-4 font-semibold">
                  Last Updated: January 2025
                </p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
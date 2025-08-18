import React from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initGA, trackPage } from './analytics';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Campsites from './pages/Campsites';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import TermsConditions from './pages/TermsConditions';
import CancellationPolicy from './pages/CancellationPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CampsiteBooking from './pages/CampsiteBooking';
import StatusPage from './pages/PaymentSuccess';
import { Success, Failure, Cancel } from './pages/PaymentSuccesss';
import ScrollToTop from '../src/utils/ScrollToTop';  // ✅ import it

function App() {
   const location = useLocation();

  useEffect(() => {
    initGA('G-XXXXXXXXXX'); // Replace with your ID
  }, []);

  useEffect(() => {
    trackPage(location.pathname);
  }, [location]);
  return (
    <Router>
      <ScrollToTop />
      {/* Main container with overflow constraints */}
      <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
        <Header />
        <main className="flex-grow w-full max-w-full overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/campsites" element={<Campsites />} /> */}
            <Route path="/campsites/:id" element={<CampsiteBooking />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/cancellation-policy" element={<CancellationPolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/payment/:status/:id" element={<StatusPage />} />
            <Route path="/failure" element={<Failure />} />
            <Route path="/cancel" element={<Cancel />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

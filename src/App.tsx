import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Campsites from './pages/Campsites';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import CampsiteBooking from './pages/CampsiteBooking';
import StatusPage from './pages/PaymentSuccess';
import { Success, Failure, Cancel } from './pages/PaymentSuccesss';
import ScrollToTop from '../src/utils/ScrollToTop';  // ✅ import it

function App() {
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

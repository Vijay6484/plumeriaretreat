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
// import Packages from './pages/Packages';
import PackageBooking from './pages/PackageBooking';
import CampsiteBooking from './pages/CampsiteBooking';
import { Success, Failure, Cancel } from './pages/Payments';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/campsites" element={<Campsites />} />
            <Route path="/campsites/:id" element={<CampsiteBooking />} />
            {/* <Route path="/packages" element={<Packages />} /> */}
            <Route path="/packages/:id" element={<PackageBooking />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/success" element={<Success />} />
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

export default App
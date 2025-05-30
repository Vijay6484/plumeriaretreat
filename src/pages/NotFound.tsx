import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-baby-powder">
      <div className="container-custom text-center">
        <h1 className="text-9xl font-bold text-brunswick-green mb-4 font-montserrat">404</h1>
        <h2 className="text-3xl font-bold mb-6 text-black font-montserrat">Page Not Found</h2>
        <p className="text-lg mb-8 text-black/70 max-w-lg mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Button variant="primary" size="lg">
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
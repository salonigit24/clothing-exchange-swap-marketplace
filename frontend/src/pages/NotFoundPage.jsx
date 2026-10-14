import React from 'react';
import { Link } from 'react-router-dom';
import { Shirt, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 bg-forest-50 text-forest-600 rounded-3xl flex items-center justify-center mb-4">
        <Shirt className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-earth-900 tracking-tight">404</h1>
      <h2 className="text-lg font-bold text-earth-800 mt-2">Page Not Found</h2>
      <p className="text-xs sm:text-sm text-earth-500 max-w-sm mt-1 mb-6">
        The page or clothing item you are looking for might have been swapped, removed, or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        Return Home
      </Link>
    </div>
  );
};

export default NotFoundPage;

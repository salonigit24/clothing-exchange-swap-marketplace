import React from 'react';

const LoadingSpinner = ({ message = 'Loading...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-forest-200 border-t-forest-600 animate-spin`}
      />
      {message && <p className="mt-3 text-sm font-medium text-earth-600">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;

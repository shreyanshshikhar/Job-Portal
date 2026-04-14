import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin border-t-primary-600"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <i className="fas fa-briefcase text-primary-600 text-xl animate-pulse"></i>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
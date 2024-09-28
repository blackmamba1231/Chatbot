// src/components/ui/button.jsx

import React from 'react';

export const Button = ({ children, className, ...props }) => (
  <button
    className={`px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${className}`}
    {...props}
  >
    {children}
  </button>
);

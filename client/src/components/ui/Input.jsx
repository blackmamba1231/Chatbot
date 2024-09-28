// src/components/ui/input.jsx

import React from 'react';

export const Input = ({ className, ...props }) => (
  <input
    className={`border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
    {...props}
  />
);

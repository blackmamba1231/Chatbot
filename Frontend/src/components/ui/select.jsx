// src/components/ui/select.jsx

import React from 'react';

export const Select = ({ children, value, onValueChange }) => (
  <div className="relative inline-block w-full">
    {React.Children.map(children, (child) => {
      if (child.type === SelectTrigger) {
        return React.cloneElement(child, { value, onValueChange });
      }
      return child;
    })}
  </div>
);

export const SelectTrigger = ({ children, value, onValueChange }) => (
  <button
    className="block w-full bg-gray-100 border border-gray-300 rounded-md px-4 py-2 text-left"
    onClick={() => onValueChange && onValueChange(value)}
  >
    {children}
  </button>
);

export const SelectValue = ({ children }) => (
  <span>{children}</span>
);

export const SelectContent = ({ children }) => (
  <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg">
    {children}
  </div>
);

export const SelectItem = ({ children, value, onValueChange }) => (
  <button
    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
    onClick={() => onValueChange && onValueChange(value)}
  >
    {children}
  </button>
);

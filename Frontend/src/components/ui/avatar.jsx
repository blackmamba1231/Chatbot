// src/components/ui/avatar.jsx

import React from 'react';

export const Avatar = ({ children, className }) => (
  <div className={`inline-flex items-center justify-center rounded-full overflow-hidden bg-gray-100 ${className}`}>
    {children}
  </div>
);

export const AvatarImage = ({ src, alt }) => (
  <img src={src} alt={alt} className="w-full h-full object-cover" />
);

export const AvatarFallback = ({ children }) => (
  <span className="text-gray-500">{children}</span>
);

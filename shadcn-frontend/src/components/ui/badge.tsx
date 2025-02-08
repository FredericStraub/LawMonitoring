import React from 'react';

interface BadgeProps {
  variant?: 'success' | 'secondary';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'secondary', children }) => {
  const variantClasses = variant === 'success' ? 'bg-green-500 text-white' : 'bg-gray-200 text-black';
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded ${variantClasses}`}>
      {children}
    </span>
  );
}; 
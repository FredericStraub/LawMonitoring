// src/components/Footer.jsx

import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-4 text-center">
      <p>&copy; {new Date().getFullYear()} EU Legislative Proposals</p>
    </footer>
  );
}

export default Footer;

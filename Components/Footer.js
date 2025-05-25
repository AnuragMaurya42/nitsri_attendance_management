// components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-center py-4">
      <p>&copy; {new Date().getFullYear()} NIT Srinagar. All rights reserved.</p>
    </footer>
  );
};

export default Footer;

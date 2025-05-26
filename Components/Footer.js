// components/Footer.js
import React from "react";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white text-center py-4 z-50">
      <p>&copy; {new Date().getFullYear()} NIT Srinagar. All rights reserved.</p>
    </footer>
  );
};

export default Footer;

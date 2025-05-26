// components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#2d3748',
        color: 'white',
        padding: '8px 16px',
        textAlign: 'center',
        fontSize: '0.85rem',
        position: 'sticky',
        bottom: 0,
        zIndex: 1000,
      }}
    >
      <p>&copy; {new Date().getFullYear()} NIT Srinagar. All rights reserved.</p>
    </footer>
  );
};

export default Footer;

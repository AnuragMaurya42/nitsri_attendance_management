import React from 'react';

const Footer = () => {
  return (
    <div style={{ backgroundColor: '#2d3748', color: 'white', padding: '16px', textAlign: 'center' }}>
      <p>&copy; {new Date().getFullYear()} NIT Srinagar. All rights reserved.</p>
    </div>
  );
};

export default Footer;

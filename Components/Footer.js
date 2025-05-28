import React from "react";

const Footer = () => {
  return (
    <footer
      className="fixed bottom-0 left-0 right-0 text-center z-50"
      style={{
        backgroundColor: '#fdf6e3', // light cream
        color: '#333', // dark text
        fontSize: '0.75rem',
        padding: '0.4rem 0',
        borderTop: '1px solid #e0e0e0',
      }}
    >
      <p>&copy; {new Date().getFullYear()} NIT Srinagar. All rights reserved.</p>
    </footer>
  );
};

export default Footer;

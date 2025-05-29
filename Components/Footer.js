import React from "react";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-[#fdf6e3] text-xs text-gray-800 border-t py-2 text-center z-50 h-6">
      <p>&copy; {new Date().getFullYear()} NIT Srinagar. All rights reserved.</p>
    </footer>
  );
};

export default Footer;

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-800 via-indigo-900 to-indigo-900 text-indigo-100 shadow-inner border-t border-indigo-800">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col items-center">
        <p className="text-xs md:text-sm text-indigo-200 tracking-wide text-center">
          &copy; {new Date().getFullYear()} MicroCourse. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

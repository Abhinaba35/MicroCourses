import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  BellIcon,
  UserCircleIcon,
  ChevronDownIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  const isPublicPage =
    location.pathname === '/' ||
    location.pathname === '/login' ||
    location.pathname === '/register';

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  if (isPublicPage) {
    // Full-width, minimal navbar for public pages
    const navLinks = [
      { to: '/', label: 'Home' },
      { to: '/login', label: 'Login' },
      { to: '/register', label: 'Register' },
    ];
    return (
      <nav className="w-full flex items-center justify-between fixed top-0 left-0 z-30 bg-gradient-to-r from-white/90 via-blue-50 to-indigo-50/80 backdrop-blur-xl shadow-sm border-b border-indigo-50 py-5 px-8">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-indigo-700 tracking-tight">
          {/* Simple SVG icon for branding */}
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="inline-block mr-1">
            <circle cx="16" cy="16" r="16" fill="url(#paint0_linear)" />
            <defs>
              <linearGradient id="paint0_linear" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#60a5fa" />
                <stop offset="1" stopColor="#818cf8" />
              </linearGradient>
            </defs>
          </svg>
          MicroCourse
        </Link>
        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1 text-base font-medium transition-all duration-200 focus:outline-none focus:ring-0 border-b-2 border-transparent
                ${location.pathname === link.to
                  ? 'text-blue-700 border-blue-500'
                  : 'text-indigo-600 hover:text-blue-700 hover:border-blue-400 hover:underline underline-offset-8'}`}
              style={{letterSpacing: '0.01em'}}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    );
  }

  return (
    <div className="lg:pl-64">
      <nav className="flex items-center justify-between h-16 px-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-900 shadow-md border-b border-indigo-800 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-2xl font-extrabold text-white tracking-tight drop-shadow-sm">
            MicroCourse
          </Link>
        </div>
        <div className="flex items-center space-x-3">
          {user?.role !== 'student' && (
            <Link
              to="/courses/create"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-700 hover:from-blue-600 hover:to-indigo-800 shadow transition"
            >
              <PlusIcon className="w-4 h-4 mr-1 -ml-1" />
              Create Course
            </Link>
          )}
          <button className="p-2 text-indigo-100 rounded-full hover:bg-indigo-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300">
            <BellIcon className="h-5 w-5" />
          </button>
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 text-sm focus:outline-none"
            >
              <UserCircleIcon className="w-7 h-7 text-indigo-100" />
              <div className="hidden md:block text-left">
                <div className="font-semibold text-white">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-xs text-indigo-200 capitalize">
                  {user?.role}
                </div>
              </div>
              <ChevronDownIcon className="w-4 h-4 text-indigo-200" />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 z-50 border border-gray-200 animate-fade-in">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 rounded"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/my-courses"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 rounded"
                  onClick={() => setIsProfileOpen(false)}
                >
                  My Courses
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 rounded"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

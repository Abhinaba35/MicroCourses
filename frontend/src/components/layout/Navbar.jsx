import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  return (
    <div className="lg:pl-64">
      <nav className="flex items-center justify-between h-16 px-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-900 shadow-md border-b border-indigo-800 sm:px-6 lg:px-8">
        <div>
          {/* This space can be used for breadcrumbs or search bar in the future */}
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

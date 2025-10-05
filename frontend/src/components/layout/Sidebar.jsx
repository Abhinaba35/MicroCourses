import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  HomeIcon,
  BookOpenIcon,
  UserGroupIcon,
  AcademicCapIcon,
  UserIcon,
  CogIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
      roles: ['student', 'instructor', 'admin'],
    },
    {
      name: 'Courses',
      href: '/courses',
      icon: BookOpenIcon,
      roles: ['student', 'instructor', 'admin'],
    },
    {
      name: 'My Courses',
      href: '/my-courses',
      icon: AcademicCapIcon,
      roles: ['student', 'instructor'],
    },
    {
      name: 'Enrollments',
      href: '/enrollments',
      icon: UserGroupIcon,
      roles: ['student', 'instructor', 'admin'],
    },
    {
      name: 'Users',
      href: '/users',
      icon: UserIcon,
      roles: ['admin'],
    },
    {
      name: 'AI Helper',
      href: '/ai-helper',
      icon: CogIcon,
      roles: ['student', 'instructor', 'admin'],
    },
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role || '')
  );

  return (
    <div className="hidden lg:flex lg:flex-shrink-0 lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
      <div className="flex flex-col flex-grow bg-gradient-to-b from-blue-800 via-indigo-800 to-indigo-900 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 h-16">
          <h1 className="text-2xl font-bold text-white tracking-wide">MicroCourse</h1>
        </div>
        <div className="mt-5 flex-1 flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={clsx(
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150',
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md'
                      : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
                  )}
                >
                  <item.icon
                    className={clsx(
                      'mr-3 flex-shrink-0 h-6 w-6',
                      isActive ? 'text-white' : 'text-indigo-200 group-hover:text-white'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

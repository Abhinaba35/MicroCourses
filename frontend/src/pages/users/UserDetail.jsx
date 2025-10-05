import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeftIcon,
  UserCircleIcon,
  AcademicCapIcon,
  CalendarIcon,
  EnvelopeIcon,
  IdentificationIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/users/${id}`);
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to fetch user details');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="badge-danger">Admin</span>;
      case 'instructor':
        return <span className="badge-primary">Instructor</span>;
      case 'student':
        return <span className="badge-success">Student</span>;
      default:
        return <span className="badge-gray">{role}</span>;
    }
  };

  if (loading) {
    return <LoadingSpinner className="min-h-96" />;
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">User not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The user you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/users" className="btn-primary mt-4">
          Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/users"
          className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Users
        </Link>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              {user.firstName} {user.lastName}
            </h1>
            <div className="mt-2 flex items-center space-x-4">
              {getRoleBadge(user.role)}
              {user.isActive ? (
                <span className="badge-success">Active</span>
              ) : (
                <span className="badge-danger">Inactive</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                
                {user.studentId && (
                  <div className="flex items-center">
                    <IdentificationIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Student ID</p>
                      <p className="text-sm text-gray-500">{user.studentId}</p>
                    </div>
                  </div>
                )}
                
                {user.department && (
                  <div className="flex items-center">
                    <AcademicCapIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Department</p>
                      <p className="text-sm text-gray-500">{user.department}</p>
                    </div>
                  </div>
                )}
                
                {user.year && (
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Year</p>
                      <p className="text-sm text-gray-500">{user.year}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enrolled Courses */}
          {user.enrolledCourses.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">Enrolled Courses</h3>
              </div>
              <div className="card-body">
                <div className="space-y-3">
                  {user.enrolledCourses.map((course) => (
                    <div key={course._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {course.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {course.code} • {course.credits} credits • {course.department}
                        </p>
                      </div>
                      <Link
                        to={`/courses/${course._id}`}
                        className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                      >
                        View Course
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="card">
            <div className="card-body text-center">
              <div className="flex justify-center mb-4">
                <UserCircleIcon className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-sm text-gray-500 capitalize">{user.role}</p>
              {user.studentId && (
                <p className="text-sm text-gray-500 mt-1">ID: {user.studentId}</p>
              )}
            </div>
          </div>

          {/* Account Information */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
            </div>
            <div className="card-body space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Role</p>
                <p className="text-sm text-gray-500 capitalize">{user.role}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-900">Status</p>
                <p className="text-sm text-gray-500">
                  {user.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-900">Member Since</p>
                <p className="text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-900">Last Updated</p>
                <p className="text-sm text-gray-500">
                  {new Date(user.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Quick Stats</h3>
            </div>
            <div className="card-body">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600">
                  {user.enrolledCourses.length}
                </p>
                <p className="text-sm text-gray-500">Enrolled Courses</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;

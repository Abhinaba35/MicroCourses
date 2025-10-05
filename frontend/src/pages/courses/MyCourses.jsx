import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import {
  EyeIcon,
  UserGroupIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const MyCourses = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user?.id) {
      fetchEnrollments();
    }
  }, [user?.id]);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/enrollments/student/${user?.id}`);
      setEnrollments(response.data.enrollments);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      toast.error('Failed to fetch your courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDropCourse = async (enrollmentId) => {
    if (!window.confirm('Are you sure you want to drop this course?')) {
      return;
    }

    try {
      await axios.delete(`/enrollments/${enrollmentId}`);
      toast.success('Successfully dropped the course');
      fetchEnrollments(); // Refresh the list
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to drop course';
      toast.error(message);
    }
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    if (filter === 'all') return true;
    return enrollment.status === filter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'enrolled':
        return <span className="badge-success">Enrolled</span>;
      case 'completed':
        return <span className="badge-primary">Completed</span>;
      case 'dropped':
        return <span className="badge-danger">Dropped</span>;
      case 'failed':
        return <span className="badge-warning">Failed</span>;
      default:
        return <span className="badge-gray">{status}</span>;
    }
  };

  const getGradeBadge = (grade) => {
    if (!grade) return null;
    
    const gradeColors = {
      'A+': 'bg-green-100 text-green-800',
      'A': 'bg-green-100 text-green-800',
      'A-': 'bg-green-100 text-green-800',
      'B+': 'bg-blue-100 text-blue-800',
      'B': 'bg-blue-100 text-blue-800',
      'B-': 'bg-blue-100 text-blue-800',
      'C+': 'bg-yellow-100 text-yellow-800',
      'C': 'bg-yellow-100 text-yellow-800',
      'C-': 'bg-yellow-100 text-yellow-800',
      'D+': 'bg-orange-100 text-orange-800',
      'D': 'bg-orange-100 text-orange-800',
      'F': 'bg-red-100 text-red-800',
      'P': 'bg-green-100 text-green-800',
      'NP': 'bg-red-100 text-red-800',
    };

    return (
      <span className={`badge ${gradeColors[grade] || 'bg-gray-100 text-gray-800'}`}>
        {grade}
      </span>
    );
  };

  if (loading) {
    return <LoadingSpinner className="min-h-96" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            My Courses
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            View and manage your enrolled courses
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                filter === 'all'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All ({enrollments.length})
            </button>
            <button
              onClick={() => setFilter('enrolled')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                filter === 'enrolled'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Enrolled ({enrollments.filter(e => e.status === 'enrolled').length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                filter === 'completed'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Completed ({enrollments.filter(e => e.status === 'completed').length})
            </button>
            <button
              onClick={() => setFilter('dropped')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                filter === 'dropped'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Dropped ({enrollments.filter(e => e.status === 'dropped').length})
            </button>
          </div>
        </div>
      </div>

      {/* Courses List */}
      {filteredEnrollments.length > 0 ? (
        <div className="space-y-4">
          {filteredEnrollments.map((enrollment) => (
            <div key={enrollment._id} className="card">
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {enrollment.course.title}
                      </h3>
                      {getStatusBadge(enrollment.status)}
                      {getGradeBadge(enrollment.grade)}
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-3">
                      {enrollment.course.code} • {enrollment.course.credits} credits • {enrollment.course.department}
                    </p>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {enrollment.course.description}
                    </p>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="flex items-center">
                        <UserGroupIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <p className="text-xs font-medium text-gray-500">Instructor</p>
                          <p className="text-sm text-gray-900">
                            {enrollment.course.instructor.firstName} {enrollment.course.instructor.lastName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <p className="text-xs font-medium text-gray-500">Days</p>
                          <p className="text-sm text-gray-900">
                            {enrollment.course.schedule.days.join(', ')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <p className="text-xs font-medium text-gray-500">Time</p>
                          <p className="text-sm text-gray-900">
                            {enrollment.course.schedule.time.start} - {enrollment.course.schedule.time.end}
                          </p>
                        </div>
                      </div>

                      {enrollment.course.schedule.room && (
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <p className="text-xs font-medium text-gray-500">Room</p>
                            <p className="text-sm text-gray-900">
                              {enrollment.course.schedule.room}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Attendance and Grade Info */}
                    {(enrollment.attendance.totalClasses > 0 || enrollment.grade) && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {enrollment.attendance.totalClasses > 0 && (
                            <div>
                              <p className="text-xs font-medium text-gray-500">Attendance</p>
                              <p className="text-sm text-gray-900">
                                {enrollment.attendance.attendedClasses}/{enrollment.attendance.totalClasses} classes
                                ({enrollment.attendance.attendancePercentage}%)
                              </p>
                            </div>
                          )}
                          
                          {enrollment.grade && (
                            <div>
                              <p className="text-xs font-medium text-gray-500">Final Grade</p>
                              <p className="text-sm text-gray-900">{enrollment.grade}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <Link
                      to={`/courses/${enrollment.course._id}`}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-bold text-base bg-gradient-to-r from-blue-600 via-indigo-500 to-indigo-700 hover:from-indigo-700 hover:to-blue-700 text-white shadow-lg transition border-0 focus:outline-none focus:ring-4 focus:ring-indigo-300/40 transform hover:scale-105"
                    >
                      <EyeIcon className="h-5 w-5 mr-1" />
                      View Details
                    </Link>
                    {enrollment.status === 'enrolled' && (
                      <button
                        onClick={() => handleDropCourse(enrollment._id)}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-bold text-base bg-gradient-to-r from-red-500 via-pink-500 to-indigo-500 hover:from-red-600 hover:to-indigo-700 text-white shadow-lg transition border-0 focus:outline-none focus:ring-4 focus:ring-red-300/40 transform hover:scale-105"
                      >
                        Drop Course
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No courses found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'all' 
              ? "You haven't enrolled in any courses yet."
              : `No ${filter} courses found.`
            }
          </p>
          {filter === 'all' && (
            <Link to="/courses" className="btn-primary mt-4">
              Browse Courses
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default MyCourses;

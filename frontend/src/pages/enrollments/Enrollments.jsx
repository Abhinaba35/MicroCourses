import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import {
  UserGroupIcon,
  AcademicCapIcon,
  ChartBarIcon,
  EyeIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Enrollments = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      let response;
      
      if (user?.role === 'student') {
        response = await axios.get(`/enrollments/student/${user.id}`);
      } else if (user?.role === 'instructor') {
        // For instructors, we'll need to get their courses first, then enrollments
        // This is a simplified version - in a real app, you might want a different endpoint
        response = await axios.get(`/enrollments/student/${user.id}`);
      } else if (user?.role === 'admin') {
        // For admin, we might want to show all enrollments or a specific view
        response = await axios.get(`/enrollments/student/${user.id}`);
      }
      
      if (response) {
        setEnrollments(response.data.enrollments);
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      toast.error('Failed to fetch enrollments');
    } finally {
      setLoading(false);
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
            Enrollments
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {user?.role === 'student' 
              ? 'View your course enrollments and progress'
              : 'Manage course enrollments and student records'
            }
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AcademicCapIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Enrollments
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {enrollments.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Enrollments
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {enrollments.filter(e => e.status === 'enrolled').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completed
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {enrollments.filter(e => e.status === 'completed').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Dropped
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {enrollments.filter(e => e.status === 'dropped').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
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

      {/* Enrollments Table */}
      {filteredEnrollments.length > 0 ? (
        <div className="card">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrollment Date
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEnrollments.map((enrollment) => (
                  <tr key={enrollment._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {enrollment.course.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {enrollment.course.code} • {enrollment.course.credits} credits
                        </div>
                        <div className="text-xs text-gray-400">
                          {enrollment.course.department}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {enrollment.student.firstName} {enrollment.student.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {enrollment.student.email}
                        </div>
                        {enrollment.student.studentId && (
                          <div className="text-xs text-gray-400">
                            ID: {enrollment.student.studentId}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(enrollment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getGradeBadge(enrollment.grade) || (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {enrollment.attendance.totalClasses > 0 ? (
                        <div>
                          <div className="text-sm text-gray-900">
                            {enrollment.attendance.attendedClasses}/{enrollment.attendance.totalClasses}
                          </div>
                          <div className="text-xs text-gray-500">
                            {enrollment.attendance.attendancePercentage}%
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <a
                          href={`/courses/${enrollment.course._id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </a>
                        {(user?.role === 'instructor' || user?.role === 'admin') && (
                          <button className="text-gray-600 hover:text-gray-900">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No enrollments found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'all' 
              ? "No enrollments to display."
              : `No ${filter} enrollments found.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Enrollments;

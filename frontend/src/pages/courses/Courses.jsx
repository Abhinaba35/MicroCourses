import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Courses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [departments, setDepartments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCourses();
  }, [currentPage, selectedDepartment, selectedSemester, selectedStatus]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
      });

      if (selectedDepartment) params.append('department', selectedDepartment);
      if (selectedSemester) params.append('semester', selectedSemester);
      if (selectedStatus) params.append('status', selectedStatus);

      const response = await axios.get(`/courses?${params}`);
      setCourses(response.data.courses);
      setTotalPages(response.data.pagination.pages);

      // Extract unique departments for filter
      const uniqueDepartments = [...new Set(response.data.courses.map(course => course.department))];
      setDepartments(uniqueDepartments);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return <span className="badge-success">Open</span>;
      case 'closed':
        return <span className="badge-warning">Closed</span>;
      case 'cancelled':
        return <span className="badge-danger">Cancelled</span>;
      default:
        return <span className="badge-gray">{status}</span>;
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('');
    setSelectedSemester('');
    setSelectedStatus('');
    setCurrentPage(1);
  };

  if (loading) {
    return <LoadingSpinner className="min-h-96" />;
  }

  return (
    <div className="space-y-8 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-indigo-200 py-6 px-2 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-indigo-800 sm:text-3xl sm:truncate drop-shadow-sm">
            Courses
          </h2>
          <p className="mt-1 text-sm text-indigo-600">
            Browse and manage all available courses
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          {(user?.role === 'instructor' || user?.role === 'admin') && (
            <Link
              to="/courses/create"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow transition"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Create Course
            </Link>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/80 rounded-xl shadow p-6 border border-indigo-100">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-indigo-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search courses..."
                className="w-full px-4 py-2 border border-indigo-200 rounded-full bg-white text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 shadow-sm transition"
              />
            </div>
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-4 py-2 border border-indigo-200 rounded-full bg-white text-indigo-900 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 shadow-sm transition"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Semester Filter */}
          <div>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full px-4 py-2 border border-indigo-200 rounded-full bg-white text-indigo-900 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 shadow-sm transition"
            >
              <option value="">All Semesters</option>
              <option value="Fall">Fall</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-indigo-200 rounded-full bg-white text-indigo-900 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 shadow-sm transition"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {(selectedDepartment || selectedSemester || selectedStatus || searchTerm) && (
          <div className="mt-4">
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-indigo-500 font-semibold"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <div key={course._id} className="bg-white/90 rounded-xl shadow-lg border border-indigo-100 hover:shadow-2xl transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-indigo-800 mb-1">
                      {course.title}
                    </h3>
                    <p className="text-sm text-indigo-500 mb-2">
                      {course.code} • {course.credits} credits
                    </p>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                  <div className="ml-4">
                    {getStatusBadge(course.status)}
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium text-indigo-700">Department:</span>
                    <span className="ml-2">{course.department}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium text-indigo-700">Instructor:</span>
                    <span className="ml-2">
                      {course.instructor.firstName} {course.instructor.lastName}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium text-indigo-700">Enrollment:</span>
                    <span className="ml-2">
                      {course.enrollmentCount}/{course.maxStudents}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium text-indigo-700">Schedule:</span>
                    <span className="ml-2">
                      {course.schedule.days.join(', ')} {course.schedule.time.start}-{course.schedule.time.end}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/courses/${course._id}`}
                    className="flex-1 px-3 py-2 rounded-lg text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 text-center transition"
                  >
                    <EyeIcon className="h-4 w-4 mr-1 inline" />
                    View Details
                  </Link>
                  {(user?.role === 'instructor' || user?.role === 'admin') && (
                    <Link
                      to={`/courses/${course._id}/edit`}
                      className="px-3 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition"
                    >
                      <PencilIcon className="h-4 w-4 inline" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-indigo-300">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-indigo-800">No courses found</h3>
          <p className="mt-1 text-sm text-indigo-600">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8">
          <div className="text-sm text-indigo-700">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg font-semibold bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 shadow disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg font-semibold bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 shadow disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;

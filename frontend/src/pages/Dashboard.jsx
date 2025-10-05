import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import {
  BookOpenIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ChartBarIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const coursesResponse = await axios.get('/api/courses?limit=5');
        setRecentCourses(coursesResponse.data.courses);

        let statsData = {
          totalCourses: coursesResponse.data.pagination.total,
          enrolledCourses: 0,
          totalStudents: 0,
          totalInstructors: 0,
        };

        if (user?.role === 'student') {
          const enrollmentsResponse = await axios.get(`/api/enrollments/student/${user.id}`);
          statsData.enrolledCourses = enrollmentsResponse.data.enrollments.length;
        } else if (user?.role === 'instructor') {
          const instructorCoursesResponse = await axios.get(`/api/courses/instructor/${user.id}`);
          statsData.enrolledCourses = instructorCoursesResponse.data.courses.length;
        } else if (user?.role === 'admin') {
          const usersResponse = await axios.get('/api/users/stats');
          statsData.totalStudents = usersResponse.data.totalStudents;
          statsData.totalInstructors = usersResponse.data.totalInstructors;
        }

        setStats(statsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return <span className="status-badge status-open">Open</span>;
      case 'closed':
        return <span className="status-badge status-closed">Closed</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  if (loading) {
    return <LoadingSpinner className="min-h-96" />;
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {getGreeting()}, {user?.firstName}!
          </h1>
          <p className="mt-1 text-lg text-gray-600">
            Welcome to your {user?.role} dashboard.
          </p>
        </div>

        {stats && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={BookOpenIcon}
              title={user?.role === 'student' ? 'Available Courses' : 'Total Courses'}
              value={stats.totalCourses}
              color="indigo"
            />
            <StatCard
              icon={AcademicCapIcon}
              title="My Courses"
              value={stats.enrolledCourses}
              color="green"
            />
            {user?.role === 'admin' && (
              <>
                <StatCard
                  icon={UserGroupIcon}
                  title="Total Students"
                  value={stats.totalStudents}
                  color="blue"
                />
                <StatCard
                  icon={ChartBarIcon}
                  title="Total Instructors"
                  value={stats.totalInstructors}
                  color="purple"
                />
              </>
            )}
          </div>
        )}

        <div className="mt-8">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Recent Courses</h2>
            {recentCourses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Department</th>
                      <th>Credits</th>
                      <th>Enrollment</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentCourses.map((course) => (
                      <tr key={course._id}>
                        <td>
                          <div className="font-semibold">{course.title}</div>
                          <div className="text-sm text-gray-500">{course.code}</div>
                        </td>
                        <td>{course.department}</td>
                        <td>{course.credits}</td>
                        <td>{course.enrollmentCount}/{course.maxStudents}</td>
                        <td>{getStatusBadge(course.status)}</td>
                        <td>
                          <Link to={`/courses/${course._id}`}>
                            <EyeIcon className="w-5 h-5 text-gray-400 hover:text-primary-color" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10">
                <BookOpenIcon className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-base font-semibold text-gray-900">No courses</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new course.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, color }) => {
  const colors = {
    indigo: 'from-indigo-500 to-indigo-600',
    green: 'from-green-500 to-green-600',
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} text-white rounded-xl shadow-lg p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-full p-3">
          <Icon className="w-7 h-7" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

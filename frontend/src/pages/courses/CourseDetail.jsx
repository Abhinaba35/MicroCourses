import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  ArrowLeftIcon,
  PencilIcon,
  UserGroupIcon,
  ClockIcon,
  MapPinIcon,
  AcademicCapIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/courses/${id}`);
      setCourse(response.data.course);
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Failed to fetch course details');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!course) return;

    try {
      setEnrolling(true);
      await axios.post('/enrollments', { courseId: course._id });
      toast.success('Successfully enrolled in course!');
      fetchCourse(); // Refresh course data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to enroll in course';
      toast.error(message);
    } finally {
      setEnrolling(false);
    }
  };

  const isEnrolled = course?.enrolledStudents.some(
    student => student._id === user?.id
  );

  const canEnroll = user?.role === 'student' && 
    course?.status === 'open' && 
    !isEnrolled && 
    course.enrolledStudents.length < course.maxStudents;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return <span className="badge-success">Open for Enrollment</span>;
      case 'closed':
        return <span className="badge-warning">Closed</span>;
      case 'cancelled':
        return <span className="badge-danger">Cancelled</span>;
      default:
        return <span className="badge-gray">{status}</span>;
    }
  };

  if (loading) {
    return <LoadingSpinner className="min-h-96" />;
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Course not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The course you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/courses" className="btn-primary mt-4">
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/courses')}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Courses
        </button>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
            <p className="mt-1 text-lg text-gray-600">{course.code}</p>
            <div className="mt-2 flex items-center space-x-4">
              {getStatusBadge(course.status)}
              <span className="text-sm text-gray-500">
                {course.credits} credits
              </span>
            </div>
          </div>
          
          <div className="flex space-x-3">
            {(user?.role === 'instructor' || user?.role === 'admin') && (
              <Link
                to={`/courses/${course._id}/edit`}
                className="btn-secondary"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit Course
              </Link>
            )}
            
            {canEnroll && (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="btn-primary"
              >
                {enrolling ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Enrolling...</span>
                  </>
                ) : (
                  'Enroll Now'
                )}
              </button>
            )}
            
            {isEnrolled && (
              <span className="badge-success">Enrolled</span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Course Description</h3>
            </div>
            <div className="card-body">
              <p className="text-gray-700 whitespace-pre-wrap">{course.description}</p>
            </div>
          </div>

          {/* Schedule */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Schedule</h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Days</p>
                    <p className="text-sm text-gray-500">{course.schedule.days.join(', ')}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Time</p>
                    <p className="text-sm text-gray-500">
                      {course.schedule.time.start} - {course.schedule.time.end}
                    </p>
                  </div>
                </div>
                
                {course.schedule.room && (
                  <div className="flex items-center">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Room</p>
                      <p className="text-sm text-gray-500">{course.schedule.room}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Prerequisites */}
          {course.prerequisites.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">Prerequisites</h3>
              </div>
              <div className="card-body">
                <div className="space-y-2">
                  {course.prerequisites.map((prereq) => (
                    <div key={prereq._id} className="flex items-center">
                      <AcademicCapIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-700">
                        {prereq.code} - {prereq.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Info */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Course Information</h3>
            </div>
            <div className="card-body space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Department</p>
                <p className="text-sm text-gray-500">{course.department}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-900">Semester</p>
                <p className="text-sm text-gray-500">{course.semester} {course.year}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-900">Credits</p>
                <p className="text-sm text-gray-500">{course.credits}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-900">Instructor</p>
                <p className="text-sm text-gray-500">
                  {course.instructor.firstName} {course.instructor.lastName}
                </p>
                <p className="text-xs text-gray-400">{course.instructor.email}</p>
              </div>
            </div>
          </div>

          {/* Enrollment */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Enrollment</h3>
            </div>
            <div className="card-body">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Enrolled</span>
                <span className="text-sm text-gray-500">
                  {course.enrolledStudents.length}/{course.maxStudents}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full"
                  style={{
                    width: `${(course.enrolledStudents.length / course.maxStudents) * 100}%`,
                  }}
                ></div>
              </div>
              
              <p className="mt-2 text-xs text-gray-500">
                {course.maxStudents - course.enrolledStudents.length} spots remaining
              </p>
            </div>
          </div>

          {/* Enrolled Students */}
          {course.enrolledStudents.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">Enrolled Students</h3>
              </div>
              <div className="card-body">
                <div className="space-y-3">
                  {course.enrolledStudents.slice(0, 5).map((student) => (
                    <div key={student._id} className="flex items-center">
                      <UserGroupIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </p>
                        {student.studentId && (
                          <p className="text-xs text-gray-500">{student.studentId}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {course.enrolledStudents.length > 5 && (
                    <p className="text-xs text-gray-500">
                      +{course.enrolledStudents.length - 5} more students
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;

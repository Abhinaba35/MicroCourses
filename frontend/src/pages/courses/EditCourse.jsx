import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedDays, setSelectedDays] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/courses/${id}`);
      const course = response.data.course;
      
      // Set form values
      reset({
        title: course.title,
        code: course.code,
        description: course.description,
        credits: course.credits,
        department: course.department,
        maxStudents: course.maxStudents,
        semester: course.semester,
        year: course.year,
        status: course.status,
        schedule: {
          days: course.schedule.days,
          time: {
            start: course.schedule.time.start,
            end: course.schedule.time.end,
          },
          room: course.schedule.room || '',
        },
      });
      
      setSelectedDays(course.schedule.days);
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Failed to fetch course details');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDayToggle = (day) => {
    const newDays = selectedDays.includes(day)
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day];
    
    setSelectedDays(newDays);
    setValue('schedule.days', newDays);
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await axios.put(`/courses/${id}`, data);
      toast.success('Course updated successfully!');
      navigate(`/courses/${id}`);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update course';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner className="min-h-96" />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Edit Course</h2>
        <p className="mt-1 text-sm text-gray-600">
          Update the course details below.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
          </div>
          <div className="card-body space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="title" className="label">
                  Course Title *
                </label>
                <input
                  {...register('title', {
                    required: 'Course title is required',
                    minLength: {
                      value: 3,
                      message: 'Title must be at least 3 characters',
                    },
                  })}
                  type="text"
                  className={errors.title ? 'input-error' : 'input'}
                  placeholder="e.g., Introduction to Computer Science"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="code" className="label">
                  Course Code *
                </label>
                <input
                  {...register('code', {
                    required: 'Course code is required',
                    pattern: {
                      value: /^[A-Z]{2,4}\d{3,4}$/,
                      message: 'Course code must be in format like CS101',
                    },
                  })}
                  type="text"
                  className={errors.code ? 'input-error' : 'input'}
                  placeholder="e.g., CS101"
                />
                {errors.code && (
                  <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="description" className="label">
                Description *
              </label>
              <textarea
                {...register('description', {
                  required: 'Description is required',
                  minLength: {
                    value: 10,
                    message: 'Description must be at least 10 characters',
                  },
                })}
                rows={4}
                className={errors.description ? 'input-error' : 'input'}
                placeholder="Describe the course content, objectives, and what students will learn..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <div>
                <label htmlFor="credits" className="label">
                  Credits *
                </label>
                <select
                  {...register('credits', {
                    required: 'Credits are required',
                    valueAsNumber: true,
                  })}
                  className={errors.credits ? 'input-error' : 'input'}
                >
                  <option value={1}>1 Credit</option>
                  <option value={2}>2 Credits</option>
                  <option value={3}>3 Credits</option>
                  <option value={4}>4 Credits</option>
                  <option value={5}>5 Credits</option>
                  <option value={6}>6 Credits</option>
                </select>
                {errors.credits && (
                  <p className="mt-1 text-sm text-red-600">{errors.credits.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="department" className="label">
                  Department *
                </label>
                <input
                  {...register('department', {
                    required: 'Department is required',
                  })}
                  type="text"
                  className={errors.department ? 'input-error' : 'input'}
                  placeholder="e.g., Computer Science"
                />
                {errors.department && (
                  <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="maxStudents" className="label">
                  Max Students *
                </label>
                <input
                  {...register('maxStudents', {
                    required: 'Maximum students is required',
                    min: { value: 1, message: 'Must be at least 1' },
                    max: { value: 200, message: 'Cannot exceed 200' },
                    valueAsNumber: true,
                  })}
                  type="number"
                  className={errors.maxStudents ? 'input-error' : 'input'}
                  placeholder="30"
                />
                {errors.maxStudents && (
                  <p className="mt-1 text-sm text-red-600">{errors.maxStudents.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="status" className="label">
                  Status *
                </label>
                <select
                  {...register('status', {
                    required: 'Status is required',
                  })}
                  className={errors.status ? 'input-error' : 'input'}
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Schedule & Semester</h3>
          </div>
          <div className="card-body space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="semester" className="label">
                  Semester *
                </label>
                <select
                  {...register('semester', {
                    required: 'Semester is required',
                  })}
                  className={errors.semester ? 'input-error' : 'input'}
                >
                  <option value="Fall">Fall</option>
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                </select>
                {errors.semester && (
                  <p className="mt-1 text-sm text-red-600">{errors.semester.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="year" className="label">
                  Year *
                </label>
                <input
                  {...register('year', {
                    required: 'Year is required',
                    min: { value: 2020, message: 'Year must be 2020 or later' },
                    valueAsNumber: true,
                  })}
                  type="number"
                  className={errors.year ? 'input-error' : 'input'}
                  placeholder={new Date().getFullYear().toString()}
                />
                {errors.year && (
                  <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="label">Days of Week *</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {days.map((day) => (
                  <label key={day} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedDays.includes(day)}
                      onChange={() => handleDayToggle(day)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{day}</span>
                  </label>
                ))}
              </div>
              {errors.schedule?.days && (
                <p className="mt-1 text-sm text-red-600">Please select at least one day</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="startTime" className="label">
                  Start Time *
                </label>
                <input
                  {...register('schedule.time.start', {
                    required: 'Start time is required',
                  })}
                  type="time"
                  className={errors.schedule?.time?.start ? 'input-error' : 'input'}
                />
                {errors.schedule?.time?.start && (
                  <p className="mt-1 text-sm text-red-600">{errors.schedule.time.start.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="endTime" className="label">
                  End Time *
                </label>
                <input
                  {...register('schedule.time.end', {
                    required: 'End time is required',
                  })}
                  type="time"
                  className={errors.schedule?.time?.end ? 'input-error' : 'input'}
                />
                {errors.schedule?.time?.end && (
                  <p className="mt-1 text-sm text-red-600">{errors.schedule.time.end.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="room" className="label">
                  Room (Optional)
                </label>
                <input
                  {...register('schedule.room')}
                  type="text"
                  className="input"
                  placeholder="e.g., Room 101"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate(`/courses/${id}`)}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" />
                <span className="ml-2">Updating...</span>
              </>
            ) : (
              'Update Course'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCourse;

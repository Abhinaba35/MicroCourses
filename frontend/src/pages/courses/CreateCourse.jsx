import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Skeleton from '../../components/common/Skeleton';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      credits: 3,
      maxStudents: 30,
      year: new Date().getFullYear(),
      semester: 'Fall',
      schedule: {
        days: [],
        time: {
          start: '09:00',
          end: '10:30',
        },
        room: '',
      },
      prerequisites: [],
    },
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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
      await axios.post('/courses', data);
      toast.success('Course created successfully!');
      navigate('/courses');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create course';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 via-indigo-100 to-indigo-200 relative overflow-x-hidden py-0 px-0">
      {/* SVG Illustration background */}
      <svg className="absolute left-0 top-0 w-full h-64 opacity-20 pointer-events-none" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#a5b4fc" fillOpacity="1" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
      </svg>
      <div className="w-full flex flex-col items-center py-16 px-2 z-10">
        <div className="w-full max-w-2xl mx-auto bg-gradient-to-br from-blue-100 via-white to-indigo-100 border border-indigo-200 rounded-2xl shadow-2xl p-10 flex flex-col items-center">
          <h2 className="text-3xl font-bold text-indigo-800 drop-shadow-sm mb-2 text-center">Create New Course</h2>
          <p className="mb-6 text-base text-indigo-600 text-center">Fill in the course details below.</p>
          {isSubmitting ? (
            <div className="space-y-4 w-full">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-1/2 mx-auto" />
            </div>
          ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
            <div className="bg-white/80 rounded-xl shadow p-6 border border-indigo-100">
              <h3 className="text-lg font-semibold text-indigo-700 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="title" className="block text-xs font-semibold text-indigo-700 mb-1">
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
                    className={`w-full px-4 py-2 border rounded-lg bg-white text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition ${errors.title ? 'border-red-500' : 'border-indigo-200'}`}
                    placeholder="e.g., Introduction to Computer Science"
                  />
                  {errors.title && (
                    <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="code" className="block text-xs font-semibold text-indigo-700 mb-1">
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
                    className={`w-full px-4 py-2 border rounded-lg bg-white text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition ${errors.code ? 'border-red-500' : 'border-indigo-200'}`}
                    placeholder="e.g., CS101"
                  />
                  {errors.code && (
                    <p className="mt-1 text-xs text-red-600">{errors.code.message}</p>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="description" className="block text-xs font-semibold text-indigo-700 mb-1">
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
                  className={`w-full px-4 py-2 border rounded-lg bg-white text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition ${errors.description ? 'border-red-500' : 'border-indigo-200'}`}
                  placeholder="Describe the course content, objectives, and what students will learn..."
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="credits" className="block text-xs font-semibold text-indigo-700 mb-1">
                    Credits *
                  </label>
                  <select
                    {...register('credits', {
                      required: 'Credits are required',
                      valueAsNumber: true,
                    })}
                    className={`input input-bordered w-full focus:border-blue-400 focus:ring-2 focus:ring-blue-200 ${errors.credits ? 'border-red-500' : ''}`}
                  >
                    <option value={1}>1 Credit</option>
                    <option value={2}>2 Credits</option>
                    <option value={3}>3 Credits</option>
                    <option value={4}>4 Credits</option>
                    <option value={5}>5 Credits</option>
                    <option value={6}>6 Credits</option>
                  </select>
                  {errors.credits && (
                    <p className="mt-1 text-xs text-red-600">{errors.credits.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="department" className="block text-xs font-semibold text-indigo-700 mb-1">
                    Department *
                  </label>
                  <input
                    {...register('department', {
                      required: 'Department is required',
                    })}
                    type="text"
                    className={`w-full px-4 py-2 border rounded-lg bg-white text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition ${errors.department ? 'border-red-500' : 'border-indigo-200'}`}
                    placeholder="e.g., Computer Science"
                  />
                  {errors.department && (
                    <p className="mt-1 text-xs text-red-600">{errors.department.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="maxStudents" className="block text-xs font-semibold text-indigo-700 mb-1">
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
                    className={`input input-bordered w-full focus:border-blue-400 focus:ring-2 focus:ring-blue-200 ${errors.maxStudents ? 'border-red-500' : ''}`}
                    placeholder="30"
                  />
                  {errors.maxStudents && (
                    <p className="mt-1 text-xs text-red-600">{errors.maxStudents.message}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-white/80 rounded-xl shadow p-6 border border-indigo-100">
              <h3 className="text-lg font-semibold text-indigo-700 mb-4">Schedule & Semester</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="semester" className="block text-xs font-semibold text-indigo-700 mb-1">
                    Semester *
                  </label>
                  <select
                    {...register('semester', {
                      required: 'Semester is required',
                    })}
                    className={`input input-bordered w-full focus:border-blue-400 focus:ring-2 focus:ring-blue-200 ${errors.semester ? 'border-red-500' : ''}`}
                  >
                    <option value="Fall">Fall</option>
                    <option value="Spring">Spring</option>
                    <option value="Summer">Summer</option>
                  </select>
                  {errors.semester && (
                    <p className="mt-1 text-xs text-red-600">{errors.semester.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="year" className="block text-xs font-semibold text-indigo-700 mb-1">
                    Year *
                  </label>
                  <input
                    {...register('year', {
                      required: 'Year is required',
                      min: { value: 2020, message: 'Year must be 2020 or later' },
                      valueAsNumber: true,
                    })}
                    type="number"
                    className={`input input-bordered w-full focus:border-blue-400 focus:ring-2 focus:ring-blue-200 ${errors.year ? 'border-red-500' : ''}`}
                    placeholder={new Date().getFullYear().toString()}
                  />
                  {errors.year && (
                    <p className="mt-1 text-xs text-red-600">{errors.year.message}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-indigo-700 mb-1">Days of Week *</label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {days.map((day) => (
                    <label key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedDays.includes(day)}
                        onChange={() => handleDayToggle(day)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-indigo-700">{day}</span>
                    </label>
                  ))}
                </div>
                {errors.schedule?.days && (
                  <p className="mt-1 text-xs text-red-600">Please select at least one day</p>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="startTime" className="block text-xs font-semibold text-indigo-700 mb-1">
                    Start Time *
                  </label>
                  <input
                    {...register('schedule.time.start', {
                      required: 'Start time is required',
                    })}
                    type="time"
                    className={`input input-bordered w-full focus:border-blue-400 focus:ring-2 focus:ring-blue-200 ${errors.schedule?.time?.start ? 'border-red-500' : ''}`}
                  />
                  {errors.schedule?.time?.start && (
                    <p className="mt-1 text-xs text-red-600">{errors.schedule.time.start.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="endTime" className="block text-xs font-semibold text-indigo-700 mb-1">
                    End Time *
                  </label>
                  <input
                    {...register('schedule.time.end', {
                      required: 'End time is required',
                    })}
                    type="time"
                    className={`input input-bordered w-full focus:border-blue-400 focus:ring-2 focus:ring-blue-200 ${errors.schedule?.time?.end ? 'border-red-500' : ''}`}
                  />
                  {errors.schedule?.time?.end && (
                    <p className="mt-1 text-xs text-red-600">{errors.schedule.time.end.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="room" className="block text-xs font-semibold text-indigo-700 mb-1">
                    Room (Optional)
                  </label>
                  <input
                    {...register('schedule.room')}
                    type="text"
                    className="input input-bordered w-full focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                    placeholder="e.g., Room 101"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => navigate('/courses')}
                className="px-4 py-2 rounded-lg font-semibold bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 shadow transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition"
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  'Create Course'
                )}
              </button>
            </div>
          </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;

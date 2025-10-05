import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Skeleton from '../../components/common/Skeleton';

const CreateInstructor = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generated, setGenerated] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  // Generate random email and password for instructor
  const generateCredentials = () => {
    const randomStr = Math.random().toString(36).substring(2, 8);
    const email = `instructor_${randomStr}@minor.edu`;
    const password = Math.random().toString(36).slice(-8) + 'A1!';
    setValue('email', email);
    setValue('password', password);
    setGenerated({ email, password });
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await axios.post('/users/create-instructor', data);
      toast.success('Instructor created successfully!');
      navigate('/users');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create instructor';
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
          <h2 className="text-3xl font-bold text-indigo-800 drop-shadow-sm mb-2 text-center">Add New Instructor</h2>
          <p className="mb-6 text-base text-indigo-600 text-center">Generate credentials and fill in instructor details below.</p>
          {isSubmitting ? (
            <div className="space-y-4 w-full">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-1/2 mx-auto" />
            </div>
          ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-indigo-700 mb-1">First Name *</label>
                <input
                  {...register('firstName', { required: 'First name is required' })}
                  type="text"
                  className={`w-full px-4 py-2 border rounded-lg bg-white text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition ${errors.firstName ? 'border-red-500' : 'border-indigo-200'}`}
                  placeholder="First name"
                />
                {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-indigo-700 mb-1">Last Name *</label>
                <input
                  {...register('lastName', { required: 'Last name is required' })}
                  type="text"
                  className={`w-full px-4 py-2 border rounded-lg bg-white text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition ${errors.lastName ? 'border-red-500' : 'border-indigo-200'}`}
                  placeholder="Last name"
                />
                {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-indigo-700 mb-1">Department *</label>
                <input
                  {...register('department', { required: 'Department is required' })}
                  className={`input input-bordered w-full focus:border-blue-400 focus:ring-2 focus:ring-blue-200 ${errors.department ? 'border-red-500' : ''}`}
                  placeholder="Department"
                />
                {errors.department && <p className="mt-1 text-xs text-red-600">{errors.department.message}</p>}
              </div>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-indigo-700 mb-1">Email *</label>
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    type="email"
                    className={`w-full px-4 py-2 border rounded-lg bg-white text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition ${errors.email ? 'border-red-500' : 'border-indigo-200'}`}
                    placeholder="Email address"
                    readOnly
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
                </div>
                <button type="button" onClick={generateCredentials} className="px-3 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow transition">Generate</button>
              </div>
              <div>
                <label className="block text-xs font-semibold text-indigo-700 mb-1">Password *</label>
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  type="text"
                  className={`w-full px-4 py-2 border rounded-lg bg-white text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition ${errors.password ? 'border-red-500' : 'border-indigo-200'}`}
                  placeholder="Password"
                  readOnly
                />
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
              </div>
            </div>
            {generated && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-xs text-indigo-800">
                <div><span className="font-semibold">Generated Email:</span> {generated.email}</div>
                <div><span className="font-semibold">Generated Password:</span> {generated.password}</div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => navigate('/users')} className="px-4 py-2 rounded-lg font-semibold bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 shadow transition">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition">
                {isSubmitting ? <LoadingSpinner size="sm" /> : 'Create Instructor'}
              </button>
            </div>
          </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateInstructor;

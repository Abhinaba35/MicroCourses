import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Skeleton from '../../components/common/Skeleton';
import Navbar from '../../components/layout/Navbar';

const Register = () => {
  const { register: registerUser, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: 'student',
    },
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const { confirmPassword, ...userData } = data;
      await registerUser(userData);
    } catch (error) {
      // Error is handled in the context
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-100 to-indigo-200">
          <div className="max-w-md w-full space-y-8 bg-gradient-to-br from-blue-100 via-white to-indigo-100 border border-indigo-200 rounded-2xl shadow-2xl p-8">
            <Skeleton className="h-8 w-2/3 mx-auto mb-4" />
            <Skeleton className="h-4 w-1/2 mx-auto mb-6" />
            <div className="space-y-5">
              <Skeleton className="h-12 w-full mb-2" />
              <Skeleton className="h-12 w-full mb-2" />
              <Skeleton className="h-12 w-full mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-100 to-indigo-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-gradient-to-br from-blue-100 via-white to-indigo-100 border border-indigo-200 rounded-2xl shadow-2xl p-8">
          <div>
            <h2 className="mt-2 text-center text-2xl font-bold text-indigo-800 drop-shadow-sm">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-indigo-600">
              Or{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-indigo-500"
              >
                sign in to your existing account
              </Link>
            </p>
          </div>
          
          <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="firstName" className="block text-xs font-semibold text-indigo-700 mb-1">
                    First Name
                  </label>
                  <input
                    {...register('firstName', { required: 'First name is required' })}
                    type="text"
                    className={`w-full px-4 py-2 border rounded-lg bg-white text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition ${errors.firstName ? 'border-red-500' : 'border-indigo-200'}`}
                    placeholder="First name"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-xs font-semibold text-indigo-700 mb-1">
                    Last Name
                  </label>
                  <input
                    {...register('lastName', { required: 'Last name is required' })}
                    type="text"
                    className={`w-full px-4 py-2 border rounded-lg bg-white text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition ${errors.lastName ? 'border-red-500' : 'border-indigo-200'}`}
                    placeholder="Last name"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-indigo-700 mb-1">
                  Email address
                </label>
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
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="role" className="block text-xs font-semibold text-indigo-700 mb-1">
                  Role
                </label>
                <select
                  {...register('role', { required: 'Role is required' })}
                  className="w-full px-4 py-2 border rounded-lg bg-white text-indigo-900 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition border-indigo-200"
                  disabled
                >
                  <option value="student">Student</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-xs text-red-600">{errors.role.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="studentId" className="block text-xs font-semibold text-indigo-700 mb-1">
                  Student ID (Optional)
                </label>
                <input
                  {...register('studentId')}
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg bg-white text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition border-indigo-200"
                  placeholder="Enter student ID"
                />
              </div>
              <div>
                <label htmlFor="department" className="block text-xs font-semibold text-indigo-700 mb-1">
                  Department (Optional)
                </label>
                <input
                  {...register('department')}
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg bg-white text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition border-indigo-200"
                  placeholder="Enter department"
                />
              </div>
              <div>
                <label htmlFor="year" className="block text-xs font-semibold text-indigo-700 mb-1">
                  Year (Optional)
                </label>
                <select
                  {...register('year')}
                  className="w-full px-4 py-2 border rounded-lg bg-white text-indigo-900 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition border-indigo-200"
                >
                  <option value="">Select year</option>
                  <option value="1st">1st Year</option>
                  <option value="2nd">2nd Year</option>
                  <option value="3rd">3rd Year</option>
                  <option value="4th">4th Year</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </div>
              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-indigo-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className={`input input-bordered w-full pr-10 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-blue-500" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-blue-500" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-semibold text-indigo-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) =>
                        value === password || 'Passwords do not match',
                    })}
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className={`input input-bordered w-full pr-10 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-blue-500" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-blue-500" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition"
              >
                {isSubmitting ? (
                  <Skeleton className="h-6 w-28" />
                ) : (
                  'Create account'
                )}
              </button>
            </div>
            <div className="text-center">
              <p className="text-xs text-indigo-700">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-indigo-500"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;

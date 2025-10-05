import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Skeleton from '../../components/common/Skeleton';
import Navbar from '../../components/layout/Navbar';

const Login = () => {
  const { login, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await login(data.email, data.password);
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
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-indigo-600">
              Or{' '}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-indigo-500"
              >
                create a new account
              </Link>
            </p>
          </div>
          
          <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-3">
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
                  autoComplete="email"
                  className={`w-full px-4 py-2 border rounded-lg bg-white text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition ${errors.email ? 'border-red-500' : 'border-indigo-200'}`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                )}
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
                    autoComplete="current-password"
                    className={`w-full px-4 py-2 border rounded-lg bg-white text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 pr-10 transition ${errors.password ? 'border-red-500' : 'border-indigo-200'}`}
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
            </div>
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition"
              >
                {isSubmitting ? (
                  <Skeleton className="h-6 w-24" />
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
            <div className="text-center">
              <p className="text-xs text-indigo-700">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:text-indigo-500"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;

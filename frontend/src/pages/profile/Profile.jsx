import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { UserCircleIcon } from '@heroicons/react/24/outline';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      department: user?.department || '',
      year: user?.year || '',
    },
  });

  // Update form when user data changes
  React.useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        department: user.department || '',
        year: user.year || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await updateProfile(data);
    } catch (error) {
      // Error is handled in the context
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return <LoadingSpinner className="min-h-96" />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
        <p className="mt-1 text-sm text-gray-600">
          Manage your account information and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="label">
                      First Name *
                    </label>
                    <input
                      {...register('firstName', {
                        required: 'First name is required',
                        minLength: {
                          value: 1,
                          message: 'First name is required',
                        },
                      })}
                      type="text"
                      className={errors.firstName ? 'input-error' : 'input'}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="label">
                      Last Name *
                    </label>
                    <input
                      {...register('lastName', {
                        required: 'Last name is required',
                        minLength: {
                          value: 1,
                          message: 'Last name is required',
                        },
                      })}
                      type="text"
                      className={errors.lastName ? 'input-error' : 'input'}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="department" className="label">
                    Department
                  </label>
                  <input
                    {...register('department')}
                    type="text"
                    className="input"
                    placeholder="Enter your department"
                  />
                </div>

                <div>
                  <label htmlFor="year" className="label">
                    Year
                  </label>
                  <select
                    {...register('year')}
                    className="input"
                  >
                    <option value="">Select year</option>
                    <option value="1st">1st Year</option>
                    <option value="2nd">2nd Year</option>
                    <option value="3rd">3rd Year</option>
                    <option value="4th">4th Year</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>

                <div className="flex justify-end">
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
                      'Update Profile'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="card">
            <div className="card-body text-center">
              <div className="flex justify-center mb-4">
                <UserCircleIcon className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-sm text-gray-500 capitalize">{user.role}</p>
              {user.studentId && (
                <p className="text-sm text-gray-500 mt-1">ID: {user.studentId}</p>
              )}
            </div>
          </div>

          {/* Account Information */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
            </div>
            <div className="card-body space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              
              {user.department && (
                <div>
                  <p className="text-sm font-medium text-gray-900">Department</p>
                  <p className="text-sm text-gray-500">{user.department}</p>
                </div>
              )}
              
              {user.year && (
                <div>
                  <p className="text-sm font-medium text-gray-900">Year</p>
                  <p className="text-sm text-gray-500">{user.year}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm font-medium text-gray-900">Role</p>
                <p className="text-sm text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          {user.enrolledCourses && user.enrolledCourses.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">Quick Stats</h3>
              </div>
              <div className="card-body">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-600">
                    {user.enrolledCourses.length}
                  </p>
                  <p className="text-sm text-gray-500">Enrolled Courses</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

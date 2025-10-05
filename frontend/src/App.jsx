import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/courses/Courses';
import CourseDetail from './pages/courses/CourseDetail';
import CreateCourse from './pages/courses/CreateCourse';
import EditCourse from './pages/courses/EditCourse';
import MyCourses from './pages/courses/MyCourses';
import Enrollments from './pages/enrollments/Enrollments';
import Profile from './pages/profile/Profile';
import Users from './pages/users/Users';
import UserDetail from './pages/users/UserDetail';
import Landing from './pages/Landing';

// Lazy load CreateInstructor
const CreateInstructor = lazy(() => import('./pages/users/CreateInstructor'));

// Protected Route Component
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Main Layout Component
const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
      {/* Footer removed */}
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
          <Route 
            path="/" 
            element={
              <PublicRoute>
                <Landing />
              </PublicRoute>
            } 
          />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            } 
          />

          {/* Courses Routes */}
          <Route 
            path="/courses" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Courses />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/courses/:id" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <CourseDetail />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/courses/create" 
            element={
              <ProtectedRoute roles={['instructor', 'admin']}>
                <MainLayout>
                  <CreateCourse />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/courses/:id/edit" 
            element={
              <ProtectedRoute roles={['instructor', 'admin']}>
                <MainLayout>
                  <EditCourse />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-courses" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <MyCourses />
                </MainLayout>
              </ProtectedRoute>
            } 
          />

          {/* Enrollments Routes */}
          <Route 
            path="/enrollments" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Enrollments />
                </MainLayout>
              </ProtectedRoute>
            } 
          />

          {/* Profile Route */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Profile />
                </MainLayout>
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/users" 
            element={
              <ProtectedRoute roles={['admin']}>
                <MainLayout>
                  <Users />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users/:id" 
            element={
              <ProtectedRoute roles={['admin']}>
                <MainLayout>
                  <UserDetail />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users/create-instructor" 
            element={
              <ProtectedRoute roles={['admin']}>
                <MainLayout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <CreateInstructor />
                  </Suspense>
                </MainLayout>
              </ProtectedRoute>
            } 
          />

          {/* 404 Route */}
          <Route 
            path="*" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <div className="text-center py-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-gray-600 mb-8">Page not found</p>
                    <a href="/dashboard" className="btn-primary">
                      Go to Dashboard
                    </a>
                  </div>
                </MainLayout>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

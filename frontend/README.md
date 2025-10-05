# Minor Courses Frontend

A modern React frontend for the Minor Courses Management System built with Vite, React, and Tailwind CSS.

## Features

- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Authentication**: JWT-based authentication with role-based access control
- **Course Management**: Browse, create, edit, and manage courses
- **Enrollment System**: Enroll in courses, track progress, and manage enrollments
- **User Management**: Admin panel for managing users and their roles
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Real-time Updates**: Toast notifications for user feedback

## Tech Stack

- **Vite** - Build tool and dev server
- **React 18** - UI library
- **JavaScript** - Programming language
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Heroicons** - Icons

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── common/         # Common components (LoadingSpinner, etc.)
│   └── layout/         # Layout components (Navbar, Sidebar)
├── contexts/           # React contexts (AuthContext)
├── pages/              # Page components
│   ├── auth/          # Authentication pages
│   ├── courses/       # Course-related pages
│   ├── enrollments/   # Enrollment pages
│   ├── profile/       # User profile pages
│   └── users/         # User management pages
├── App.jsx            # Main app component
└── main.jsx           # Entry point
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on port 5000

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The app will open at [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Overview

### Authentication
- User registration and login
- JWT token management
- Role-based access control (Student, Instructor, Admin)
- Protected routes

### Course Management
- Browse all available courses
- Filter courses by department, semester, status
- View detailed course information
- Create new courses (Instructors/Admins)
- Edit existing courses (Instructors/Admins)
- Course enrollment and dropping

### User Dashboard
- Personalized dashboard based on user role
- Quick stats and recent activity
- Course enrollment overview
- User profile management

### Admin Features
- User management and statistics
- System-wide course oversight
- User role management
- Comprehensive reporting

## Component Architecture

### Layout Components
- **Navbar**: Top navigation with user menu
- **Sidebar**: Side navigation with role-based menu items
- **MainLayout**: Wrapper component for authenticated pages

### Page Components
- **Dashboard**: Role-specific dashboard with stats
- **Courses**: Course listing with filters and search
- **CourseDetail**: Detailed course view with enrollment
- **CreateCourse/EditCourse**: Course management forms
- **MyCourses**: User's enrolled courses
- **Enrollments**: Enrollment management
- **Profile**: User profile management
- **Users**: User management (Admin only)

### Common Components
- **LoadingSpinner**: Reusable loading indicator
- **ProtectedRoute**: Route protection wrapper
- **PublicRoute**: Public route wrapper

## Styling

The application uses Tailwind CSS for styling with a custom design system:

### Color Palette
- **Primary**: Blue tones for main actions
- **Secondary**: Gray tones for neutral elements
- **Success**: Green for positive actions
- **Warning**: Yellow for caution
- **Danger**: Red for destructive actions

### Component Classes
- **Buttons**: `.btn`, `.btn-primary`, `.btn-secondary`, etc.
- **Forms**: `.input`, `.label`, `.input-error`
- **Cards**: `.card`, `.card-header`, `.card-body`
- **Badges**: `.badge`, `.badge-success`, `.badge-warning`, etc.

## State Management

- **AuthContext**: Manages authentication state and user data
- **Local State**: Component-level state with React hooks
- **Form State**: React Hook Form for form management

## API Integration

The frontend communicates with the backend API through:

- **Axios**: HTTP client with interceptors
- **JWT Tokens**: Automatic token attachment to requests
- **Error Handling**: Centralized error handling with toast notifications
- **Loading States**: Loading indicators for async operations

## Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Breakpoints**: Tailwind's responsive breakpoints
- **Flexible Layouts**: Grid and flexbox layouts
- **Touch-friendly**: Appropriate touch targets

## Accessibility

- **Semantic HTML**: Proper HTML structure
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG compliant color combinations

## Performance

- **Vite**: Fast build tool and HMR
- **Code Splitting**: Route-based code splitting
- **Optimized Images**: Optimized image loading
- **Bundle Analysis**: Vite bundle analyzer

## Development

### Code Style
- **ESLint**: Code linting
- **Prettier**: Code formatting (recommended)
- **Conventional Commits**: Commit message format

### Environment Variables
- `VITE_API_URL`: Backend API URL (default: http://localhost:5000/api)

## Deployment

### Build Process
```bash
npm run build
```

### Deployment Options
- **Netlify**: Static site hosting
- **Vercel**: React-optimized hosting
- **AWS S3**: Static website hosting
- **Docker**: Containerized deployment

## Contributing

1. Follow the existing code style
2. Use JavaScript for consistency
3. Write meaningful commit messages
4. Test your changes thoroughly
5. Update documentation as needed

## Troubleshooting

### Common Issues

1. **API Connection Issues**
   - Check if backend is running on port 5000
   - Verify CORS settings in backend
   - Check network tab in browser dev tools

2. **Authentication Issues**
   - Clear localStorage and try logging in again
   - Check JWT token expiration
   - Verify user role permissions

3. **Build Issues**
   - Clear node_modules and reinstall
   - Check for JavaScript errors
   - Verify all dependencies are installed

## License

This project is licensed under the MIT License.
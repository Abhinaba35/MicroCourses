# Minor Courses Management System

A comprehensive web application for managing minor courses, student enrollments, and course administration.

## Project Structure

```
minorcourses/
├── backend/          # Node.js/Express backend
├── frontend/         # React frontend
└── README.md         # This file
```

## Features

- Course Management (CRUD operations)
- Student Enrollment System
- User Authentication & Authorization
- Admin Dashboard
- Student Dashboard
- Responsive Modern UI

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB/Mongoose
- JWT Authentication
- bcrypt for password hashing

### Frontend
- React
- TypeScript
- Tailwind CSS
- React Router
- Axios for API calls

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

4. Set up environment variables (see respective README files in backend and frontend folders)

5. Start the development servers:
   ```bash
   # Backend (from backend folder)
   npm run dev
   
   # Frontend (from frontend folder)
   npm start
   ```

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create new course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course
- `POST /api/enrollments` - Enroll in course
- `GET /api/enrollments/:userId` - Get user enrollments

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

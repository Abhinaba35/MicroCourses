# Minor Courses Backend API

A RESTful API for managing minor courses, student enrollments, and user authentication.

## Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Student, Instructor, Admin)
  - Password hashing with bcrypt

- **Course Management**
  - CRUD operations for courses
  - Course scheduling and prerequisites
  - Instructor assignment
  - Enrollment capacity management

- **Enrollment System**
  - Student course enrollment
  - Grade management
  - Attendance tracking
  - Course dropping functionality

- **User Management**
  - User registration and profile management
  - Student, instructor, and admin roles
  - Department and year tracking

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Courses
- `GET /api/courses` - Get all courses (with filtering)
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create new course (Instructor/Admin)
- `PUT /api/courses/:id` - Update course (Instructor/Admin)
- `DELETE /api/courses/:id` - Delete course (Admin)
- `GET /api/courses/instructor/:instructorId` - Get courses by instructor

### Enrollments
- `POST /api/enrollments` - Enroll in course
- `DELETE /api/enrollments/:enrollmentId` - Drop course
- `GET /api/enrollments/student/:studentId` - Get student enrollments
- `GET /api/enrollments/course/:courseId` - Get course enrollments
- `PUT /api/enrollments/:enrollmentId/grade` - Update grade (Instructor/Admin)
- `PUT /api/enrollments/:enrollmentId/attendance` - Update attendance (Instructor/Admin)

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)
- `GET /api/users/students/enrolled/:courseId` - Get enrolled students
- `GET /api/users/instructors` - Get all instructors
- `GET /api/users/stats` - Get user statistics (Admin)

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/microcourse
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

3. **Start MongoDB:**
   Make sure MongoDB is running on your system.

4. **Run the server:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## Database Models

### User
- Personal information (name, email, password)
- Role (student, instructor, admin)
- Academic information (studentId, department, year)
- Enrolled courses

### Course
- Course details (title, code, description, credits)
- Instructor assignment
- Schedule and prerequisites
- Enrollment capacity and status

### Enrollment
- Student-course relationship
- Enrollment status and grades
- Attendance tracking
- Enrollment date

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Error Handling

The API returns consistent error responses:

```json
{
  "message": "Error description",
  "errors": [] // Validation errors (if any)
}
```

## Validation

Input validation is handled using express-validator with comprehensive rules for:
- Email format validation
- Password strength requirements
- Course code format validation
- Date and time format validation
- Role and enum value validation

## Security Features

- Password hashing with bcrypt
- JWT token expiration
- CORS configuration
- Helmet for security headers
- Input sanitization and validation
- Role-based access control

## Development

- **Nodemon** for auto-restart during development
- **Morgan** for HTTP request logging
- **Jest** for testing (setup ready)

## Testing

```bash
npm test
```

## Contributing

1. Follow the existing code style
2. Add proper error handling
3. Include input validation
4. Write tests for new features
5. Update documentation

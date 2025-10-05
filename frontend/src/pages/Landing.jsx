import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 via-indigo-400 to-indigo-900 animate-gradient-x overflow-x-hidden">
      <div className="w-full flex flex-col items-center py-10 px-2">
        {/* SVG Illustration */}
        <div className="w-full flex justify-center mb-8">
          <svg
            width="320"
            height="180"
            viewBox="0 0 320 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="max-w-xs md:max-w-md w-full h-auto"
          >
            <ellipse cx="160" cy="150" rx="120" ry="20" fill="#e0e7ff" />
            <rect
              x="60"
              y="40"
              width="200"
              height="80"
              rx="16"
              fill="#6366f1"
            />
            <rect
              x="80"
              y="60"
              width="160"
              height="40"
              rx="8"
              fill="#a5b4fc"
            />
            <rect
              x="110"
              y="70"
              width="100"
              height="10"
              rx="5"
              fill="#fff"
            />
            <rect
              x="110"
              y="85"
              width="60"
              height="8"
              rx="4"
              fill="#c7d2fe"
            />
            <circle cx="90" cy="100" r="8" fill="#fff" />
            <circle cx="230" cy="100" r="8" fill="#fff" />
            <rect
              x="150"
              y="110"
              width="20"
              height="8"
              rx="4"
              fill="#818cf8"
            />
            <text
              x="160"
              y="55"
              textAnchor="middle"
              fontSize="18"
              fill="#fff"
              fontWeight="bold"
            >
              Learn
            </text>
          </svg>
        </div>

        <div className="w-full max-w-6xl mx-auto rounded-3xl bg-white/60 backdrop-blur-md shadow-2xl border border-indigo-200 p-8 md:p-16 flex flex-col items-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-indigo-900 mb-4 drop-shadow-lg text-center tracking-tight">
            Welcome to MinorCourses{" "}
            <span className="align-middle">🎓</span>
          </h1>
          <p className="text-indigo-800 mb-4 text-center text-xl md:text-2xl font-medium max-w-3xl">
            Your one-stop destination for smarter learning, effortless management,
            and academic excellence.
          </p>
          <p className="text-indigo-700 text-center text-lg mb-10 italic max-w-2xl">
            “Empowering learners and educators with the tools they need to thrive
            in the digital age.”
          </p>

          {/* Features */}
          <ul className="mb-10 w-full max-w-4xl mx-auto text-indigo-800/90 text-lg md:text-xl space-y-4 list-disc list-inside px-4">
            <li>
              <span className="font-semibold text-indigo-900">📚 Easy Enrollment:</span> Register and join courses in just a few clicks.
            </li>
            <li>
              <span className="font-semibold text-indigo-900">📈 Modern Dashboard:</span> Monitor your progress, deadlines, and grades effortlessly.
            </li>
            <li>
              <span className="font-semibold text-indigo-900">🔒 Secure & Reliable:</span> Your data, certificates, and credentials are protected with advanced encryption.
            </li>
            <li>
              <span className="font-semibold text-indigo-900">👩‍🏫 Dual Access:</span> Separate portals for Students and Instructors to manage their roles efficiently.
            </li>
            <li>
              <span className="font-semibold text-indigo-900">🏅 Certification:</span> Complete your courses and earn verifiable certificates to showcase your learning achievements.
            </li>
          </ul>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row gap-6 w-full max-w-lg mx-auto mb-12 px-4">
            <Link
              to="/register"
              className="flex-1 py-4 rounded-full font-extrabold text-lg bg-gradient-to-r from-blue-700 via-indigo-600 to-indigo-800 hover:from-indigo-800 hover:to-blue-700 shadow-2xl transition text-center text-white border-0 focus:outline-none focus:ring-4 focus:ring-indigo-300/40 flex items-center justify-center gap-2 transform hover:scale-105"
            >
              <span className="text-2xl">🚀</span>
              <span>Register Now</span>
            </Link>
            <Link
              to="/login"
              className="flex-1 py-4 rounded-full font-extrabold text-lg bg-white/90 text-indigo-800 border-2 border-indigo-300 hover:bg-indigo-50 hover:text-indigo-900 shadow-2xl transition text-center focus:outline-none focus:ring-4 focus:ring-indigo-300/40 flex items-center justify-center gap-2 transform hover:scale-105"
            >
              <span className="text-2xl">🔑</span>
              <span>Login</span>
            </Link>
          </div>

          {/* Why Choose Us Section */}
          <div className="w-full max-w-5xl mx-auto px-4 mt-10">
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4 text-center">
              Why Choose MinorCourses?
            </h2>
            <p className="text-indigo-800 text-center mb-8 max-w-3xl mx-auto text-lg">
              We believe education should be accessible, engaging, and rewarding. Our platform bridges the gap between teachers and students with a streamlined experience that keeps learning exciting and measurable.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div className="p-8 bg-white/80 rounded-2xl shadow-md hover:shadow-xl transition border border-indigo-100">
                <h3 className="font-semibold text-indigo-900 text-xl mb-2">⏱ Fast Access</h3>
                <p className="text-base text-indigo-700">
                  Start learning instantly with minimal setup and easy navigation.
                </p>
              </div>
              <div className="p-8 bg-white/80 rounded-2xl shadow-md hover:shadow-xl transition border border-indigo-100">
                <h3 className="font-semibold text-indigo-900 text-xl mb-2">🧠 Smart Learning</h3>
                <p className="text-base text-indigo-700">
                  AI-powered recommendations help you stay on track with your goals.
                </p>
              </div>
              <div className="p-8 bg-white/80 rounded-2xl shadow-md hover:shadow-xl transition border border-indigo-100">
                <h3 className="font-semibold text-indigo-900 text-xl mb-2">🎖 Verified Growth</h3>
                <p className="text-base text-indigo-700">
                  Earn certificates that validate your skills and boost your career.
                </p>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="w-full max-w-4xl mx-auto text-center mt-20 px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-indigo-700 text-base mb-8">
              Hear from students and instructors who’ve transformed their learning experience with us.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="bg-white/90 p-8 rounded-2xl shadow-md hover:shadow-xl transition border border-indigo-100">
                <p className="italic text-indigo-800 mb-3 text-lg">
                  “MinorCourses helped me manage multiple courses with ease and track my learning progress like never before!”
                </p>
                <p className="text-base font-semibold text-indigo-900">
                  — Aditi Sharma, B.Tech Student
                </p>
              </div>
              <div className="bg-white/90 p-8 rounded-2xl shadow-md hover:shadow-xl transition border border-indigo-100">
                <p className="italic text-indigo-800 mb-3 text-lg">
                  “As an instructor, I love how easily I can upload content, monitor student progress, and issue verified certificates.”
                </p>
                <p className="text-base font-semibold text-indigo-900">
                  — Prof. Rohan Mehta, Instructor
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-20 text-xs text-indigo-400 text-center w-full">
            <span>
              © {new Date().getFullYear()} MinorCourses — Empowering Education, One Course at a Time.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;

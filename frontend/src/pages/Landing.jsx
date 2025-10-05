import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

const Landing = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 via-indigo-100 to-white animate-gradient-x overflow-x-hidden relative">
        {/* Animated SVG background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1440 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-64 md:h-96 opacity-40 animate-pulse"
          >
            <path
              fill="#6366f1"
              fillOpacity="0.13"
              d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            />
          </svg>
        </div>
        <div className="relative z-10 w-full flex flex-col items-center py-16 px-2">
          {/* Hero Section */}
          <div className="w-full flex flex-col items-center mb-12 animate-fade-in-up">
            <div className="mb-8">
              <svg
                width="340"
                height="180"
                viewBox="0 0 340 180"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="max-w-xs md:max-w-md w-full h-auto drop-shadow-xl"
              >
                <ellipse cx="170" cy="150" rx="130" ry="22" fill="#e0e7ff" />
                <rect
                  x="70"
                  y="40"
                  width="200"
                  height="80"
                  rx="20"
                  fill="#93c5fd"
                />
                <rect
                  x="90"
                  y="60"
                  width="160"
                  height="40"
                  rx="10"
                  fill="#dbeafe"
                />
                <rect
                  x="120"
                  y="70"
                  width="100"
                  height="12"
                  rx="6"
                  fill="#fff"
                />
                <rect
                  x="120"
                  y="88"
                  width="60"
                  height="10"
                  rx="5"
                  fill="#c7d2fe"
                />
                <circle cx="100" cy="110" r="10" fill="#fff" />
                <circle cx="240" cy="110" r="10" fill="#fff" />
                <rect
                  x="160"
                  y="120"
                  width="20"
                  height="10"
                  rx="5"
                  fill="#a5b4fc"
                />
                <text
                  x="170"
                  y="60"
                  textAnchor="middle"
                  fontSize="22"
                  fill="#2563eb"
                  fontWeight="bold"
                >
                  Learn
                </text>
              </svg>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-indigo-900 mb-6 drop-shadow-lg text-center tracking-tight animate-fade-in-up">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                MicroCourse
              </span>{" "}
              <span className="align-middle">🎓</span>
            </h1>
            <p className="text-indigo-800 mb-6 text-center text-2xl md:text-3xl font-medium max-w-3xl animate-fade-in-up">
              Your one-stop destination for smarter learning, effortless
              management, and academic excellence.
            </p>
            <p className="text-indigo-700 text-center text-lg mb-10 italic max-w-2xl animate-fade-in-up">
              “Empowering learners and educators with the tools they need to
              thrive in the digital age.”
            </p>
            {/* CTA Buttons */}
            <div className="flex flex-col md:flex-row gap-6 w-full max-w-lg mx-auto mb-4 px-4 animate-fade-in-up">
              <Link
                to="/register"
                className="flex-1 py-4 rounded-full font-extrabold text-xl bg-gradient-to-r from-blue-400 via-indigo-400 to-indigo-600 hover:from-indigo-500 hover:to-blue-400 shadow-2xl transition text-center text-white border-0 focus:outline-none focus:ring-4 focus:ring-indigo-300/40 flex items-center justify-center gap-2 transform hover:scale-105"
              >
                <span className="text-2xl">🚀</span>
                <span>Register Now</span>
              </Link>
              <Link
                to="/login"
                className="flex-1 py-4 rounded-full font-extrabold text-xl bg-white/90 text-indigo-800 border-2 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-900 shadow-2xl transition text-center focus:outline-none focus:ring-4 focus:ring-indigo-300/40 flex items-center justify-center gap-2 transform hover:scale-105"
              >
                <span className="text-2xl">🔑</span>
                <span>Login</span>
              </Link>
            </div>
          </div>

          {/* Glassmorphism Card Section */}
          <div className="w-full max-w-6xl mx-auto rounded-3xl bg-white/80 backdrop-blur-2xl shadow-2xl border border-indigo-100 p-8 md:p-16 flex flex-col items-center animate-fade-in-up">
            {/* Features */}
            <ul className="mb-10 w-full max-w-4xl mx-auto text-indigo-800/90 text-lg md:text-xl space-y-4 list-disc list-inside px-4">
              <li>
                <span className="font-semibold text-indigo-900">
                  📚 Easy Enrollment:
                </span>{" "}
                Register and join courses in just a few clicks.
              </li>
              <li>
                <span className="font-semibold text-indigo-900">
                  📈 Modern Dashboard:
                </span>{" "}
                Monitor your progress, deadlines, and grades effortlessly.
              </li>
              <li>
                <span className="font-semibold text-indigo-900">
                  🔒 Secure & Reliable:
                </span>{" "}
                Your data, certificates, and credentials are protected with
                advanced encryption.
              </li>
              <li>
                <span className="font-semibold text-indigo-900">
                  👩‍🏫 Dual Access:
                </span>{" "}
                Separate portals for Students and Instructors to manage their
                roles efficiently.
              </li>
              <li>
                <span className="font-semibold text-indigo-900">
                  🏅 Certification:
                </span>{" "}
                Complete your courses and earn verifiable certificates to showcase
                your learning achievements.
              </li>
            </ul>

            {/* Why Choose Us Section */}
            <div className="w-full max-w-5xl mx-auto px-4 mt-10">
              <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4 text-center animate-fade-in-up">
                Why Choose MicroCourse?
              </h2>
              <p className="text-indigo-800 text-center mb-8 max-w-3xl mx-auto text-lg animate-fade-in-up">
                We believe education should be accessible, engaging, and rewarding.
                Our platform bridges the gap between teachers and students with a
                streamlined experience that keeps learning exciting and measurable.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center animate-fade-in-up">
                <div className="p-8 bg-white/80 rounded-2xl shadow-md hover:shadow-xl transition border border-indigo-50">
                  <h3 className="font-semibold text-indigo-900 text-xl mb-2">
                    ⏱ Fast Access
                  </h3>
                  <p className="text-base text-indigo-700">
                    Start learning instantly with minimal setup and easy navigation.
                  </p>
                </div>
                <div className="p-8 bg-white/80 rounded-2xl shadow-md hover:shadow-xl transition border border-indigo-50">
                  <h3 className="font-semibold text-indigo-900 text-xl mb-2">
                    🧠 Smart Learning
                  </h3>
                  <p className="text-base text-indigo-700">
                    AI-powered recommendations help you stay on track with your
                    goals.
                  </p>
                </div>
                <div className="p-8 bg-white/80 rounded-2xl shadow-md hover:shadow-xl transition border border-indigo-50">
                  <h3 className="font-semibold text-indigo-900 text-xl mb-2">
                    🎖 Verified Growth
                  </h3>
                  <p className="text-base text-indigo-700">
                    Earn certificates that validate your skills and boost your
                    career.
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="w-full max-w-4xl mx-auto text-center mt-20 px-4 animate-fade-in-up">
              <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">
                What Our Users Say
              </h2>
              <p className="text-indigo-700 text-base mb-8">
                Hear from students and instructors who’ve transformed their
                learning experience with us.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="bg-white/90 p-8 rounded-2xl shadow-md hover:shadow-xl transition border border-indigo-50">
                  <p className="italic text-indigo-800 mb-3 text-lg">
                    “MicroCourse helped me manage multiple courses with ease and
                    track my learning progress like never before!”
                  </p>
                  <p className="text-base font-semibold text-indigo-900">
                    — Aditi Sharma, B.Tech Student
                  </p>
                </div>
                <div className="bg-white/90 p-8 rounded-2xl shadow-md hover:shadow-xl transition border border-indigo-50">
                  <p className="italic text-indigo-800 mb-3 text-lg">
                    “As an instructor, I love how easily I can upload content,
                    monitor student progress, and issue verified certificates.”
                  </p>
                  <p className="text-base font-semibold text-indigo-900">
                    — Prof. Rohan Mehta, Instructor
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-20 text-xs text-indigo-400 text-center w-full animate-fade-in-up">
              <span>
                © {new Date().getFullYear()} MicroCourse — Empowering Education,
                One Course at a Time.
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing;

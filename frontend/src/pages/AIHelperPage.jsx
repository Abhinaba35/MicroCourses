import React from 'react';
import AIHelper from '../components/common/AIHelper';

const AIHelperPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-100 to-white py-10 px-2">
      <div className="w-full max-w-2xl mx-auto bg-white/90 rounded-3xl shadow-2xl border border-indigo-100 p-8 flex flex-col items-center animate-fade-in-up">
        <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-900 mb-6 drop-shadow text-center tracking-tight">
          <span className="inline-block align-middle mr-2">🤖</span>AI Helper
        </h1>
        <p className="text-indigo-700 text-center mb-6 max-w-xl">
          Ask anything about MicroCourse, your courses, or get learning tips powered by Gemini AI.
        </p>
        <div className="w-full">
          <AIHelper />
        </div>
      </div>
    </div>
  );
};

export default AIHelperPage;

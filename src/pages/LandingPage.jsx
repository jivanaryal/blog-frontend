import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 via-white to-cyan-50 text-gray-800">
      <div className="text-center p-10 max-w-3xl">
        {/* Optional: Add a logo here */} 
        {/* <img src="/path/to/your/logo.svg" alt="BlogApp Logo" className="h-16 mx-auto mb-6" /> */}
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-teal-700">
          Welcome to Your BlogSpace
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 px-4">
          Share your thoughts, stories, and ideas with the world. Easy to use, beautifully designed.
        </p>
        <div className="space-x-4">
          <Link
            to="/login"
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-white text-teal-600 border border-teal-600 hover:bg-teal-50 font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
          >
            Sign Up
          </Link>
        </div>
      </div>
      {/* Optional: Add some illustrative graphics or feature highlights below */}
      {/* <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 px-10 max-w-5xl">
        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-teal-700 mb-2">Easy Publishing</h3>
          <p className="text-gray-600">Create and manage your blog posts effortlessly.</p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-teal-700 mb-2">Modern Design</h3>
          <p className="text-gray-600">Engage readers with a clean, responsive layout.</p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-teal-700 mb-2">Your Space</h3>
          <p className="text-gray-600">Own your content and build your audience.</p>
        </div>
      </div> */} 
    </div>
  );
};

export default LandingPage;

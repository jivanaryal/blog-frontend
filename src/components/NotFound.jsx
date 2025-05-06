// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-xl mb-4">Page Not Found</p>
      <Link to="/" className="text-blue-600 hover:underline text-lg">
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;

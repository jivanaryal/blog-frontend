import React from "react";
import { Link } from "react-router-dom";
import bgImage from "../assets/images/bg.jpg";
import TypeWriter from "typewriter-effect";

const LandingPage = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* ✅ Background image with blur */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center z-0"
        style={{
          backgroundImage: `url(${bgImage})`,
          filter: "blur(4px)",
          opacity: "0.6",
        }}
      ></div>

      {/* ✅ Foreground content (not blurred) */}
      <div className="relative z-50 text-shadow-2xs text-black text-shadow-amber-300  text-center max-w-3xl px-4">
        <div className="text-5xl  md:text-6xl font-bold mb-4">
          Welcome to Your BlogSpace
        </div>
        <p className="text-xl md:text-2xl font-medium  mb-8">
          <TypeWriter
            options={{
              strings: [
                "Share your thoughts, stories, and ideas with the world. Easy to use, beautifully designed.",
              ],
              autoStart: true,
              loop: true,
            }}
          />
        </p>

        <div className="space-x-4 mt-10">
          <Link
            to="/login"
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-white text-teal-600 border border-teal-600 hover:bg-teal-50 font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  Bars3Icon,
  UserCircleIcon,
  HomeIcon,
  PencilSquareIcon,
  BookOpenIcon,
  MagnifyingGlassIcon,
  PowerIcon, // Added Power Icon for logout
} from "@heroicons/react/24/outline";

const Navbar = ({ onToggleSidebar }) => {
  const { token, user, logout } = useContext(AuthContext); // Include logout from context
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  if (!token) {
    return null;
  }

  const handleLogout = () => {
    logout(); // Clear token and user from context and localStorage
  };

  return (
    <nav className="bg-gradient-to-r from-teal-600 to-teal-500 text-white py-4 px-4 shadow-lg fixed top-0 left-0 right-0 z-20">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Section */}
        <div className="flex items-center space-x-2">
          {/* Hamburger Menu */}
          <button
            onClick={onToggleSidebar}
            className="md:hidden text-white hover:text-teal-200 focus:outline-none transition duration-300 p-1 rounded-lg hover:bg-teal-700"
            aria-label="Toggle sidebar"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-3xl font-bold tracking-tight hover:text-teal-100 transition duration-300">
              Blog<span className="text-yellow-300">Verse</span>
            </span>
          </Link>
        </div>

        {/* Middle Section - Main Navigation */}
        <div className="hidden  md:flex items-center space-x-1">
          <NavItem to="/" icon={<HomeIcon className="h-5 w-5" />} text="Home" />
          <NavItem
            to="/create-blog"
            icon={<PencilSquareIcon className="h-5 w-5" />}
            text="Create"
          />
          <NavItem
            to="/my-blogs"
            icon={<BookOpenIcon className="h-5 w-5" />}
            text="My Blogs"
          />
        </div>

        {/* Right Section - Search & User */}
        <div className="flex items-center space-x-3">
          {/* Mobile Search Toggle */}
          <button
            className="md:hidden text-white hover:text-teal-200"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <MagnifyingGlassIcon className="h-6 w-6" />
          </button>

          {/* Notifications */}

          {/* User Profile */}
          {user && (
            <Link
              to="/profile"
              className="flex items-center bg-teal-700/50 hover:bg-teal-700 px-3 py-1.5 rounded-full transition duration-300"
            >
              <UserCircleIcon className="h-6 w-6 mr-1" />
              <span className="hidden sm:inline text-sm font-medium">
                {user.name || "Profile"}
              </span>
            </Link>
          )}

          {/* Logout Button with Icon */}
          <button
            onClick={handleLogout}
            className="flex cursor-pointer  items-center text-white hover:text-teal-200 px-3 py-1.5 rounded-full transition duration-300"
          >
            <PowerIcon className="h-5 w-5 mr-1" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

// NavItem component with icon and text
const NavItem = ({ to, icon, text }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition duration-300 ${
        isActive ? "bg-teal-700 text-white" : "text-white hover:bg-teal-700/50"
      }`
    }
  >
    <span className="mr-1.5">{icon}</span>
    {text}
  </NavLink>
);

export default Navbar;

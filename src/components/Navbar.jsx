import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Bars3Icon, UserCircleIcon } from '@heroicons/react/24/outline'; // For hamburger and user icon

const Navbar = ({ onToggleSidebar }) => {
  const { token, user } = useContext(AuthContext); // No logout here, sidebar handles it

  // Navbar should only render if there's a token, App.jsx handles this logic mostly
  if (!token) {
    return null; // Or a minimal version for landing/login/register if needed, but current plan is no navbar there
  }

  return (
    <nav className="bg-teal-600 text-white p-4 shadow-md fixed top-0 left-0 right-0 z-20">
      <div className="container mx-auto flex justify-between items-center">
        {/* Hamburger Icon for mobile to toggle sidebar */} 
        <button 
          onClick={onToggleSidebar}
          className="md:hidden text-white hover:text-teal-200 focus:outline-none"
        >
          <Bars3Icon className="h-7 w-7" />
        </button>

        <Link to="/" className="text-2xl font-bold hover:text-teal-100 transition duration-150">
          BlogVerse
        </Link>

        {/* Desktop Navigation Links - kept minimal as sidebar is primary for more links */} 
        <div className="hidden md:flex space-x-6 items-center">
          <NavLinkItem to="/">Home</NavLinkItem>
          <NavLinkItem to="/create-blog">Create Blog</NavLinkItem>
          {/* <NavLinkItem to="/my-blogs">My Blogs</NavLinkItem> - In sidebar for less clutter */}
        </div>

        <div className="flex items-center space-x-3">
          {user && (
            <Link to="/profile" className="flex items-center hover:text-teal-200 transition duration-150">
              <UserCircleIcon className="h-7 w-7 mr-1" />
              <span className="hidden sm:inline text-sm">{user.name || 'Profile'}</span>
            </Link>
          )}
          {/* Logout button is now in the Sidebar for a cleaner Navbar */} 
        </div>
      </div>
    </nav>
  );
};

// Helper component for NavLink styling
const NavLinkItem = ({ to, children }) => (
  <Link 
    to={to} 
    className="text-white hover:text-teal-200 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
    // activeClassName="bg-teal-700" // NavLink from react-router-dom v6 doesn't use activeClassName directly
    // Use NavLink component from react-router-dom for active state if more complex styling needed
  >
    {children}
  </Link>
);

export default Navbar;

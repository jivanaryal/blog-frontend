import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { XMarkIcon, HomeIcon, DocumentTextIcon, PencilSquareIcon, UserCircleIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'; // Using Heroicons for icons

const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    onClose(); // Close sidebar on logout
    // Navigation to /landing will happen automatically due to ProtectedRoute logic
  };

  const baseLinkClasses = "flex items-center px-4 py-3 text-gray-700 hover:bg-teal-100 hover:text-teal-700 rounded-md transition duration-150 ease-in-out";
  const activeLinkClasses = "bg-teal-100 text-teal-700 font-semibold";

  return (
    <>
      {/* Overlay for mobile */} 
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>

      {/* Sidebar */} 
      <aside 
        className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:top-16 md:h-[calc(100vh-4rem)] ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex justify-between items-center p-4 border-b md:hidden">
          <span className="text-xl font-semibold text-teal-700">Menu</span>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {/* User Info (Optional but good for context) */} 
          {user && (
            <div className="mb-4 p-2 border-b border-gray-200">
              <UserCircleIcon className="h-8 w-8 text-gray-500 inline-block mr-2"/>
              <span className="text-sm font-medium text-gray-800">{user.name || 'User'}</span>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          )}

          <NavLink 
            to="/" 
            className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeLinkClasses : ''}`}
            onClick={onClose} // Close sidebar on navigation for mobile
          >
            <HomeIcon className="h-5 w-5 mr-3" />
            Home (All Blogs)
          </NavLink>
          <NavLink 
            to="/my-blogs" 
            className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeLinkClasses : ''}`}
            onClick={onClose}
          >
            <DocumentTextIcon className="h-5 w-5 mr-3" />
            My Blogs
          </NavLink>
          <NavLink 
            to="/create-blog" 
            className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeLinkClasses : ''}`}
            onClick={onClose}
          >
            <PencilSquareIcon className="h-5 w-5 mr-3" />
            Create Blog
          </NavLink>
          <NavLink 
            to="/profile" 
            className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeLinkClasses : ''}`}
            onClick={onClose}
          >
            <UserCircleIcon className="h-5 w-5 mr-3" />
            Profile
          </NavLink>
          
          {/* Logout Button */} 
          <button 
            onClick={handleLogout} 
            className={`${baseLinkClasses} w-full text-left text-red-600 hover:bg-red-100 hover:text-red-700 mt-6`}
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

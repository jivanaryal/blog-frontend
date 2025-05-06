import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { getAllBlogs } from "../api/blogApi";
import { AuthContext } from "../context/AuthContext";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllBlogs();
        setBlogs(data.blogs || data);
      } catch (err) {
        setError(err.message || "Failed to fetch blogs.");
      }
      setLoading(false);
    };

    fetchBlogs();
  }, []);

  // Filter blogs based on title, content or author name
  const filteredBlogs = blogs.filter((blog) => {
    const query = searchQuery.toLowerCase();
    return (
      blog.title.toLowerCase().includes(query) ||
      blog.content.toLowerCase().includes(query) ||
      blog.author?.name?.toLowerCase().includes(query)
    );
  });

  // UI return block stays mostly the same except for added search input
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Discover Blog Posts
        </h1>

        {token && (
          <Link
            to="/create-blog"
            className="flex items-center bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-0.5"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Create New Blog
          </Link>
        )}
      </div>

      {/* Search input */}
      <div className="relative mb-8 max-w-md">
        <input
          type="text"
          placeholder="Search blogs by title, content, or author..."
          className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"></div>
          <p className="ml-4 text-xl text-gray-700">Loading blogs...</p>
        </div>
      ) : error ? (
        <div className="text-center mt-10 p-4 bg-red-100 text-red-700 rounded-md shadow">
          <p className="text-xl font-semibold">Oops! Something went wrong.</p>
          <p>{error}</p>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="text-center text-gray-600 mt-10">
          <h3 className="text-xl font-medium">No matching blogs found.</h3>
          <p>Try a different search keyword.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredBlogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl transform hover:-translate-y-1 flex flex-col"
            >
              {blog.image ? (
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-52 object-cover"
                />
              ) : (
                <div className="w-full h-52 bg-gray-200 flex items-center justify-center text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
              <div className="p-5 flex flex-col flex-grow">
                <h2
                  className="text-xl font-semibold text-gray-800 mb-2 truncate hover:text-teal-600 transition duration-150"
                  title={blog.title}
                >
                  {blog.title}
                </h2>
                <div className="text-xs text-gray-500 mb-3 space-x-2">
                  <span>
                    By:{" "}
                    <span className="font-medium text-teal-700">
                      {blog.author?.name || "Unknown Author"}
                    </span>
                  </span>
                  <span>•</span>
                  <span>
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3 flex-grow">
                  {blog.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;

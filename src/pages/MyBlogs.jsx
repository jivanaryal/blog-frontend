import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserBlogs, deleteBlog } from "../api/blogApi";
import { AuthContext } from "../context/AuthContext";
import {
  PlusCircleIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserBlogs = async () => {
      if (!user || !user._id || !token) {
        setError("Authentication required. Please log in.");
        setLoading(false);
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getUserBlogs(user._id);
        setBlogs(data.blogs || data);
      } catch (err) {
        setError(err.message || "Failed to fetch your blogs.");
      }
      setLoading(false);
    };

    fetchUserBlogs();
  }, [user, token, navigate]);

  const handleDelete = async (blogId) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this blog post?"
      )
    ) {
      return;
    }
    try {
      setError(null); // Clear previous errors
      await deleteBlog(blogId);
      setBlogs(blogs.filter((blog) => blog._id !== blogId));
      // Optionally show a success toast notification here
    } catch (err) {
      setError(err.message || "Failed to delete blog.");
      // Optionally show an error toast notification here
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"></div>
        <p className="ml-4 text-xl text-gray-700">Loading your blogs...</p>
      </div>
    );
  }

  // Show login prompt if no user/token, even if loading finished quickly
  if (!user || !token) {
    return (
      <div className="text-center mt-10 p-4 bg-yellow-100 text-yellow-800 rounded-md shadow">
        <p className="text-xl font-semibold">Authentication Required</p>
        <p>Please log in to manage your blogs.</p>
        <Link
          to="/login"
          className="text-teal-600 hover:underline mt-2 inline-block"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  if (error && !blogs.length) {
    // Show error prominently if fetch failed and no blogs loaded
    return (
      <div className="text-center mt-10 p-4 bg-red-100 text-red-700 rounded-md shadow">
        <p className="text-xl font-semibold">Oops! Something went wrong.</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          My Blog Posts
        </h1>
        <Link
          to="/create-blog"
          className="flex items-center bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-0.5"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Create New Blog
        </Link>
      </div>

      {/* Display non-critical errors (e.g., delete error) without blocking content */}
      {error && blogs.length > 0 && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md shadow-sm text-sm">
          <p>
            <span className="font-semibold">Error:</span> {error}
          </p>
        </div>
      )}

      {blogs.length === 0 && !loading ? (
        <div className="text-center py-10">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-2 text-xl font-medium text-gray-900">
            No blogs created yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Ready to share your thoughts?
          </p>
          <Link
            to="/create-blog"
            className="mt-4 inline-block bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 shadow-md"
          >
            Create Your First Blog
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {blogs.map((blog) => (
            <section key={blog._id}>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl flex flex-col md:flex-row items-start">
                {/* Image or placeholder */}
                {blog.image ? (
                  <Link to={`/singleBlog/${blog._id}`}>
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full md:w-48 h-40 md:h-full object-cover flex-shrink-0"
                    />
                  </Link>
                ) : (
                  <Link to={`/singleBlog/${blog._id}`}>
                    <div className="w-full md:w-48 h-40 md:h-full bg-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0">
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
                  </Link>
                )}

                {/* Blog Info */}
                <div className="p-5 flex flex-col flex-grow w-full">
                  <Link to={`/singleBlog/${blog._id}`}>
                    <h2
                      className="text-xl font-semibold text-gray-800 mb-1 truncate hover:text-teal-600 transition duration-150"
                      title={blog.title}
                    >
                      {blog.title}
                    </h2>
                  </Link>
                  <p className="text-xs text-gray-500 mb-3">
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2 flex-grow">
                    {blog.content}
                  </p>

                  {/* Actions */}
                  <div className="flex space-x-3 mt-auto self-end">
                    <Link
                      to={`/edit-blog/${blog._id}`}
                      className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1.5 px-3 rounded text-sm transition duration-300 shadow-sm hover:shadow-md"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="flex items-center bg-red-500 hover:bg-red-700 text-white font-bold py-1.5 px-3 rounded text-sm transition duration-300 shadow-sm hover:shadow-md"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBlogs;

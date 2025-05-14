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
    )
      return;

    try {
      setError(null);
      await deleteBlog(blogId);
      setBlogs(blogs.filter((blog) => blog._id !== blogId));
    } catch (err) {
      setError(err.message || "Failed to delete blog.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent mb-4"></div>
        <p className="text-gray-600 text-lg">Loading your blogs...</p>
      </div>
    );
  }

  if (!user || !token) {
    return (
      <div className="max-w-lg mx-auto mt-12 bg-yellow-50 p-6 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold text-yellow-800">
          Authentication Required
        </h2>
        <p className="text-sm text-yellow-700 mt-2">
          Please log in to manage your blogs.
        </p>
        <Link
          to="/login"
          className="inline-block mt-4 text-teal-600 font-medium hover:underline"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  if (error && blogs.length === 0) {
    return (
      <div className="max-w-lg mx-auto mt-12 bg-red-50 p-6 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold text-red-800">
          Oops! Something went wrong.
        </h2>
        <p className="text-sm text-red-700 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Blog Posts</h1>
        <Link
          to="/create-blog"
          className="flex items-center bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg shadow transition duration-200"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          New Blog
        </Link>
      </div>

      {error && blogs.length > 0 && (
        <div className="mb-4 bg-red-100 text-red-700 p-3 rounded shadow-sm text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {blogs.length === 0 ? (
        <div className="text-center mt-16">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-700">
            No blogs yet
          </h3>
          <p className="text-sm text-gray-500">
            Start sharing your stories with the world.
          </p>
          <Link
            to="/create-blog"
            className="mt-5 inline-block bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded shadow transition"
          >
            Create Your First Blog
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden flex flex-col md:flex-row"
            >
              <Link
                to={`/singleBlog/${blog._id}`}
                className="md:w-64 h-40 md:h-auto flex-shrink-0"
              >
                {blog.image ? (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <svg
                      className="h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </Link>

              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <Link to={`/singleBlog/${blog._id}`}>
                    <h2 className="text-xl font-semibold text-gray-800 hover:text-teal-600 transition line-clamp-1">
                      {blog.title}
                    </h2>
                  </Link>
                  <p className="text-xs text-gray-500 mb-2">
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {blog.content}
                  </p>
                </div>

                <div className="flex gap-3 mt-4 self-end">
                  <Link
                    to={`/edit-blog/${blog._id}`}
                    state={{ blog }}
                    className="flex items-center text-white bg-yellow-500 hover:bg-yellow-600 text-sm px-3 py-1.5 rounded shadow-sm"
                  >
                    <PencilIcon className="w-4 h-4 mr-1" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="flex items-center text-white bg-red-500 hover:bg-red-600 text-sm px-3 py-1.5 rounded shadow-sm"
                  >
                    <TrashIcon className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBlogs;

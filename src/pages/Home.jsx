import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { getAllBlogs } from "../api/blogApi";
import { AuthContext } from "../context/AuthContext";
import { PlusCircleIcon } from "@heroicons/react/24/solid"; // For create blog button icon

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext); // To show/hide create blog button

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllBlogs();
        setBlogs(data.blogs || data); // Adjust based on backend response structure
      } catch (err) {
        setError(err.message || "Failed to fetch blogs.");
      }
      setLoading(false);
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"></div>
        <p className="ml-4 text-xl text-gray-700">Loading blogs...</p>
      </div>
    );
  }

  if (error) {
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
      {blogs.length === 0 ? (
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
            No blogs yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new blog post.
          </p>
          {!token && (
            <p className="mt-2 text-sm text-gray-500">
              Or{" "}
              <Link to="/login" className="text-teal-600 hover:underline">
                login
              </Link>{" "}
              to create one!
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl transform hover:-translate-y-1 flex flex-col"
            >
              {blog.image ? (
                <img
                  src={blog.image} // Assuming image is a URL
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
                  {/* If you want a link to a single blog view page (not specified yet) */}
                  {/* <Link to={`/blog/${blog._id}`}>{blog.title}</Link> */}
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
                {/* Optional: Read More link if content is long */}
                {/* <Link to={`/blog/${blog._id}`} className="text-teal-600 hover:text-teal-700 font-medium text-sm self-start mt-auto">Read More &rarr;</Link> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;

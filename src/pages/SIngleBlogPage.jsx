import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getBlogById, deleteBlog } from "../api/blogApi";
import {
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  ClockIcon,
  UserIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

const SingleBlogPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getBlogById(id);
        setBlog(data);
      } catch (err) {
        setError(err.message || "Failed to fetch blog post.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this blog post?"
      )
    ) {
      return;
    }
    try {
      await deleteBlog(id);
      navigate("/my-blogs");
      // Optionally show a success toast notification here
    } catch (err) {
      setError(err.message || "Failed to delete blog.");
      // Optionally show an error toast notification here
    }
  };

  const isOwner = blog && user && blog.author === user._id;

  const formattedDate = blog?.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal-500"></div>
        <p className="ml-4 text-xl text-gray-700">Loading blog post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 bg-red-50 border border-red-200 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-red-700 mb-2">
          Oops! Something went wrong.
        </h2>
        <p className="text-red-600 mb-4">{error}</p>
        <Link
          to="/my-blogs"
          className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition duration-300"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to My Blogs
        </Link>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-yellow-700 mb-2">
          Blog Not Found
        </h2>
        <p className="text-yellow-600 mb-4">
          The blog post you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/my-blogs"
          className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition duration-300"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to My Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-white">
      <div className="mb-8">
        <Link
          to="/my-blogs"
          className="inline-flex items-center text-teal-600 hover:text-teal-800 font-medium transition duration-300"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to My Blogs
        </Link>
      </div>

      {/* Blog Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center text-sm text-gray-500 space-x-4 mb-6">
          <div className="flex items-center">
            <UserIcon className="h-4 w-4 mr-1" />
            <span>Author</span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span>{formattedDate}</span>
          </div>
          {blog.tags?.length > 0 && (
            <div className="flex items-center">
              <TagIcon className="h-4 w-4 mr-1" />
              <span>{blog.tags.join(", ")}</span>
            </div>
          )}
        </div>

        {isOwner && (
          <div className="flex space-x-3 mb-2">
            <Link
              to={`/edit-blog/${blog._id}`}
              className="flex items-center bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded transition duration-300 shadow-sm hover:shadow-md"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit Post
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition duration-300 shadow-sm hover:shadow-md"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete Post
            </button>
          </div>
        )}
      </header>

      {/* Featured Image with proper loading handling */}
      {blog.image && (
        <div className="relative mb-10 rounded-lg overflow-hidden shadow-lg">
          {!imageLoaded && (
            <div className="w-full h-96 bg-gray-200 animate-pulse flex items-center justify-center">
              <span className="text-gray-500">Loading image...</span>
            </div>
          )}
          <img
            src={blog.image}
            alt={blog.title}
            className={`w-full max-h-96 object-cover ${
              imageLoaded ? "block" : "hidden"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageLoaded(true);
              // You could set an error state here if needed
            }}
          />
        </div>
      )}

      {/* Blog Content */}
      <div className="prose prose-lg max-w-none text-gray-800">
        {blog?.content?.split("\n\n").map((paragraph, index) => (
          <p key={index} className="mb-6 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Tags Section */}
      {blog.tags?.length > 0 && (
        <div className="mt-12 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <TagIcon className="h-5 w-5 mr-2 text-teal-600" />
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1.5 rounded-full transition duration-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleBlogPage;

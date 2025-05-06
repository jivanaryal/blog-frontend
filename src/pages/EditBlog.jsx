import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateBlog } from "../api/blogApi"; // Assuming getBlogById is implemented or use getAllBlogs and filter
import { AuthContext } from "../context/AuthContext";
import { ArrowUpOnSquareIcon } from '@heroicons/react/24/solid';

// NOTE: Fetching the specific blog to edit (getBlogById) is crucial here.
// The previous version had a placeholder for this. This version still assumes
// that the title and content are somehow fetched and set. In a real app,
// you would make an API call in useEffect to get the blog details by blogId.

const EditBlog = () => {
  const { id: blogId } = useParams();
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // Image editing is not part of this simplified version based on current API
  // const [image, setImage] = useState(null);
  // const [imagePreview, setImagePreview] = useState(null);
  // const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [loading, setLoading] = useState(true); // For fetching initial data
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false); // For form submission

  useEffect(() => {
    const fetchBlogDetails = async () => {
      if (!token) {
        navigate("/login");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        // ** CRITICAL: Implement actual fetching of blog data by blogId **
        // This is a placeholder. You need an API endpoint like /api/blog/:id (GET)
        // and a corresponding function in blogApi.js to fetch it.
        // For now, we'll simulate it or assume data is passed via route state (not implemented here).
        // Example: const blogData = await getBlogById(blogId, token);
        // setTitle(blogData.title);
        // setContent(blogData.content);
        // setCurrentImageUrl(blogData.image);

        // Simulate fetching - REMOVE THIS IN PRODUCTION
        // To make the form usable for demonstration, we'll try to find it from user's blogs if available
        // This is highly inefficient and not a good practice for a real app.
        // A dedicated GET /api/blog/:id endpoint is needed.
        if (user && user._id) {
            const response = await fetch(`/api/blog/${blogId}`, { // Direct fetch attempt
                 headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch blog details for editing.");
            }
            const blogToEdit = await response.json();
            if (blogToEdit.author._id !== user._id && blogToEdit.author !== user._id) { // Check ownership
                 setError("You are not authorized to edit this blog.");
                 setTitle("Unauthorized");
                 setContent("You cannot edit this post.");
            } else {
                setTitle(blogToEdit.title);
                setContent(blogToEdit.content);
                // if (blogToEdit.image) setCurrentImageUrl(blogToEdit.image);
            }
        } else {
            setError("User data not available to fetch blog details.");
        }

      } catch (err) {
        setError(err.message || "Failed to load blog for editing.");
      }
      setLoading(false);
    };

    fetchBlogDetails();
  }, [blogId, token, navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
        setError("Title and content cannot be empty.");
        return;
    }
    setError(null);
    setSubmitLoading(true);

    try {
      await updateBlog(blogId, { title, content });
      navigate("/my-blogs");
    } catch (err) {
      setError(err.message || "Failed to update blog. Please try again.");
    }
    setSubmitLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"></div>
        <p className="ml-4 text-xl text-gray-700">Loading editor...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold text-teal-700 mb-8 text-center">Edit Your Post</h1>
        {error && (
          <div className={`p-4 mb-6 rounded-md ${title === "Unauthorized" ? "bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700" : "bg-red-100 border-l-4 border-red-500 text-red-700"}`} role="alert">
            <p className="font-bold">{title === "Unauthorized" ? "Access Denied" : "Error"}</p>
            <p>{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
              Blog Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-150"
              placeholder="Enter a catchy title"
              required
              disabled={title === "Unauthorized"}
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-1">
              Your Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-150 h-48 resize-y"
              placeholder="Share your story..."
              required
              disabled={title === "Unauthorized"}
            />
          </div>
          
          {/* Image editing UI - not implemented for simplicity, but placeholder for where it would go */}
          {/* {currentImageUrl && <img src={currentImageUrl} alt="Current blog image" className="w-full h-auto mb-2 rounded-md object-contain"/>} 
          <div>
            <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-1">
              Change Featured Image (Optional)
            </label>
            <input
              type="file"
              id="image"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setImage(file);
                  setImagePreview(URL.createObjectURL(file));
                }
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 transition duration-150"
              accept="image/*"
              disabled={title === "Unauthorized"}
            />
            {imagePreview && <img src={imagePreview} alt="New preview" className="mt-2 mx-auto h-32 w-auto rounded-md object-contain"/>}
          </div>
          */}

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              className={`flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg shadow-md focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-0.5 ${submitLoading || title === "Unauthorized" ? "opacity-75 cursor-not-allowed" : ""}`}
              disabled={submitLoading || title === "Unauthorized"}
            >
              {submitLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </span>
              ) : (
                <>
                  <ArrowUpOnSquareIcon className="h-5 w-5 mr-2"/>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;

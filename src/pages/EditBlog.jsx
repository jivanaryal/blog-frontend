import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlogById, updateBlog } from "../api/blogApi";
import { AuthContext } from "../context/AuthContext";
import { ArrowUpOnSquareIcon } from "@heroicons/react/24/solid";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  content: Yup.string()
    .trim()
    .required("Content is required")
    .min(10, "Content must be at least 10 characters"),
});

const EditBlog = () => {
  const { id: blogId } = useParams();
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);

  const [initialValues, setInitialValues] = useState({
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      if (!token) {
        navigate("/login");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        if (user && user._id) {
          const blogToEdit = await getBlogById(blogId);
          if (
            blogToEdit.author._id !== user._id &&
            blogToEdit.author !== user._id
          ) {
            setError("You are not authorized to edit this blog.");
            setInitialValues({
              title: "Unauthorized",
              content: "You cannot edit this post.",
            });
          } else {
            setInitialValues({
              title: blogToEdit.title,
              content: blogToEdit.content,
            });
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

  const handleSubmit = async (values) => {
    try {
      await updateBlog(blogId, values);
      navigate("/my-blogs");
    } catch (err) {
      setError(err.message || "Failed to update blog. Please try again.");
    }
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
        <h1 className="text-3xl font-bold text-teal-700 mb-8 text-center">
          Edit Your Post
        </h1>
        {error && (
          <div
            className={`p-4 mb-6 rounded-md ${
              initialValues.title === "Unauthorized"
                ? "bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700"
                : "bg-red-100 border-l-4 border-red-500 text-red-700"
            }`}
            role="alert"
          >
            <p className="font-bold">
              {initialValues.title === "Unauthorized"
                ? "Access Denied"
                : "Error"}
            </p>
            <p>{error}</p>
          </div>
        )}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Blog Title
                </label>
                <Field
                  type="text"
                  id="title"
                  name="title"
                  className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-150"
                  placeholder="Enter a catchy title"
                  disabled={initialValues.title === "Unauthorized"}
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Your Content
                </label>
                <Field
                  as="textarea"
                  id="content"
                  name="content"
                  className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-150 h-48 resize-y"
                  placeholder="Share your story..."
                  disabled={initialValues.title === "Unauthorized"}
                />
                <ErrorMessage
                  name="content"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div className="flex items-center justify-end pt-2">
                <button
                  type="submit"
                  className={`flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg shadow-md focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-0.5 ${
                    isSubmitting || initialValues.title === "Unauthorized"
                      ? "opacity-75 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={
                    isSubmitting || initialValues.title === "Unauthorized"
                  }
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    <>
                      <ArrowUpOnSquareIcon className="h-5 w-5 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditBlog;

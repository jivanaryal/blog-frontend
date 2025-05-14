import { Field, Form, Formik } from "formik";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditBlog = () => {
  const [blog, setBlog] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(
          `https://blog-hqx2.onrender.com/blog/single/${id}`
        );
        setBlog(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch blog:", error);
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  console.log(blog);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) setImage(file);
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("content", values.content);
    if (image) formData.append("image", image);
    formData.append("author", user._id);

    try {
      await axios.patch(`https://blog-1rng.onrender.com/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: false, // add this line
      });
      navigate("/");
    } catch (error) {
      console.error("Blog update failed", error);
    }
  };

  if (loading) {
    return <p className="mt-10 ml-10 text-lg">Loading blog...</p>;
  }

  if (!blog) {
    return <p className="mt-10 ml-10 text-lg text-red-500">Blog not found.</p>;
  }

  return (
    <div className="mt-10 ml-10 max-w-2xl">
      <h2 className="text-2xl font-semibold mb-6">Edit Blog</h2>
      <Formik
        initialValues={{
          title: blog.title,
          content: blog.content,
        }}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className="mb-4">
            <label htmlFor="title" className="text-xl font-medium">
              Title
            </label>
            <Field
              type="text"
              name="title"
              placeholder="Enter blog title"
              className="border px-2 py-1 w-full mt-1"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="content" className="text-xl font-medium">
              Content
            </label>
            <Field
              as="textarea"
              name="content"
              placeholder="Enter blog content"
              className="border px-2 py-1 w-full h-32 mt-1"
            />
          </div>

          {blog.image && (
            <div className="mb-4">
              <p className="text-lg font-medium mb-2">Current Blog Image:</p>
              <img
                src={blog.image}
                alt="Current blog"
                className="w-64 h-auto rounded-md border"
              />
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="image" className="block mb-1 font-medium">
              Upload new blog image (optional)
            </label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              className="border bg-amber-300 w-full px-2 py-1"
            />
          </div>

          <button
            type="submit"
            className="p-2 bg-blue-500 rounded-lg text-white mt-4 cursor-pointer hover:bg-blue-600"
          >
            Submit Blog
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default EditBlog;

import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
// import { ReactComponent as AvatarIcon } from "../assets/avatar.svg"; // Optional SVG avatar
import { PencilIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { getUserBlogs } from "../api/blogApi";

const Profile = () => {
  const { user, token } = useContext(AuthContext);
  const userName = user?.name || "Anonymous";
  const userEmail = user?.email || "N/A";
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white p-6 md:p-10 rounded-2xl shadow-2xl">
        <h1 className="text-4xl font-bold text-center text-teal-700 mb-8">
          User Profile
        </h1>

        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shadow-inner">
            {/* Replace this with any avatar icon or image */}
            <img
              src="https://avatars.dicebear.com/api/identicon/user.svg"
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>

          {/* User Info */}
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-semibold text-gray-800">{userName}</h2>
            <p className="text-gray-600">{userEmail}</p>
            <p className="text-sm text-gray-500">
              Member since: <span className="italic">Apr 2024</span>
            </p>
            <button className="mt-4 inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition">
              <PencilIcon className="h-5 w-5 mr-2" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-10 border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              Total Blogs Uploaded
            </h3>
            <p className="text-3xl text-teal-600 font-bold">{blogs?.length}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              Account Type
            </h3>
            <p className="text-xl text-gray-500">Standard User</p>
          </div>
        </div>

        {/* Blog List Preview */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Your Blogs
          </h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            {blogs.map((blog, i) => (
              <Link key={i} to={`/singleBlog/${blog._id}`}>
                {" "}
                <li key={blog.id} className="underline font-lg capitalize">
                  {blog.title}
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;

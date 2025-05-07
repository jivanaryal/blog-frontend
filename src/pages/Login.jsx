import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../api/authApi";

const Login = () => {
  const { login, token, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && token) {
      navigate("/");
    }
  }, [token, isLoading, navigate]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      setError(null);
      setLoading(true);
      try {
        const data = await loginUser(values);
        login(data.token, data.user);
        navigate("/");
      } catch (err) {
        setError(
          err.message || "Failed to login. Please check your credentials."
        );
      }
      setLoading(false);
    },
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-8 text-center text-teal-700">
          Welcome Back!
        </h2>

        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md"
            role="alert"
          >
            <p className="font-bold">Login Failed</p>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className={`shadow-sm appearance-none border ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-150`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-600 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className={`shadow-sm appearance-none border ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-150`}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-600 text-sm mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-0.5 ${
                loading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
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
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Don't have an account yet?{" "}
          <Link
            to="/register"
            className="font-medium text-teal-600 hover:text-teal-700 hover:underline"
          >
            Sign up here
          </Link>
        </p>
      </div>

      <p className="mt-8 text-center text-sm text-gray-500">
        <Link to="/landing" className="hover:underline">
          &larr; Back to Landing Page
        </Link>
      </p>
    </div>
  );
};

export default Login;

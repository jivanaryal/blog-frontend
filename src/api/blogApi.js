import { API_BASE_URL } from "../config";

const BLOG_API_URL = `${API_BASE_URL}/blog`;

// Helper function to get token
const getToken = () => localStorage.getItem("token");

export const getAllBlogs = async () => {
  const response = await fetch(`${BLOG_API_URL}/`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch blogs");
  }
  return response.json();
};

export const getUserBlogs = async (userId) => {
  // Assuming the backend route is /blog/:userId for user-specific blogs
  // The provided route was /:user, which might imply username or ID.
  // Adjust if the backend expects username instead of ID.
  const response = await fetch(`${BLOG_API_URL}/${userId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch user blogs");
  }
  return response.json();
};

export const getBlogById = async (blogId) => {
  // Assuming the backend route is /blog/:userId for user-specific blogs
  // The provided route was /:user, which might imply username or ID.
  // Adjust if the backend expects username instead of ID.
  const response = await fetch(`${BLOG_API_URL}/single/${blogId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch user blogs");
  }
  return response.json();
};

export const createBlog = async (blogData) => {
  // blogData should be FormData if including an image
  const response = await fetch(`${BLOG_API_URL}/create`, {
    method: "POST",
    headers: {
      // Content-Type is set automatically by browser for FormData
      Authorization: `Bearer ${getToken()}`,
    },
    body: blogData, // Send FormData directly
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create blog");
  }
  return response.json();
};

export const updateBlog = async (blogId, blogData) => {
  // Assuming blogData contains title and content for update
  const response = await fetch(`${BLOG_API_URL}/${blogId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(blogData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update blog");
  }
  return response.json();
};

export const deleteBlog = async (blogId) => {
  const response = await fetch(`${BLOG_API_URL}/${blogId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete blog");
  }
  // Usually, DELETE requests return 204 No Content or a confirmation message
  // Adjust based on your backend implementation
  if (response.status === 204) {
    return { message: "Blog deleted successfully" };
  }
  return response.json();
};

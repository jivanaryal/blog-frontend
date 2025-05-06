import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar"; // Assuming Sidebar will be created
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateBlog from "./pages/CreateBlog";
import MyBlogs from "./pages/MyBlogs";
import EditBlog from "./pages/EditBlog";
import LandingPage from "./pages/LandingPage"; // Import the new LandingPage
import Profile from "./pages/Profile"; // Placeholder for Profile page
import { useState } from "react";
import SingleBlogPage from "./pages/SIngleBlogPage";

const MainLayout = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!token) return <>{children}</>;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

      <div className="flex flex-1 pt-16">
        {/* Sidebar: always visible on md+, toggle on mobile */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Content area */}
        <main
          className={`flex-1 p-4 md:p-6 transition-all duration-300 md:ml-64`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes with layout */}
          <Route
            path="/"
            element={
              <MainLayout>
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              </MainLayout>
            }
          />
          <Route
            path="/create-blog"
            element={
              <MainLayout>
                <ProtectedRoute>
                  <CreateBlog />
                </ProtectedRoute>
              </MainLayout>
            }
          />
          <Route
            path="/my-blogs"
            element={
              <MainLayout>
                <ProtectedRoute>
                  <MyBlogs />
                </ProtectedRoute>
              </MainLayout>
            }
          />
          <Route
            path="/edit-blog/:id"
            element={
              <MainLayout>
                <ProtectedRoute>
                  <EditBlog />
                </ProtectedRoute>
              </MainLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <MainLayout>
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              </MainLayout>
            }
          />
          <Route
            path="/singleBlog/:id"
            element={
              <MainLayout>
                <ProtectedRoute>
                  <SingleBlogPage />
                </ProtectedRoute>
              </MainLayout>
            }
          />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/landing" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);

  // Check if token is null or undefined. Add an additional check to make sure we're not redirecting prematurely.
  if (token === null) {
    return <div>Loading...</div>; // You could add a loading spinner or something here while the token is being loaded
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

/**
 * ProtectedRoute Component
 * This component protects routes by checking user authentication and role.
 * It redirects to login if no user is authenticated or shows an access denied
 * message if the user lacks admin privileges.
 * @param {Object} props - Component props
 * @param {Object} props.user - User object with id, name, email, and role
 * @param {ReactNode} props.children - Child components to render if authorized
 */
function ProtectedRoute({ user, children }) {
  const location = useLocation(); // Hook to get current location for redirect state
  // console.log("ProtectedRoute: User:", user); // Log user object for debugging

  if (!user && localStorage.getItem("token")) {
    // Check if token exists but user is not loaded
    console.log("ProtectedRoute: Token exists, waiting for user state"); // Log waiting state
    return <div className="text-center py-20">Loading...</div>; // Show loading state
  }

  if (!user) {
    // Check if no user is authenticated
    console.log("ProtectedRoute: No user, redirecting to login"); // Log redirect action
    return <Navigate to="/login" state={{ from: location }} replace />; // Redirect to login with current location
  }

  if (user.role !== "admin") {
    // Check if user is not an admin
    console.log("ProtectedRoute: User not admin, showing access denied"); // Log access denial
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="mt-4">You need admin privileges to access this page.</p>
        <button
          onClick={() => (window.location.href = "/")} // Navigate to home on button click
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return children; // Render children if user is authenticated and has admin role
}

ProtectedRoute.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // User ID (string or number)
    name: PropTypes.string, // User name
    email: PropTypes.string, // User email
    role: PropTypes.string, // User role
  }),
  children: PropTypes.node.isRequired, // Required child components
};

export default ProtectedRoute;

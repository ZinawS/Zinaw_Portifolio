import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

function ProtectedRoute({ user, children }) {
  const location = useLocation();
  console.log("ProtectedRoute: User:", user);

  if (!user && localStorage.getItem("token")) {
    console.log("ProtectedRoute: Token exists, waiting for user state");
    return <div className="text-center py-20">Loading...</div>;
  }

  if (!user) {
    console.log("ProtectedRoute: No user, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== "admin") {
    console.log("ProtectedRoute: User not admin, showing access denied");
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="mt-4">You need admin privileges to access this page.</p>
        <button
          onClick={() => window.location.href = "/"}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return children;
}

ProtectedRoute.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
  }),
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
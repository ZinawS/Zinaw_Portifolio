// Importing core React modules and utilities
import React, { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


// Importing shared components
import NavBar from "./components/NavBar";
import AuthForm from "./components/AuthForm";
import PasswordReset from "./components/PasswordReset";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import Resume from "./pages/Resume";
import Home from "./pages/Home";
// import { baseURL } from "./Utility/Api";

// Lazy-loaded route components for performance optimization
// const Home = lazy(() => import("./components/Home"));
const About = lazy(() => import("./components/About"));
// const Resume = lazy(() => import("./components/Resume"));
const Services = lazy(() => import("./components/Services"));
const Portfolio = lazy(() => import("./components/Portfolio"));
const Recommendations = lazy(() => import("./components/Recommendations"));
const Contact = lazy(() => import("./components/Contact"));
const Blog = lazy(() => import("./components/Blog"));
const AdminDashboard = lazy(() => import("./components/AdminDashboard"));

// Component to handle reset password token validation
function PasswordResetWrapper() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [resetToken, setResetToken] = useState(null);
  const [tokenValid, setTokenValid] = useState(null);

  // Run validation when component mounts or token changes
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      return navigate("/login", {
        replace: true,
        state: { error: "No reset token provided" },
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    async function validateToken() {
      try {
        const response = await fetch(`/api/password-reset/${token}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        const data = await response.json();

        if (data.valid) {
          setResetToken(token);
          setTokenValid(true);
        } else {
          throw new Error(data.error || "Invalid or expired reset token");
        }
      } catch (err) {
        clearTimeout(timeoutId);
        setResetToken(null);
        setTokenValid(false);
        navigate("/login", {
          replace: true,
          state: {
            error:
              err.name === "AbortError"
                ? "Token validation timed out"
                : err.message,
          },
        });
      }
    }

    validateToken();
  }, [token, navigate]);

  // Render based on validation state
  if (tokenValid === true) {
    return (
      <PasswordReset resetToken={resetToken} setResetToken={setResetToken} />
    );
  } else if (tokenValid === false) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Invalid Reset Token</h1>
        <p className="mt-4">
          The password reset link is invalid or has expired.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          Back to Login
        </button>
      </div>
    );
  } else {
    return (
      <div className="text-center py-20">
        Validating token...
        <p className="mt-4 text-gray-600">
          If this takes too long,{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:text-blue-800"
          >
            return to login
          </button>
          .
        </p>
      </div>
    );
  }
}

// Main App component
function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
   
  // Initialize user session based on token
  useEffect(() => {
    const initializeUser = async () => {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        try {
          const decoded = jwtDecode(storedToken);
          const currentTime = Date.now() / 1000;

          if (decoded.exp > currentTime) {
            if (decoded.id && decoded.email && decoded.role) {
              setUser(decoded);
              if (
                decoded.role === "admin" &&
                !["/admin", "/logout"].includes(window.location.pathname)
              ) {
                navigate("/admin", { replace: true });
              }
            } else {
              localStorage.removeItem("token");
              navigate("/register", { replace: true });
            }
          } else {
            localStorage.removeItem("token");
            navigate("/login", { replace: true });
          }
        } catch {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
        }
      }
      setIsLoading(false);
    };

    initializeUser();
  }, [navigate]);

  // Handle logout and redirect to homepage
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/", { replace: true });
  };

  // Show loading spinner until initialization completes
  if (isLoading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  // Return the full app layout with routing and navigation
  return (
    <div className="font-poppins text-gray-800">
      <NavBar user={user} onLogout={handleLogout} />
      <main className="pt-1">
        <Suspense
          fallback={<div className="text-center py-20">Loading...</div>}
        >
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <ErrorBoundary route="/">
                  {" "}
                  <Home />{" "}
                </ErrorBoundary>
              }
            />
            <Route
              path="/about"
              element={
                <ErrorBoundary route="/about">
                  {" "}
                  <About />{" "}
                </ErrorBoundary>
              }
            />
            <Route
              path="/resume"
              element={
                <ErrorBoundary route="/resume">
                  {" "}
                  <Resume />{" "}
                </ErrorBoundary>
              }
            />
            <Route
              path="/services"
              element={
                <ErrorBoundary route="/services">
                  {" "}
                  <Services />{" "}
                </ErrorBoundary>
              }
            />
            <Route
              path="/portfolio"
              element={
                <ErrorBoundary route="/portfolio">
                  {" "}
                  <Portfolio />{" "}
                </ErrorBoundary>
              }
            />
            <Route
              path="/recommendations"
              element={
                <ErrorBoundary route="/recommendations">
                  {" "}
                  <Recommendations />{" "}
                </ErrorBoundary>
              }
            />
            <Route
              path="/contact"
              element={
                <ErrorBoundary route="/contact">
                  {" "}
                  <Contact />{" "}
                </ErrorBoundary>
              }
            />
            <Route
              path="/blog"
              element={
                <ErrorBoundary route="/blog">
                  {" "}
                  <Blog />{" "}
                </ErrorBoundary>
              }
            />

            {/* Auth Routes */}
            <Route
              path="/login"
              element={
                <ErrorBoundary route="/login">
                  {" "}
                  <AuthForm setUser={setUser} />{" "}
                </ErrorBoundary>
              }
            />
            <Route
              path="/register"
              element={
                <ErrorBoundary route="/register">
                  {" "}
                  <AuthForm setUser={setUser} />{" "}
                </ErrorBoundary>
              }
            />
            <Route
              path="/reset-password/:token"
              element={
                <ErrorBoundary route="/reset-password">
                  {" "}
                  <PasswordResetWrapper />{" "}
                </ErrorBoundary>
              }
            />

            {/* Protected Admin Route */}
            <Route
              path="/admin"
              element={
                <ErrorBoundary route="/admin">
                  <ProtectedRoute user={user}>
                    <AdminDashboard />
                  </ProtectedRoute>
                </ErrorBoundary>
              }
            />

            {/* 404 Fallback Route */}
            <Route
              path="*"
              element={
                <ErrorBoundary route="*">
                  <div className="text-center py-20">
                    <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
                    <p className="mt-4">
                      The page you're looking for doesn't exist.
                    </p>
                  </div>
                </ErrorBoundary>
              }
            />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;

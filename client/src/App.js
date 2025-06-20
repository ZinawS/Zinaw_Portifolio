import React, { useState, useEffect, lazy, Suspense } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useParams,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import NavBar from "./components/NavBar";
import AuthForm from "./components/AuthForm";
import PasswordReset from "./components/PasswordReset";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

const Home = lazy(() => import("./components/Home"));
const About = lazy(() => import("./components/About"));
const Resume = lazy(() => import("./components/Resume"));
const Services = lazy(() => import("./components/Services"));
const Portfolio = lazy(() => import("./components/Portfolio"));
const Recommendations = lazy(() => import("./components/Recommendations"));
const Contact = lazy(() => import("./components/Contact"));
const Blog = lazy(() => import("./components/Blog"));
const AdminDashboard = lazy(() => import("./components/AdminDashboard"));

// Wrapper component for password reset route
function PasswordResetWrapper() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [resetToken, setResetToken] = useState(null);
  const [tokenValid, setTokenValid] = useState(null);

  useEffect(() => {
    console.log("PasswordResetWrapper: Validating token:", token);
    if (!token) {
      console.log("No token provided in URL");
      setResetToken(null);
      setTokenValid(false);
      navigate("/login", {
        replace: true,
        state: { error: "No reset token provided" },
      });
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.log("Token validation timed out for token:", token);
    }, 5000);

    async function validateToken() {
      try {
        const response = await fetch(
          `http://localhost:3000/api/password-reset/${token}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
          }
        );
        clearTimeout(timeoutId);
        console.log("Fetch response status:", response.status);

        const data = await response.json();
        console.log("Token validation response:", data);

        if (data.valid) {
          setResetToken(token);
          setTokenValid(true);
        } else {
          setResetToken(null);
          setTokenValid(false);
          navigate("/login", {
            replace: true,
            state: { error: data.error || "Invalid or expired reset token" },
          });
        }
      } catch (err) {
        console.error(
          "Token validation error for token:",
          token,
          "Error:",
          err.message,
          err.stack
        );
        clearTimeout(timeoutId);
        setResetToken(null);
        setTokenValid(false);
        navigate("/login", {
          replace: true,
          state: {
            error:
              err.name === "AbortError"
                ? "Token validation timed out"
                : "Failed to validate reset token",
          },
        });
      }
    }

    validateToken();
  }, [token, navigate]);

  return (
    <div>
      {tokenValid === true ? (
        <PasswordReset resetToken={resetToken} setResetToken={setResetToken} />
      ) : tokenValid === false ? (
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
      ) : (
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
      )}
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
        } catch (err) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
        }
      }
      setIsLoading(false);
    };

    initializeUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/", { replace: true });
  };

  if (isLoading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="font-poppins text-gray-800">
      <NavBar user={user} onLogout={handleLogout} />
      <main className="pt-1">
        <Suspense
          fallback={<div className="text-center py-20">Loading...</div>}
        >
          <Routes>
            <Route
              path="/"
              element={
                <ErrorBoundary route={window.location.pathname}>
                  <Home />
                </ErrorBoundary>
              }
            />
            <Route
              path="/about"
              element={
                <ErrorBoundary route={window.location.pathname}>
                  <About />
                </ErrorBoundary>
              }
            />
            <Route
              path="/resume"
              element={
                <ErrorBoundary route={window.location.pathname}>
                  <Resume />
                </ErrorBoundary>
              }
            />
            <Route
              path="/services"
              element={
                <ErrorBoundary route={window.location.pathname}>
                  <Services />
                </ErrorBoundary>
              }
            />
            <Route
              path="/portfolio"
              element={
                <ErrorBoundary route={window.location.pathname}>
                  <Portfolio />
                </ErrorBoundary>
              }
            />
            <Route
              path="/recommendations"
              element={
                <ErrorBoundary route={window.location.pathname}>
                  <Recommendations />
                </ErrorBoundary>
              }
            />
            <Route
              path="/contact"
              element={
                <ErrorBoundary route={window.location.pathname}>
                  <Contact />
                </ErrorBoundary>
              }
            />
            <Route
              path="/blog"
              element={
                <ErrorBoundary route={window.location.pathname}>
                  <Blog />
                </ErrorBoundary>
              }
            />
            <Route
              path="/login"
              element={
                <ErrorBoundary route={window.location.pathname}>
                  <AuthForm setUser={setUser} />
                </ErrorBoundary>
              }
            />
            <Route
              path="/register"
              element={
                <ErrorBoundary route={window.location.pathname}>
                  <AuthForm setUser={setUser} />
                </ErrorBoundary>
              }
            />
            <Route
              path="/reset-password/:token"
              element={
                <ErrorBoundary route={window.location.pathname}>
                  <PasswordResetWrapper />
                </ErrorBoundary>
              }
            />
            <Route
              path="/admin"
              element={
                <ErrorBoundary route={window.location.pathname}>
                  <ProtectedRoute user={user}>
                    <AdminDashboard />
                  </ProtectedRoute>
                </ErrorBoundary>
              }
            />
            <Route
              path="*"
              element={
                <ErrorBoundary route={window.location.pathname}>
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

export default App

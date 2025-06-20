import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// const baseURL = "http://localhost:3000/api";

function AuthForm({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mode, setMode] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (location.state?.error) {
      setError(location.state.error);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      let response;
      if (mode === "login") {
        response = await fetch(`/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
      } else if (mode === "register") {
        response = await fetch(`/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
      } else if (mode === "reset") {
        response = await fetch(`/password-reset`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! Status: ${response.status}`);
      }

      if (mode === "login" && data.success) {
        localStorage.setItem("token", data.token);
        const decoded = jwtDecode(data.token);
        setUser(decoded);
        navigate(from, { replace: true });
        setSuccess(data.message);
      } else if (mode === "register" && data.success) {
        setMode("login");
        setSuccess("Registration successful! Please log in.");
      } else if (mode === "reset" && data.success) {
        setSuccess("If an account exists, a reset link has been sent.");
        setTimeout(() => setMode("login"), 3000);
      }
    } catch (err) {
      setError(
        err.message || "Unable to reach the server. Please try again later."
      );
      console.error("AuthForm error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = (newMode) => {
    setMode(newMode);
    setError("");
    setSuccess("");
    setEmail("");
    setPassword("");
    setName("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {mode === "login"
            ? "Login"
            : mode === "register"
              ? "Register"
              : "Reset Password"}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
                required
              />
            </div>
          )}
          {(mode === "login" || mode === "register" || mode === "reset") && (
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                autoComplete="username"
                required
              />
            </div>
          )}
          {(mode === "login" || mode === "register") && (
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading
              ? "Processing..."
              : mode === "login"
                ? "Login"
                : mode === "register"
                  ? "Register"
                  : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-4 text-center">
          {mode === "login" && (
            <>
              <p>
                Don't have an account?{" "}
                <button
                  onClick={() => toggleMode("register")}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Register
                </button>
              </p>
              <p className="mt-2">
                Forgot password?{" "}
                <button
                  onClick={() => toggleMode("reset")}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Reset Password
                </button>
              </p>
            </>
          )}
          {mode === "register" && (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => toggleMode("login")}
                className="text-blue-600 hover:text-blue-800"
              >
                Login
              </button>
            </p>
          )}
          {mode === "reset" && (
            <p>
              Remembered your password?{" "}
              <button
                onClick={() => toggleMode("login")}
                className="text-blue-600 hover:text-blue-800"
              >
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

AuthForm.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default AuthForm;

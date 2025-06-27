import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
// import { baseURL } from "../Utility/Api"; // Adjust the import path as needed



function PasswordReset({ resetToken, setResetToken }) {
  const [newPassword, setNewPassword] = useState("");
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setModalError(null);
    setModalSuccess("");
    setIsLoading(true);

    if (!newPassword || newPassword.length < 8) {
      setModalError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Submitting reset request with token:", resetToken);
      const response = await fetch(`/api/password-reset/${resetToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
        credentials: "include", // Include cookies for session management
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! Status: ${response.status}`);
      }

      if (data.success) {
        setModalSuccess("Password reset successful! Please log in.");
        setTimeout(() => {
          setResetToken(null);
          setNewPassword("");
          navigate("/login", { replace: true });
        }, 2000);
      } else {
        setModalError(data.error || "Failed to reset password");
      }
    } catch (err) {
      setModalError(
        err.message ||
          "Unable to reach the server. Please check your network or try again later."
      );
      console.error("PasswordReset error:", err.message, err.stack);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setResetToken(null);
    setModalError("");
    setModalSuccess("");
    setNewPassword("");
    navigate("/login", { replace: true });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Set New Password
        </h3>

        {modalError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {modalError}
          </div>
        )}
        {modalSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {modalSuccess}
          </div>
        )}

        <form onSubmit={handleResetSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="newPassword"
            >
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="new-password"
              required
              minLength="8"
            />
            <input
              type="email"
              value="placeholder@example.com"
              className="hidden"
              autoComplete="username"
              readOnly
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isLoading ? "Processing..." : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

PasswordReset.propTypes = {
  resetToken: PropTypes.string.isRequired,
  setResetToken: PropTypes.func.isRequired,
};

export default PasswordReset;

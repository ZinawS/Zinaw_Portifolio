import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../Utility/Api";

function Register() {
  // State for error message
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle registration form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    fetch(`/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Registration successful! Please login.");
          navigate("/login");
        } else {
          setError(data.message);
        }
      })
      .catch((err) => {
        console.error("Register error:", err);
        setError("Registration failed. Please try again.");
      });
  };

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        {/* Section title */}
        <h2 className="text-3xl font-bold text-center mb-8">Register</h2>
        {/* Error message */}
        {error && <div className="alert-error text-center mb-4">{error}</div>}
        {/* Registration form */}
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Register;

/* Imports for React, Router, and PropTypes */
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function NavBar({ user, onLogout }) {
  // State to toggle mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Get current route to handle smooth scrolling on home page
  const location = useLocation();
  const navigate =useNavigate()

  // Handle navigation clicks for smooth scrolling on home page
  const handleNavClick = (e, sectionId) => {
    if (location.pathname === "/") {
      e.preventDefault();
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
        setIsMobileMenuOpen(false); // Close mobile menu
      }
    }
    navigate("/resume")
  };

  return (
    // Fixed header with sticky positioning and shadow
    <header className="bg-gray-900 text-white py-6 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Brand logo */}
        <h4 className="text-2xl font-bold">Zinaw</h4>
        {/* Desktop navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link
            to="/"
            onClick={(e) => handleNavClick(e, "home")}
            className="hover:text-blue-400"
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={(e) => handleNavClick(e, "about")}
            className="hover:text-blue-400"
          >
            About
          </Link>
          <Link
            to="/resume"
            onClick={(e) => handleNavClick(e, "resume")}
            className="hover:text-blue-400"
          >
            Resume
          </Link>
          <Link
            to="/services"
            onClick={(e) => handleNavClick(e, "services")}
            className="hover:text-blue-400"
          >
            Services
          </Link>
          <Link
            to="/portfolio"
            onClick={(e) => handleNavClick(e, "portfolio")}
            className="hover:text-blue-400"
          >
            Portfolio
          </Link>
          <Link
            to="/recommendations"
            onClick={(e) => handleNavClick(e, "recommendations")}
            className="hover:text-blue-400"
          >
            Recommendations
          </Link>
          <Link
            to="/contact"
            onClick={(e) => handleNavClick(e, "contact")}
            className="hover:text-blue-400"
          >
            Contact
          </Link>
          <Link
            to="/blog"
            onClick={(e) => handleNavClick(e, "blog")}
            className="hover:text-blue-400"
          >
            Blog
          </Link>
          {/* Conditional rendering based on user authentication */}
          {user ? (
            <div className="flex items-center space-x-4">
              <button onClick={onLogout} className="hover:text-blue-400">
                Logout
              </button>
              <span className="text-sm text-green-300">Hi, {user.name}</span>
            </div>
          ) : (
            <Link to="/login" className="hover:text-blue-400">
              Login
            </Link>
          )}
        </nav>
        {/* Mobile menu toggle button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
        >
          <span className="text-white">Menu</span>
          <div className="space-y-1">
            <span className="block w-6 h-0.5 bg-white"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
          </div>
        </button>
      </div>
      {/* Mobile menu, shown when toggled */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 text-white">
          <ul className="flex flex-col items-center py-4">
            <li>
              <Link
                to="/"
                className="py-2 hover:text-blue-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="py-2 hover:text-blue-400"
                onClick={(e) => {
                  handleNavClick(e, "about");
                  setIsMobileMenuOpen(false);
                }}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/resume"
                className="py-2 hover:text-blue-400"
                onClick={(e) => {
                  handleNavClick(e, "resume");
                  setIsMobileMenuOpen(false);
                }}
              >
                Resume
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className="py-2 hover:text-blue-400"
                onClick={(e) => {
                  handleNavClick(e, "services");
                  setIsMobileMenuOpen(false);
                }}
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                to="/portfolio"
                className="py-2 hover:text-blue-400"
                onClick={(e) => {
                  handleNavClick(e, "portfolio");
                  setIsMobileMenuOpen(false);
                }}
              >
                Portfolio
              </Link>
            </li>
            <li>
              <Link
                to="/recommendations"
                className="py-2 hover:text-blue-400"
                onClick={(e) => {
                  handleNavClick(e, "recommendations");
                  setIsMobileMenuOpen(false);
                }}
              >
                Recommendations
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="py-2 hover:text-blue-400"
                onClick={(e) => {
                  handleNavClick(e, "contact");
                  setIsMobileMenuOpen(false);
                }}
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                to="/blog"
                className="py-2 hover:text-blue-400"
                onClick={(e) => {
                  handleNavClick(e, "blog");
                  setIsMobileMenuOpen(false);
                }}
              >
                Blog
              </Link>
            </li>
            {user && user.role === "admin" && (
              <li>
                <Link
                  to="/admin"
                  className="py-2 hover:text-blue-400"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              </li>
            )}
            {user ? (
              <li>
                <button
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="py-2 hover:text-blue-400"
                >
                  Logout
                </button>
                <span className="text-sm text-green-300 pl-3">
                  Hi, {user.name}
                </span>
              </li>
            ) : (
              <li>
                <Link
                  to="/login"
                  className="py-2 hover:text-blue-400"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}

/* Define prop types for validation */
NavBar.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string, // User name for display
    role: PropTypes.string, // User role (e.g., "admin", "viewer")
  }), // User object, nullable
  onLogout: PropTypes.func.isRequired, // Function to handle logout
};

/* Export for use in App.js */
export default NavBar;

/* Import React for component creation and PropTypes for prop validation */
import React, { Component } from "react";
import PropTypes from "prop-types";

class ErrorBoundary extends Component {
  // Initialize state to track errors
  state = { hasError: false, error: null };

  // Catch errors in child components
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Log errors for debugging (can integrate with error reporting service)
  componentDidCatch(error, errorInfo) {
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  // Reset error state on route change
  componentDidUpdate(prevProps) {
    if (this.props.route !== prevProps.route && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI when an error occurs
      return (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-red-600">
            Something went wrong.
          </h2>
          <p className="mt-4">
            Please try refreshing the page or contact support.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      );
    }
    // Render children if no error
    return this.props.children;
  }
}

/* PropTypes for type checking */
ErrorBoundary.propTypes = {
  route: PropTypes.string, // Route path for resetting error state (optional)
  children: PropTypes.node.isRequired, // Child components to render
};

/* Default props */
ErrorBoundary.defaultProps = {
  route: "",
};

export default ErrorBoundary;

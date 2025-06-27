import React from "react";
import PropTypes from "prop-types";

const LoadingSpinner = ({
  size = "md",
  message = "Loading...",
  className = "",
}) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-12 w-12 border-[6px]",
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="flex items-center justify-center">
        <div
          className={`${sizeClasses[size]} inline-block animate-spin rounded-full border-solid border-blue-500 border-t-transparent`}
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  message: PropTypes.string,
  className: PropTypes.string,
};

export default LoadingSpinner;

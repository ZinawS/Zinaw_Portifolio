/* Import necessary dependencies */
import React, { useState, useEffect } from "react";
// import { baseURL } from "../Utility/Api";

function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [expanded, setExpanded] = useState({}); // Track expanded state for each blog

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`/api/blogs`, {
          headers: { "Content-Type": "application/json" },
        });

        const text = await response.text();

        if (!response.ok) {
          throw new Error(
            `HTTP error! Status: ${response.status}, Message: ${text}`
          );
        }

        if (!text) {
          throw new Error("Empty response from server");
        }

        const data = JSON.parse(text);
        setBlogs(Array.isArray(data.data) ? data.data : []); // Use data.data for blogs
      } catch (error) {
        console.error("Fetch blogs error:", error.message);
        setBlogs([]);
      }
    };

    fetchBlogs();
  }, []);

  // Toggle expanded state for a specific blog
  const toggleExpanded = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="blog" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">My Blog</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-gray-50 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
              <div
                className={`text-gray-600 ${
                  !expanded[blog.id] ? "line-clamp-4 overflow-hidden" : ""
                }`}
              >
                {blog.content}
              </div>
              <button
                onClick={() => toggleExpanded(blog.id)}
                className="text-blue-600 hover:text-blue-700 text-sm mt-2"
              >
                {expanded[blog.id] ? "Show Less" : "Show More"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Blog;

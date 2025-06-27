// Import necessary dependencies
import React, { useState, useEffect } from "react";
import { formatTimestamp } from "./AdminDashboard";

function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [expanded, setExpanded] = useState({}); // Track expanded state for each blog

  // Fetch blogs and users from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve JWT token from localStorage (or change to cookie/session if needed)
        const token = localStorage.getItem("token");

        // Fetch blogs
        const blogRes = await fetch(`/api/blogs`, {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const blogText = await blogRes.text();

        if (!blogRes.ok || !blogText) {
          throw new Error(
            `Blog fetch error! Status: ${blogRes.status}, Message: ${blogText}`
          );
        }

        const blogData = JSON.parse(blogText);
        setBlogs(Array.isArray(blogData.data) ? blogData.data : []);

        // Fetch users (only if token is present)
        if (token) {
          const userRes = await fetch("/api/users", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          });

          const userText = await userRes.text();

          if (!userRes.ok || !userText) {
            throw new Error(
              `User fetch error! Status: ${userRes.status}, Message: ${userText}`
            );
          }

          const userData = JSON.parse(userText);
          setUsers(Array.isArray(userData.data) ? userData.data : []);
        } else {
          console.warn("No auth token found. Users data not fetched.");
        }
      } catch (error) {
        console.error("Fetch error:", error.message);
        setBlogs([]);
        setUsers([]);
      }
    };

    fetchData();
  }, []);

  // Toggle expanded state for individual blog entries
  const toggleExpanded = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="blog" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">My Blog</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.map((blog) => {
            const author =
              users.find((user) => user.id === blog.author_id) || {};
            const authorName = author.name || "Zinaw M.";

            return (
              <div key={blog.id} className="bg-gray-50 p-6 rounded-lg shadow">
                {/* Blog Title */}
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {blog.title}
                </h3>

                {/* Blog Content rendered as HTML */}
                <div
                  className={`prose prose-sm max-w-none text-gray-700 ${
                    !expanded[blog.id] ? "line-clamp-5 overflow-hidden" : ""
                  }`}
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                {/* Meta Info */}
                <div className="text-sm text-gray-500 mt-3 space-y-1">
                  <p>
                    <span className="font-medium">Author:</span> {authorName}
                  </p>
                  <p>
                    <span className="font-medium">Posted:</span>{" "}
                    {formatTimestamp(blog.created_at)}
                  </p>
                </div>

                {/* Expand/Collapse Button */}
                <button
                  onClick={() => toggleExpanded(blog.id)}
                  className="text-blue-600 hover:underline text-sm mt-2"
                >
                  {expanded[blog.id] ? "Show Less" : "Show More"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Blog;

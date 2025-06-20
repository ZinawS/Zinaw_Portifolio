import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { baseURL } from "../Utility/Api";

function AdminDashboard() {
  const [recommendations, setRecommendations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [editRec, setEditRec] = useState(null);
  const [editBlog, setEditBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({ title: "", content: "" });
  const [formErrors, setFormErrors] = useState({ title: "", content: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async (url, setter) => {
      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        console.log(`AdminDashboard: Fetch ${url} status:`, res.status);
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
          return;
        }
        const data = await res.json();
        if (data.success) setter(data.data);
        else console.error(`Fetch ${url} failed:`, data.error);
      } catch (err) {
        console.error(`Fetch ${url} error:`, err);
      }
    };

    fetchData(`/api/admin/recommendations`, setRecommendations);
    fetchData(`/api/admin/contacts`, setContacts);
    fetchData(`/api/blogs`, setBlogs);
    fetchData(`/api/admin/users`, setUsers);
  }, [navigate]);

  useEffect(() => {
    if (editBlog) {
      setBlogForm({ title: editBlog.title, content: editBlog.content });
      setFormErrors({ title: "", content: "" });
    } else {
      setBlogForm({ title: "", content: "" });
      setFormErrors({ title: "", content: "" });
    }
  }, [editBlog]);

  const handleRecommendationUpdate = async (rec) => {
    console.log("AdminDashboard: Updating recommendation:", rec);
    try {
      const res = await fetch(
        `/api/admin/recommendations/${rec.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(rec),
        }
      );
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }
      const data = await res.json();
      if (data.success) {
        setRecommendations(
          recommendations.map((r) => (r.id === rec.id ? data.data : r))
        );
        setEditRec(null);
      } else {
        alert(
          "Failed to update recommendation: " + (data.error || "Unknown error")
        );
      }
    } catch (err) {
      console.error("Recommendation update error:", err);
      alert("Failed to update recommendation.");
    }
  };

  const handleRecommendationDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/recommendations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }
      const data = await res.json();
      if (data.success) {
        setRecommendations(recommendations.filter((r) => r.id !== id));
      } else {
        alert(
          "Failed to delete recommendation: " + (data.error || "Unknown error")
        );
      }
    } catch (err) {
      console.error("Delete recommendation error:", err);
      alert("Failed to delete recommendation.");
    }
  };

  const handleContactUpdate = async (id, role) => {
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ role }),
      });
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }
      const data = await res.json();
      if (data.success) {
        setContacts(
          contacts.map((c) => (c.id === id ? { ...c, role } : data.data))
        );
      } else {
        alert(
          "Failed to update contact role: " + (data.error || "Unknown error")
        );
      }
    } catch (err) {
      console.error("Contact update error:", err);
      alert("Failed to update contact role.");
    }
  };

  const handleContactDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }
      const data = await res.json();
      if (data.success) {
        setContacts(contacts.filter((c) => c.id !== id));
      } else {
        alert("Failed to delete contact: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Delete contact error:", err);
      alert("Failed to delete contact.");
    }
  };

  const handleUserRoleUpdate = async (id, role) => {
    console.log("AdminDashboard: Updating user role:", { id, role });
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ role }),
      });
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }
      const data = await res.json();
      if (data.success) {
        setUsers(users.map((user) => (user.id === id ? data.data : user)));
      } else {
        alert("Failed to update user role: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("User role update error:", err);
      alert("Failed to update user role.");
    }
  };

  const validateBlogForm = () => {
    const errors = {};
    if (!blogForm.title.trim()) {
      errors.title = "Title is required.";
    } else if (blogForm.title.length < 3) {
      errors.title = "Title must be at least 3 characters long.";
    }
    if (!blogForm.content.trim()) {
      errors.content = "Content is required.";
    } else if (blogForm.content.length < 10) {
      errors.content = "Content must be at least 10 characters long.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    if (!validateBlogForm()) {
      return;
    }

    const data = {
      title: blogForm.title.trim(),
      content: blogForm.content.trim(),
    };
    const method = editBlog ? "PUT" : "POST";
    const url = editBlog
      ? `/api/admin/blogs/${editBlog.id}`
      : `/api/admin/blogs`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }
      const responseData = await res.json();
      if (
        responseData.success &&
        responseData.data &&
        responseData.data.id &&
        responseData.data.title &&
        responseData.data.content
      ) {
        console.log("AdminDashboard: Blog submit response:", responseData.data);
        if (editBlog) {
          setBlogs(
            blogs.map((b) =>
              b.id === editBlog.id
                ? {
                    id: responseData.data.id,
                    title: responseData.data.title,
                    content: responseData.data.content,
                  }
                : b
            )
          );
        } else {
          setBlogs([
            {
              id: responseData.data.id,
              title: responseData.data.title,
              content: responseData.data.content,
            },
            ...blogs,
          ]);
        }
        setEditBlog(null);
        setBlogForm({ title: "", content: "" });
        setFormErrors({ title: "", content: "" });
      } else {
        alert(
          "Failed to save blog: " +
            (responseData.error || "Invalid response data")
        );
      }
    } catch (err) {
      console.error("Blog submit error:", err);
      alert("Failed to save blog.");
    }
  };

  const handleBlogDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }
      const data = await res.json();
      if (data.success) {
        setBlogs(blogs.filter((b) => b.id !== id));
      } else {
        alert("Failed to delete blog: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Delete blog error:", err);
      alert("Failed to delete blog.");
    }
  };

  const handleBlogFormChange = (e) => {
    const { name, value } = e.target;
    setBlogForm((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h2>
        <h3 className="text-2xl font-semibold mb-4">Manage Recommendations</h3>
        {editRec && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow">
            <h4 className="text-xl font-semibold mb-4">Edit Recommendation</h4>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const formEntries = Object.fromEntries(formData);
                const recommendationData = {
                  id: editRec.id,
                  ...formEntries,
                  approved: formEntries.approved === "on",
                };
                console.log(
                  "AdminDashboard: Form submission data:",
                  recommendationData
                );
                handleRecommendationUpdate(recommendationData);
              }}
            >
              <input
                type="text"
                name="name"
                defaultValue={editRec.name}
                className="w-full p-2 mb-4 border rounded"
                required
              />
              <input
                type="text"
                name="position"
                defaultValue={editRec.position}
                className="w-full p-2 mb-4 border rounded"
                required
              />
              <input
                type="text"
                name="company"
                defaultValue={editRec.company}
                className="w-full p-2 mb-4 border rounded"
                required
              />
              <textarea
                name="recommendation"
                defaultValue={editRec.recommendation}
                className="w-full p-2 mb-4 border rounded"
                rows="5"
                required
              ></textarea>
              <label className="flex items-center mb-4">
                <input
                  type="checkbox"
                  name="approved"
                  defaultChecked={editRec.approved}
                  className="mr-2"
                />
                Approved
              </label>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditRec(null)}
                className="ml-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </form>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {recommendations.map((rec) => (
            <div key={rec.id} className="bg-gray-50 p-6 rounded-lg shadow">
              <p>{rec.recommendation}</p>
              <p className="mt-4 font-bold">{rec.name}</p>
              <p className="text-gray-600">
                {rec.position}, {rec.company}
              </p>
              <p className="text-gray-600">
                Approved: {rec.approved ? "Yes" : "No"}
              </p>
              <button
                onClick={() => setEditRec(rec)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleRecommendationDelete(rec.id)}
                className="mt-4 ml-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        <h3 className="text-2xl font-semibold mb-4">Manage Contacts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {contacts.map((contact) => (
            <div key={contact.id} className="bg-gray-50 p-6 rounded-lg shadow">
              <p>
                <strong>Name:</strong> {contact.name}
              </p>
              <p>
                <strong>Email:</strong> {contact.email}
              </p>
              <p>
                <strong>Subject:</strong> {contact.subject}
              </p>
              <p>
                <strong>Message:</strong> {contact.message}
              </p>
              <p>
                <strong>Role:</strong> {contact.role}
              </p>
              <select
                value={contact.role}
                onChange={(e) =>
                  handleContactUpdate(contact.id, e.target.value)
                }
                className="mt-4 p-2 border rounded"
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
              </select>
              <button
                onClick={() => handleContactDelete(contact.id)}
                className="mt-4 ml-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        <h3 className="text-2xl font-semibold mb-4">Manage Users</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {users.map((user) => (
            <div key={user.id} className="bg-gray-50 p-6 rounded-lg shadow">
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Role:</strong> {user.role}
              </p>
              <select
                value={user.role}
                onChange={(e) => handleUserRoleUpdate(user.id, e.target.value)}
                className="mt-4 p-2 border rounded"
              >
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
          ))}
        </div>
        <h3 className="text-2xl font-semibold mb-4">Manage Blogs</h3>
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow mb-12">
          <h4 className="text-xl font-semibold mb-4">
            {editBlog ? "Edit Blog" : "Create Blog"}
          </h4>
          <form onSubmit={handleBlogSubmit}>
            <div className="mb-4">
              <input
                type="text"
                name="title"
                value={blogForm.title}
                onChange={handleBlogFormChange}
                placeholder="Title"
                className={`w-full p-2 border rounded ${
                  formErrors.title ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {formErrors.title && (
                <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
              )}
            </div>
            <div className="mb-4">
              <textarea
                name="content"
                value={blogForm.content}
                onChange={handleBlogFormChange}
                placeholder="Content"
                className={`w-full p-2 border rounded ${
                  formErrors.content ? "border-red-500" : "border-gray-300"
                }`}
                rows="5"
                required
              ></textarea>
              {formErrors.content && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.content}
                </p>
              )}
            </div>
            <div className="flex">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save
              </button>
              {editBlog && (
                <button
                  type="button"
                  onClick={() => {
                    setEditBlog(null);
                    setBlogForm({ title: "", content: "" });
                    setFormErrors({ title: "", content: "" });
                  }}
                  className="ml-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-gray-50 p-6 rounded-lg shadow">
              <h4 className="font-bold">{blog.title}</h4>
              <p className="text-gray-600">{blog.content}</p>
              <button
                onClick={() => setEditBlog(blog)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleBlogDelete(blog.id)}
                className="mt-4 ml-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;

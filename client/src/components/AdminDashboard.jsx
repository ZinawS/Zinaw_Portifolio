/**
 * @file AdminDashboard.jsx
 * @description Admin dashboard component for managing recommendations, contacts, users, and blogs with rich text editing and syntax highlighting.
 * @author [Your Name]
 */

/**
 * Importing necessary dependencies for the AdminDashboard component.
 * - React hooks for state management and side effects.
 * - useNavigate for routing to login on authentication errors.
 * - ReactQuill, Quill, and Delta for rich text editing with custom formats.
 * - LoadingSpinner for displaying loading states.
 * - baseURL for API endpoint configuration.
 * - highlight.js for syntax highlighting in code blocks.
 */
import React, {
  useReducer,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill, { Quill } from "react-quill";
import Delta from "quill-delta";
import "react-quill/dist/quill.snow.css";
import hljs from "highlight.js";
import "highlight.js/styles/vs2015.css"; // ← This works
import LoadingSpinner from "../components/LoadingSpinner";
// import { baseURL } from "../Utility/Api";

// Configure highlight.js for syntax highlighting
hljs.configure({ languages: ["javascript", "python", "html", "css", "java"] });

/**
 * Custom Code Block for Quill Editor with highlight.js integration.
 * @class
 */
const CodeBlock = Quill.import("formats/code-block");
class CustomCodeBlock extends CodeBlock {
  /**
   * Creates a code block DOM node with proper classes and attributes.
   * @param {string} value - The code content.
   * @returns {HTMLElement} The created DOM node.
   */
  static create(value) {
    const node = super.create();
    node.innerHTML = value || "";
    node.classList.add("ql-syntax", "hljs");
    node.setAttribute("data-language", "javascript"); // Default language
    return node;
  }

  /**
   * Retrieves the content of a code block node.
   * @param {HTMLElement} domNode - The DOM node.
   * @returns {string} The inner HTML content.
   */
  static value(domNode) {
    return domNode.innerHTML;
  }

  /**
   * Retrieves formatting attributes for the code block.
   * @param {HTMLElement} domNode - The DOM node.
   * @returns {Object} Formatting attributes.
   */
  static formats(domNode) {
    return {
      "code-block": true,
      language: domNode.getAttribute("data-language") || "javascript",
    };
  }
}
CustomCodeBlock.blotName = "code-block";
CustomCodeBlock.tagName = "pre";

/**
 * Custom Link format to ensure URLs have proper protocol.
 * @class
 */
const CustomLink = Quill.import("formats/link");
class SafeLink extends CustomLink {
  /**
   * Sanitizes URLs to ensure they start with a valid protocol.
   * @param {string} url - The input URL.
   * @returns {string} The sanitized URL.
   */
  static sanitize(url) {
    const sanitized = super.sanitize(url);
    if (sanitized && !sanitized.startsWith("http")) {
      return `https://${sanitized}`;
    }
    return sanitized;
  }
}

// Register custom formats with Quill
Quill.register(CustomCodeBlock, true);
Quill.register(SafeLink, true);

/**
 * CustomToolbar component for the Quill editor.
 * @param {Object} props - Component props.
 * @param {React.MutableRefObject} props.editorRef - Reference to the Quill editor.
 * @returns {JSX.Element} The toolbar component.
 */
const CustomToolbar = ({ editorRef }) => {
  const [language, setLanguage] = useState("javascript"); // Add state for controlled select
  const colorOptions = useMemo(
    () => [
      "#000000",
      "#e60000",
      "#ff9900",
      "#ffff00",
      "#008a00",
      "#0066cc",
      "#9933ff",
      "#ffffff",
      "#facccc",
      "#ffebcc",
      "#ffffcc",
      "#cce8cc",
      "#cce0f5",
      "#ebd6ff",
      "#bbbbbb",
      "#f06666",
      "#ffc266",
      "#ffff66",
      "#66b966",
      "#66a3e0",
      "#c285ff",
      "#888888",
      "#a10000",
      "#b26b00",
      "#b2b200",
      "#006100",
      "#0047b2",
      "#6b24b2",
      "#444444",
      "#5c0000",
      "#663d00",
      "#666600",
      "#003700",
      "#002966",
      "#3d1466",
    ],
    []
  );

  const insertCodeBlock = useCallback(() => {
    const editor = editorRef.current?.getEditor();
    const range = editor?.getSelection();
    if (range) {
      editor.insertText(range.index, "\n");
      editor.insertText(range.index + 1, "");
      editor.formatLine(range.index + 1, 1, { "code-block": true, language });
      editor.setSelection(range.index + 1, 0);
    }
  }, [editorRef, language]);

  return (
    <div id="toolbar" className="border-b border-gray-200 flex items-center">
      <span className="ql-formats">
        <select
          className="ql-header"
          title="Heading"
          aria-label="Heading level"
        >
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="">Normal</option> {/* Remove selected attribute */}
        </select>
        <button
          className="ql-blockquote"
          title="Blockquote"
          aria-label="Blockquote"
        ></button>
      </span>
      <span className="ql-formats">
        <button className="ql-bold" title="Bold" aria-label="Bold"></button>
        <button
          className="ql-italic"
          title="Italic"
          aria-label="Italic"
        ></button>
        <button
          className="ql-underline"
          title="Underline"
          aria-label="Underline"
        ></button>
        <button
          className="ql-strike"
          title="Strikethrough"
          aria-label="Strikethrough"
        ></button>
      </span>
      <span className="ql-formats">
        <button
          className="ql-list"
          value="ordered"
          title="Ordered List"
          aria-label="Ordered list"
        ></button>
        <button
          className="ql-list"
          value="bullet"
          title="Bullet List"
          aria-label="Bullet list"
        ></button>
        <button
          className="ql-code-block"
          onClick={insertCodeBlock}
          title="Code Block"
          aria-label="Insert code block"
        >
          <svg viewBox="0 0 18 18">
            <polygon points="6,12 4,10 7.5,6.5 4,3 6,1 11,6.5"></polygon>
            <polygon points="12,12 14,10 10.5,6.5 14,3 12,1 7,6.5"></polygon>
          </svg>
        </button>
        <select
          id="language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          title="Code Language"
          aria-label="Select code language"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="java">Java</option>
        </select>
      </span>
      <span className="ql-formats">
        <select className="ql-color" title="Text Color" aria-label="Text color">
          <option value="default"></option>
          {colorOptions.map((color) => (
            <option key={color} value={color}></option>
          ))}
        </select>
        <select
          className="ql-background"
          title="Background Color"
          aria-label="Background color"
        >
          <option value="default"></option>
          {colorOptions.map((color) => (
            <option key={color} value={color}></option>
          ))}
        </select>
      </span>
      <span className="ql-formats">
        <button
          className="ql-link"
          title="Link"
          aria-label="Insert link"
        ></button>
      </span>
      <span className="ql-formats">
        <button
          className="ql-clean"
          title="Clear Formatting"
          aria-label="Clear formatting"
        ></button>
      </span>
    </div>
  );
};

/**
 * BlogEditor component for rich text editing with ReactQuill.
 * @param {Object} props - Component props.
 * @param {string} props.title - Blog title.
 * @param {string} props.content - Blog content.
 * @param {Function} props.onChange - Callback for title/content changes.
 * @returns {JSX.Element} The blog editor component.
 */
const BlogEditor = ({ title, content, onChange }) => {
  const quillRef = useRef(null);
  const editorContainerRef = useRef(null);

  const quillModules = useMemo(
    () => ({
      syntax: {
        highlight: (text) => {
          try {
            return hljs.highlightAuto(text).value;
          } catch (error) {
            console.warn("Highlight.js error:", error);
            return text;
          }
        },
      },
      toolbar: {
        container: "#toolbar",
        handlers: {},
      },
      clipboard: {
        matchVisual: false,
        matchers: [
          [
            "IMG",
            (node, delta) => {
              return delta.compose(
                new Delta().retain(delta.length(), {
                  image: node.getAttribute("src"),
                })
              );
            },
          ],
        ],
      },
      history: {
        delay: 1000,
        maxStack: 500,
        userOnly: true,
      },
    }),
    []
  );

  const handleTitleChange = useCallback(
    (e) => {
      onChange({ title: e.target.value, content });
    },
    [content, onChange]
  );

  const handleContentChange = useCallback(
    (value) => {
      onChange({ title, content: value });
    },
    [title, onChange]
  );

  // Log ref to debug findDOMNode issue
  useEffect(() => {
    if (editorContainerRef.current) {
      // console.log("Editor container ref:", editorContainerRef.current);
    }
  }, []);

  return (
    <div className="mb-12 bg-white border border-gray-300 rounded-md">
      <input
        type="text"
        value={title || ""}
        onChange={handleTitleChange}
        placeholder="Blog Title"
        className="w-full p-3 mb-4 border-b border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-t-md"
        aria-label="Blog title editor"
      />
      <div className="h-64" ref={editorContainerRef}>
        <CustomToolbar editorRef={quillRef} />
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={content}
          onChange={handleContentChange}
          modules={quillModules}
          formats={[
            "header",
            "bold",
            "italic",
            "underline",
            "strike",
            "list",
            "bullet",
            "link",
            "code-block",
            "color",
            "background",
            "image",
            "blockquote",
          ]}
          placeholder="Write your blog content here..."
          className="h-[calc(16rem-40px)]"
          aria-label="Blog content editor"
        />
      </div>
    </div>
  );
};

/**
 * Initial state for the reducer.
 * @type {Object}
 */
const initialState = {
  recommendations: [],
  contacts: [],
  users: [],
  blogs: [],
  editRec: null,
  editBlog: null,
  blogForm: { title: "", content: "" },
  formErrors: { title: "", content: "" },
  isLoading: false,
  error: null,
};

/**
 * Reducer function to manage state updates.
 * @param {Object} state - Current state.
 * @param {Object} action - Action to perform.
 * @returns {Object} New state.
 */
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_STATE":
      return { ...state, ...action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
};

/**
 * Utility function to strip HTML and truncate text at a word boundary.
 * @param {string} title - The title text.
 * @param {string} content - The content text.
 * @param {number} maxLength - Maximum length of the combined text.
 * @returns {Object} Object containing truncated text and truncation flag.
 */
const truncateText = (title, content, maxLength) => {
  const div = document.createElement("div");
  div.innerHTML = content || "";
  const contentText = div.textContent || div.innerText || "";
  const combinedText = title ? `${title}: ${contentText}` : contentText;
  if (combinedText.length <= maxLength)
    return { text: combinedText, truncated: false };
  const truncated = combinedText.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return {
    text:
      lastSpace > 0 ? truncated.slice(0, lastSpace) + "..." : truncated + "...",
    truncated: true,
  };
};

/**
 * Utility function to format a timestamp into a human-readable format.
 * @param {string} timestamp - The timestamp to format.
 * @returns {string} Formatted date string or "Unknown" if invalid.
 */
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return "Unknown";
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "Unknown";
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    console.warn("Invalid timestamp format:", timestamp, error);
    return "Unknown";
  }
};

/**
 * Main AdminDashboard component.
 * - Manages recommendations, contacts, users, and blogs.
 * - Restricts blog edit/delete actions to authors or admins.
 * - Enhances code block rendering with syntax highlighting.
 * @returns {JSX.Element} The admin dashboard component.
 */
function AdminDashboard() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState({});

  const {
    recommendations,
    contacts,
    users,
    blogs,
    editRec,
    editBlog,
    blogForm,
    formErrors,
    isLoading,
    error,
  } = state;

  // Get current user ID and role from localStorage
  const currentUserId = useMemo(() => {
    const userId = localStorage.getItem("userId");
    const parsedId = userId ? Number(userId) : null;
    // console.log("Parsed currentUserId:", parsedId);
    return parsedId;
  }, []);
  const userRole = useMemo(() => {
    const role = localStorage.getItem("userRole") || "viewer";
    // console.log("Parsed userRole:", role);
    return role;
  }, []);

  /**
   * Toggles the expanded state of an item.
   * @param {string} itemType - Type of item (e.g., "blog", "recommendation").
   * @param {number} id - Item ID.
   */
  const toggleExpanded = useCallback((itemType, id) => {
    setExpanded((prev) => ({
      ...prev,
      [`${itemType}-${id}`]: !prev[`${itemType}-${id}`],
    }));
  }, []);

  /**
   * Handles API errors and redirects to login on auth failure.
   * @param {Error} error - The error object.
   * @param {string} context - The operation context (e.g., "fetching data").
   */
  const handleApiError = useCallback(
    async (error, context) => {
      let errorMessage = error.message;
      if (error.response) {
        try {
          const errorData = await error.response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          console.error(`Failed to parse error response for ${context}:`, e);
        }
      }
      console.error(`${context} error:`, error);
      dispatch({
        type: "SET_ERROR",
        payload: errorMessage || `Failed to ${context}`,
      });
      dispatch({ type: "SET_LOADING", payload: false });

      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        navigate("/login", { replace: true });
      }
    },
    [navigate]
  );

  /**
   * Fetches data for recommendations, contacts, blogs, and users.
   */
  const fetchData = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const endpoints = [
        `/api/admin/recommendations`,
        `/api/admin/contacts`,
        `/api/blogs`,
        `/api/admin/users`,
      ];

      const responses = await Promise.all(
        endpoints.map((url) =>
          fetch(url, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          })
        )
      );

      const data = await Promise.all(
        responses.map(async (res, index) => {
          if (!res.ok)
            throw new Error(
              `HTTP error! status: ${res.status} for endpoint ${endpoints[index]}`
            );
          const json = await res.json();
          // console.log(`Response from ${endpoints[index]}:`, json);

          return json;
        })
      );

      const sanitizedBlogs = (data[2].data || [])
        .filter(
          (blog) =>
            blog &&
            typeof blog === "object" &&
            Number.isInteger(blog.id) &&
            blog.id > 0 &&
            typeof blog.title === "string" &&
            typeof blog.content === "string" &&
            (typeof blog.author_id === "number" || blog.author_id == null) &&
            (typeof blog.created_at === "string" || blog.created_at == null)
        )
        .map((blog) => {
          const authorId = Number(blog.author_id) || null;

          return {
            ...blog,
            title: blog.title || "Untitled",
            content: blog.content || "<p></p>",
            author_id: authorId,
            created_at: blog.created_at || null,
          };
        });

      dispatch({
        type: "SET_STATE",
        payload: {
          recommendations: data[0].data || [],
          contacts: data[1].data || [],
          blogs: sanitizedBlogs,
          users: data[3].data || [],
          isLoading: false,
          error: null,
        },
      });
    } catch (error) {
      if (error.name !== "AbortError") {
        handleApiError(error, "fetching data");
      }
    }
  }, [handleApiError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * Updates a recommendation.
   * @param {Object} rec - Recommendation data.
   */
  const handleRecommendationUpdate = useCallback(
    async (rec) => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const response = await fetch(
          `/api/admin/recommendations/${rec.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(rec),
            credentials: "include",
          }
        );

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        dispatch({
          type: "SET_STATE",
          payload: {
            recommendations: recommendations.map((r) =>
              r.id === rec.id ? data.data : r
            ),
            editRec: null,
            isLoading: false,
          },
        });
      } catch (error) {
        handleApiError(error, "updating recommendation");
      }
    },
    [handleApiError, recommendations]
  );

  /**
   * Deletes a recommendation.
   * @param {number} id - Recommendation ID.
   */
  const handleRecommendationDelete = useCallback(
    async (id) => {
      if (
        !window.confirm("Are you sure you want to delete this recommendation?")
      )
        return;

      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const response = await fetch(
          `/api/admin/recommendations/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            credentials: "include",
          }
        );

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        dispatch({
          type: "SET_STATE",
          payload: {
            recommendations: recommendations.filter((r) => r.id !== id),
            isLoading: false,
          },
        });
      } catch (error) {
        handleApiError(error, "deleting recommendation");
      }
    },
    [handleApiError, recommendations]
  );

  /**
   * Updates a contact's role.
   * @param {number} id - Contact ID.
   * @param {string} role - New role.
   */
  const handleContactUpdate = useCallback(
    async (id, role) => {
      if (!["viewer", "editor", "admin"].includes(role)) {
        dispatch({ type: "SET_ERROR", payload: "Invalid role selected" });
        return;
      }

      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const response = await fetch(`/api/admin/contacts/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ role }),
          credentials: "include",
        });

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        dispatch({
          ztype: "SET_STATE",
          payload: {
            contacts: contacts.map((c) => (c.id === id ? { ...c, role } : c)),
            isLoading: false,
          },
        });
      } catch (error) {
        handleApiError(error, "updating contact");
      }
    },
    [handleApiError, contacts]
  );

  /**
   * Deletes a contact.
   * @param {number} id - Contact ID.
   */
  
  const handleContactDelete = useCallback(
    async (id) => {
      if (!window.confirm("Are you sure you want to delete this contact?"))
        return;

      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const response = await fetch(`/api/admin/contacts/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorText}`
          );
        }

        dispatch({
          type: "SET_STATE",
          payload: {
            contacts: contacts.filter((c) => c.id !== id),
            isLoading: false,
          },
        });
      } catch (error) {
        handleApiError(error, "deleting contact");
      }
    },
    [handleApiError, contacts]
  );

  /**
   * Updates a user's role.
   * @param {number} id - User ID.
   * @param {string} role - New role.
   */
  const handleUserUpdate = useCallback(
    async (id, role) => {
      if (!["viewer", "editor", "admin"].includes(role)) {
        dispatch({ type: "SET_ERROR", payload: "Invalid role selected" });
        return;
      }

      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const response = await fetch(`/api/admin/users/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ role }),
          credentials: "include",
        });

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        dispatch({
          type: "SET_STATE",
          payload: {
            users: users.map((u) => (u.id === id ? { ...u, role } : u)),
            isLoading: false,
          },
        });
      } catch (error) {
        handleApiError(error, "updating user");
      }
    },
    [handleApiError, users]
  );

  /**
   * Deletes a user.
   * @param {number} id - User ID.
   */
  const handleUserDelete = useCallback(
    async (id) => {
      if (!window.confirm("Are you sure you want to delete this user?")) return;

      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const response = await fetch(`/api/admin/users/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        });

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        dispatch({
          type: "SET_STATE",
          payload: {
            users: users.filter((u) => u.id !== id),
            isLoading: false,
          },
        });
      } catch (error) {
        handleApiError(error, "deleting user");
      }
    },
    [handleApiError, users]
  );

  /**
   * Handles changes to blog title or content.
   * @param {Object} param0 - New title and content.
   * @param {string} param0.title - Blog title.
   * @param {string} param0.content - Blog content.
   */
  const handleBlogChange = useCallback(({ title, content }) => {
    dispatch({
      type: "SET_STATE",
      payload: {
        blogForm: { title: title || "", content: content || "" },
        formErrors: { title: "", content: "" },
      },
    });
  }, []);

  /**
   * Submits a new or updated blog post.
   * @param {Event} e - Form submission event.
   */
  const handleBlogSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const errors = { title: "", content: "" };
      if (!blogForm.title.trim()) errors.title = "Title is required";
      if (!blogForm.content.trim() || blogForm.content === "<p><br></p>")
        errors.content = "Content is required";
      if (blogForm.content.length < 50)
        errors.content = "Content must be at least 50 characters";

      if (Object.values(errors).some((error) => error)) {
        dispatch({ type: "SET_STATE", payload: { formErrors: errors } });
        return;
      }

      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const method = editBlog ? "PUT" : "POST";
        const url = editBlog
          ? `/api/admin/blogs/${editBlog.id}`
          : `/api/admin/blogs`;

        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title: blogForm.title.trim(),
            content: blogForm.content,
            contentType: "html",
            author_id: currentUserId, // Ensure author_id is sent for new blogs
          }),
          credentials: "include",
        });

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        dispatch({
          type: "SET_STATE",
          payload: {
            blogs: editBlog
              ? blogs.map((b) => (b.id === editBlog.id ? data.data : b))
              : [data.data, ...blogs],
            blogForm: editBlog ? blogForm : { title: "", content: "" },
            editBlog: null,
            isLoading: false,
          },
        });
      } catch (error) {
        handleApiError(error, "saving blog");
      }
    },
    [handleApiError, editBlog, blogForm, blogs, currentUserId]
  );

  /**
   * Deletes a blog post.
   * @param {number} id - Blog ID.
   */
  const handleBlogDelete = useCallback(
    async (id) => {
      if (!window.confirm("Are you sure you want to delete this blog?")) return;

      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const response = await fetch(`/api/admin/blogs/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        });

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        dispatch({
          type: "SET_STATE",
          payload: {
            blogs: blogs.filter((blog) => blog.id !== id),
            editBlog: editBlog?.id === id ? null : editBlog,
            blogForm:
              editBlog?.id === id ? { title: "", content: "" } : blogForm,
            isLoading: false,
          },
        });
      } catch (error) {
        handleApiError(error, "deleting blog");
      }
    },
    [handleApiError, editBlog, blogForm, blogs]
  );

  // Apply syntax highlighting to rendered code blocks
  useEffect(() => {
    document.querySelectorAll("pre.ql-syntax").forEach((block) => {
      try {
        hljs.highlightElement(block);
      } catch (error) {
        console.warn("Failed to highlight code block:", error);
      }
    });
  }, [blogs]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <LoadingSpinner size="lg" message="Loading Dashboard..." />
      </div>
    );
  }

  return (
    <section
      className="py-12 bg-gray-50 min-h-screen"
      aria-label="Admin Dashboard"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Admin Dashboard
        </h2>

        {error && (
          <div
            className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded"
            role="alert"
          >
            <div className="flex justify-between items-center">
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => dispatch({ type: "CLEAR_ERROR" })}
                className="text-red-700 hover:text-red-900"
                aria-label="Close error message"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Recommendations Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">
            Manage Recommendations
          </h3>

          {editRec && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h4 className="text-xl font-semibold mb-4 text-gray-800">
                Edit Recommendation
              </h4>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const recommendationData = {
                    id: editRec.id,
                    name: formData.get("name"),
                    position: formData.get("position"),
                    company: formData.get("company"),
                    recommendation: formData.get("recommendation"),
                    approved: formData.get("approved") === "on",
                  };
                  handleRecommendationUpdate(recommendationData);
                }}
              >
                <input
                  type="text"
                  name="name"
                  defaultValue={editRec.name}
                  className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  aria-label="Recommendation name"
                />
                <input
                  type="text"
                  name="position"
                  defaultValue={editRec.position}
                  className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  aria-label="Recommendation position"
                />
                <input
                  type="text"
                  name="company"
                  defaultValue={editRec.company}
                  className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  aria-label="Recommendation company"
                />
                <textarea
                  name="recommendation"
                  defaultValue={editRec.recommendation}
                  className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[150px]"
                  required
                  aria-label="Recommendation text"
                />
                <label className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    name="approved"
                    defaultChecked={editRec.approved}
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                    aria-label="Approve recommendation"
                  />
                  <span className="ml-2 text-gray-700">Approved</span>
                </label>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    disabled={isLoading}
                    aria-label="Save recommendation"
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      dispatch({
                        type: "SET_STATE",
                        payload: { editRec: null },
                      })
                    }
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
                    disabled={isLoading}
                    aria-label="Cancel recommendation edit"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec) => {
              const isExpanded = expanded[`recommendation-${rec.id}`];
              const { text, truncated } = truncateText(
                rec.recommendation,
                "",
                300
              );
              return (
                <div key={rec.id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="mb-4 text-gray-700">
                    {isExpanded ? rec.recommendation : text}
                    {truncated && (
                      <button
                        onClick={() => toggleExpanded("recommendation", rec.id)}
                        className="text-blue-600 hover:underline text-sm ml-2"
                        aria-label={
                          isExpanded
                            ? `Collapse recommendation by ${rec.name}`
                            : `Expand recommendation by ${rec.name}`
                        }
                      >
                        {isExpanded ? "Show Less" : "Show More"}
                      </button>
                    )}
                  </div>
                  <p className="font-semibold text-gray-800">{rec.name}</p>
                  <p className="text-gray-600">
                    {rec.position}, {rec.company}
                  </p>
                  <p
                    className={`text-sm ${rec.approved ? "text-green-600" : "text-yellow-600"}`}
                  >
                    {rec.approved ? "Approved" : "Pending Approval"}
                  </p>
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() =>
                        dispatch({
                          type: "SET_STATE",
                          payload: { editRec: rec },
                        })
                      }
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm disabled:opacity-50"
                      disabled={isLoading}
                      aria-label={`Edit recommendation by ${rec.name}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRecommendationDelete(rec.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm disabled:opacity-50"
                      disabled={isLoading}
                      aria-label={`Delete recommendation by ${rec.name}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contacts Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">
            Manage Contacts
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contacts.map((contact) => {
              const isExpanded = expanded[`contact-${contact.id}`];
              const { text: messageText, truncated: messageTruncated } =
                truncateText("", contact.message || "", 300);
              const { text: subjectText, truncated: subjectTruncated } =
                truncateText("", contact.subject || "", 300);
              return (
                <div
                  key={contact.id}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {contact.name || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {contact.email}
                      </a>
                    </p>
                    <p>
                      <span className="font-medium">Subject:</span>{" "}
                      {isExpanded ? contact.subject || "N/A" : subjectText}
                      {subjectTruncated && (
                        <button
                          onClick={() => toggleExpanded("contact", contact.id)}
                          className="text-blue-600 hover:underline text-sm ml-2"
                          aria-label={
                            isExpanded
                              ? `Collapse subject for ${contact.email}`
                              : `Expand subject for ${contact.email}`
                          }
                        >
                          {isExpanded ? "Show Less" : "Show More"}
                        </button>
                      )}
                    </p>
                    <p className="whitespace-pre-wrap">
                      <span className="font-medium">Message:</span>{" "}
                      {isExpanded ? contact.message || "N/A" : messageText}
                      {messageTruncated && (
                        <button
                          onClick={() => toggleExpanded("contact", contact.id)}
                          className="text-blue-600 hover:underline text-sm ml-2"
                          aria-label={
                            isExpanded
                              ? `Collapse message for ${contact.email}`
                              : `Expand message for ${contact.email}`
                          }
                        >
                          {isExpanded ? "Show Less" : "Show More"}
                        </button>
                      )}
                    </p>
                    <p>
                      <span className="font-medium">Role:</span>{" "}
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          contact.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : contact.role === "editor"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {contact.role}
                      </span>
                    </p>
                  </div>

                  <div className="mt-4 space-y-2">
                    <select
                      value={contact.role}
                      onChange={(e) =>
                        handleContactUpdate(contact.id, e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isLoading}
                      aria-label={`Change role for ${contact.email}`}
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      onClick={() => handleContactDelete(contact.id)}
                      className="w-full px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm disabled:opacity-50"
                      disabled={isLoading}
                      aria-label={`Delete contact ${contact.email}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Users Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">
            Manage Users
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => {
              const isExpanded = expanded[`user-${user.id}`];
              const { text: nameText, truncated: nameTruncated } = truncateText(
                user.name || "",
                "",
                300
              );
              const { text: emailText, truncated: emailTruncated } =
                truncateText("", user.email, 300);
              return (
                <div
                  key={user.id}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {isExpanded ? user.name || "N/A" : nameText}
                      {nameTruncated && (
                        <button
                          onClick={() => toggleExpanded("user", user.id)}
                          className="text-blue-600 hover:underline text-sm ml-2"
                          aria-label={
                            isExpanded
                              ? `Collapse name for ${user.email}`
                              : `Expand name for ${user.email}`
                          }
                        >
                          {isExpanded ? "Show Less" : "Show More"}
                        </button>
                      )}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      <a
                        href={`mailto:${user.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {isExpanded ? user.email : emailText}
                      </a>
                      {emailTruncated && (
                        <button
                          onClick={() => toggleExpanded("user", user.id)}
                          className="text-blue-600 hover:underline text-sm ml-2"
                          aria-label={
                            isExpanded
                              ? `Collapse email for ${user.email}`
                              : `Expand email for ${user.email}`
                          }
                        >
                          {isExpanded ? "Show Less" : "Show More"}
                        </button>
                      )}
                    </p>
                    <p>
                      <span className="font-medium">Role:</span>{" "}
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : user.role === "editor"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </p>
                  </div>

                  <div className="mt-4 space-y-2">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleUserUpdate(user.id, e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isLoading}
                      aria-label={`Change role for ${user.email}`}
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      onClick={() => handleUserDelete(user.id)}
                      className="w-full px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm disabled:opacity-50"
                      disabled={isLoading}
                      aria-label={`Delete user ${user.email}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Blogs Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-6 text-gray-700 text-center md:text-left">
            Manage Blogs
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Blog Editor Form */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-4 text-gray-800">
                {editBlog ? "Edit Blog" : "Create New Blog"}
              </h4>
              <form onSubmit={handleBlogSubmit}>
                <div className="mb-4">
                  <BlogEditor
                    title={blogForm.title}
                    content={blogForm.content}
                    onChange={handleBlogChange}
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-sm text-red-600" role="alert">
                      {formErrors.title}
                    </p>
                  )}
                  {formErrors.content && (
                    <p className="mt-1 text-sm text-red-600" role="alert">
                      {formErrors.content}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    disabled={isLoading}
                    aria-label={editBlog ? "Update blog" : "Create blog"}
                  >
                    {isLoading ? "Saving..." : "Save Blog"}
                  </button>

                  {editBlog && (
                    <button
                      type="button"
                      onClick={() =>
                        dispatch({
                          type: "SET_STATE",
                          payload: {
                            editBlog: null,
                            blogForm: { title: "", content: "" },
                          },
                        })
                      }
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
                      disabled={isLoading}
                      aria-label="Cancel blog edit"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Blog Cards Section */}
            <div className="space-y-6">
              {(blogs || []).map((blog) => {
                if (!blog || !blog.id) return null;

                const isExpanded = expanded[`blog-${blog.id}`];
                const { text: previewText, truncated } = truncateText(
                  blog.title,
                  blog.content,
                  300
                );
                const author = users.find((user) => user.id === blog.author_id);
                const authorName = author ? author.name : "Unknown";
                const canEdit =
                  (currentUserId && blog.author_id === currentUserId) ||
                  userRole === "admin" ||
                  userRole === "editor";

                return (
                  <div
                    key={blog.id}
                    className="bg-white p-6 rounded-lg shadow-md"
                  >
                    <h4 className="font-bold text-lg mb-2 text-gray-800">
                      {blog.title}
                    </h4>

                    <div
                      className="ql-editor p-0 border-0 prose max-w-none text-gray-600"
                      dangerouslySetInnerHTML={{
                        __html: isExpanded ? blog.content : previewText,
                      }}
                      aria-label={`Blog preview: ${blog.title}`}
                    />

                    {truncated && (
                      <button
                        onClick={() => toggleExpanded("blog", blog.id)}
                        className="text-blue-600 hover:underline text-sm mt-2"
                        aria-label={
                          isExpanded
                            ? `Collapse blog ${blog.title}`
                            : `Expand blog ${blog.title}`
                        }
                      >
                        {isExpanded ? "Show Less" : "Show More"}
                      </button>
                    )}

                    <div className="text-sm text-gray-500 mt-3 space-y-1">
                      <p>
                        <span className="font-medium">Author:</span>{" "}
                        {authorName}
                      </p>
                      <p>
                        <span className="font-medium">Posted:</span>{" "}
                        {formatTimestamp(blog.created_at)}
                      </p>
                    </div>

                    {canEdit && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          onClick={() =>
                            dispatch({
                              type: "SET_STATE",
                              payload: {
                                editBlog: blog,
                                blogForm: {
                                  title: blog.title || "",
                                  content: blog.content || "<p></p>",
                                },
                              },
                            })
                          }
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm disabled:opacity-50"
                          disabled={isLoading}
                          aria-label={`Edit blog ${blog.title}`}
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleBlogDelete(blog.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm disabled:opacity-50"
                          disabled={isLoading}
                          aria-label={`Delete blog ${blog.title}`}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

AdminDashboard.displayName = "AdminDashboard";

export default AdminDashboard;

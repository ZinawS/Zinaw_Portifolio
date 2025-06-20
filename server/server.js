/**
 * Server Configuration and Initialization
 *
 * This Express server includes:
 * - MySQL database connection pool
 * - Authentication with JWT and bcrypt
 * - Password reset functionality
 * - Contact form and recommendation submissions
 * - Blog management
 * - Admin endpoints for user, contact, recommendation, and blog management
 * - Rate limiting for sensitive endpoints
 * - CORS configuration
 * - Error handling
 *
 * Dependencies:
 * - express: Web framework
 * - mysql2: MySQL database client
 * - nodemailer: Email service
 * - bcrypt: Password hashing
 * - jsonwebtoken: JWT authentication
 * - crypto: Token generation
 * - dotenv: Environment variables
 * - express-rate-limit: Rate limiting
 * - cors: Cross-Origin Resource Sharing
 * 
 */

require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const rateLimit = require("express-rate-limit");
const path = require("path");

const app = express();

// Middleware Configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, "../client/build")));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Handle React routing, return all requests to React app
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../FrontEnd/build", "index.html"));
// });
// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Rate limiter for password reset requests
const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: "Too many requests, please try again later",
});

// Database Configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

console.log("Database config:", dbConfig); // Debug DB config
const pool = mysql.createPool(dbConfig);

// Initialize Database Tables
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();

    // Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'editor', 'viewer') DEFAULT 'viewer',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Password reset tokens table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token VARCHAR(255) NOT NULL,
        expires_at DATETIME NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Recommendations table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS recommendations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        position VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        recommendation TEXT NOT NULL,
        approved BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Contact submissions table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        role ENUM('editor', 'viewer') DEFAULT 'viewer',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Blogs table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Clean up expired tokens
    await connection.query(
      "DELETE FROM password_reset_tokens WHERE expires_at < NOW() OR used = TRUE"
    );

    connection.release();
    console.log("Database tables initialized and expired tokens cleaned up");
  } catch (err) {
    console.error("Database initialization error:", err);
    process.exit(1);
  }
}

// Email Service Configuration
async function initializeEmailService() {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
    });

    await transporter.verify();
    console.log("Email service ready");
    return transporter;
  } catch (err) {
    console.error("Email service initialization failed:", err);
    throw err;
  }
}

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ error: "Admin access required" });
  next();
};

// API Endpoints

// User Registration
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res
      .status(400)
      .json({ error: "Name, email, and password required" });

  try {
    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existingUsers.length > 0)
      return res.status(400).json({ error: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'viewer')",
      [name, email, hashedPassword]
    );
    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// User Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  try {
    const [users] = await pool.query(
      "SELECT id, name, email, password, role FROM users WHERE email = ?",
      [email]
    );
    if (users.length === 0)
      return res.status(401).json({ error: "Invalid credentials" });

    const user = users[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: `Welcome back, ${user.name || user.email}!`,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Failed to login" });
  }
});

// Password Reset Request
app.post("/api/password-reset", resetLimiter, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ error: "Invalid email format" });

  try {
    const [users] = await pool.query(
      "SELECT id, name FROM users WHERE email = ?",
      [email]
    );
    if (users.length === 0)
      return res.json({
        success: true,
        message: "If an account exists, a reset link has been sent.",
      });

    const user = users[0];
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await pool.query(
      "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
      [user.id, token, expiresAt]
    );

    if (app.locals.transporter) {
      const resetUrl = `${
        process.env.FRONTEND_URL || "http://localhost:3001"
      }/reset-password/${token}`;
      console.log("Sending reset email to:", email, "URL:", resetUrl); // Debug
      try {
        await app.locals.transporter.sendMail({
          from: `"Portfolio System" <${process.env.GMAIL_USER}>`,
          to: email,
          subject: "Password Reset Request",
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2 style="color: #333;">Password Reset Request</h2>
              <p>Hello ${user.name || "User"},</p>
              <p>You requested a password reset. Click the button below to reset your password:</p>
              <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
              <p>This link will expire in 1 hour.</p>
              <p>If you didn't request this, please ignore this email.</p>
              <p>Best regards,<br>Portfolio Team</p>
            </div>
          `,
        });
        console.log("Password reset email sent to:", email);
      } catch (emailErr) {
        console.error("Email sending error:", emailErr);
      }
    }

    res.json({
      success: true,
      message: "If an account exists, a reset link has been sent.",
    });
  } catch (err) {
    console.error("Password reset request error:", err);
    res.status(500).json({ error: "Failed to process request" });
  }
});

// Token Validation
app.get("/api/password-reset/:token", async (req, res) => {
  const { token } = req.params;
  console.log("Validating token:", token); // Debug

  try {
    const [tokens] = await pool.query(
      "SELECT * FROM password_reset_tokens WHERE token = ? AND used = FALSE AND expires_at > NOW()",
      [token]
    );
    console.log("Token query result:", tokens.length); // Debug

    if (tokens.length === 0)
      return res
        .status(400)
        .json({ valid: false, error: "Invalid or expired token" });

    res.json({ success: true, valid: true, message: "Token is valid" });
  } catch (err) {
    console.error("Token validation error for token:", token, err);
    res.status(500).json({ valid: false, error: "Failed to validate token" });
  }
});

// Password Reset Submission
app.post("/api/password-reset/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 8)
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters" });

  try {
    const [tokens] = await pool.query(
      "SELECT * FROM password_reset_tokens WHERE token = ? AND used = FALSE AND expires_at > NOW()",
      [token]
    );

    if (tokens.length === 0)
      return res.status(400).json({ error: "Invalid or expired token" });

    const resetToken = tokens[0];
    const hashedPassword = await bcrypt.hash(password, 10);

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      await conn.query("UPDATE users SET password = ? WHERE id = ?", [
        hashedPassword,
        resetToken.user_id,
      ]);
      await conn.query(
        "UPDATE password_reset_tokens SET used = TRUE WHERE id = ?",
        [resetToken.id]
      );
      await conn.commit();
      res.json({ success: true, message: "Password reset successful" });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Password reset error:", err);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

// Contact Form Submission
app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message, role = "viewer" } = req.body;

  if (!name || !email || !subject || !message)
    return res.status(400).json({
      error: "All fields are required",
      requiredFields: ["name", "email", "subject", "message"],
    });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ error: "Invalid email format" });

  try {
    const [dbResult] = await pool.query(
      "INSERT INTO contact_submissions (name, email, subject, message, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, subject, message, role]
    );

    if (app.locals.transporter) {
      try {
        await Promise.all([
          app.locals.transporter.sendMail({
            from: `"${name}" <${process.env.GMAIL_USER}>`,
            replyTo: email,
            to: process.env.CONTACT_RECEIVER || process.env.GMAIL_USER,
            subject: `Contact Form: ${subject}`,
            html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2 style="color: #333;">New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Role:</strong> ${role}</p>
                <p><strong>Message:</strong></p>
                <div style="background: #f4f4f4; padding: 10px; border-left: 3px solid #ccc;">
                  ${message.replace(/\n/g, "<br>")}
                </div>
              </div>
            `,
          }),
          app.locals.transporter.sendMail({
            from: `"Portfolio System" <${process.env.GMAIL_USER}>`,
            to: "zinshol@hotmail.com",
            subject: "New Contact Submission Received",
            html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2 style="color: #333;">New Contact Submission</h2>
                <p><strong>From:</strong> ${name} (${email})</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Role:</strong> ${role}</p>
                <p>Please visit your <a href="https://zesky.net/admin">admin dashboard</a> to review the submission.</p>
              </div>
            `,
          }),
        ]);
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
      }
    }

    res.json({
      success: true,
      message: "Message received successfully",
      submissionId: dbResult.insertId,
    });
  } catch (err) {
    console.error("Contact form error:", err);
    res.status(500).json({
      error: "Failed to process your request",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// Recommendations Submission
app.post("/api/recommendations", async (req, res) => {
  const { name, position, company, recommendation } = req.body;

  if (!name || !position || !company || !recommendation)
    return res.status(400).json({
      error: "All fields are required",
      requiredFields: ["name", "position", "company", "recommendation"],
    });

  try {
    const [result] = await pool.query(
      "INSERT INTO recommendations (name, position, company, recommendation) VALUES (?, ?, ?, ?)",
      [name, position, company, recommendation]
    );

    if (app.locals.transporter) {
      try {
        await app.locals.transporter.sendMail({
          from: `"Portfolio System" <${process.env.GMAIL_USER}>`,
          to: "zinshol@hotmail.com",
          subject: "New Recommendation Received",
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2 style="color: #333;">New Recommendation</h2>
              <p><strong>From:</strong> ${name} (${position}, ${company})</p>
              <p>Please visit your <a href="https://zesky.net/admin">admin dashboard</a> to review and approve the recommendation.</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
      }
    }

    res.json({
      success: true,
      message: "Recommendation submitted successfully",
      id: result.insertId,
    });
  } catch (err) {
    console.error("Recommendation submission error:", err);
    res.status(500).json({
      error: "Failed to submit recommendation",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// Get Approved Recommendations
app.get("/api/recommendations", async (req, res) => {
  try {
    const [recommendations] = await pool.query(
      "SELECT * FROM recommendations WHERE approved = TRUE ORDER BY created_at DESC"
    );
    res.json({ success: true, data: recommendations });
  } catch (err) {
    console.error("Failed to fetch recommendations:", err);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});

// Admin Endpoints
app.get(
  "/api/admin/recommendations",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const [recommendations] = await pool.query(
        "SELECT * FROM recommendations ORDER BY created_at DESC"
      );
      res.json({ success: true, data: recommendations });
    } catch (err) {
      console.error("Failed to fetch admin recommendations:", err);
      res.status(500).json({ error: "Failed to fetch recommendations" });
    }
  }
);

app.put(
  "/api/admin/recommendations/:id",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    const { id } = req.params;
    const { name, position, company, recommendation, approved } = req.body;
    try {
      await pool.query(
        "UPDATE recommendations SET name = ?, position = ?, company = ?, recommendation = ?, approved = ? WHERE id = ?",
        [name, position, company, recommendation, approved, id]
      );
      res.json({ success: true, message: "Recommendation updated" });
    } catch (err) {
      console.error("Update recommendation error:", err);
      res.status(500).json({ error: "Failed to update recommendation" });
    }
  }
);

app.delete(
  "/api/admin/recommendations/:id",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query("DELETE FROM recommendations WHERE id = ?", [id]);
      res.json({ success: true, message: "Recommendation deleted" });
    } catch (err) {
      console.error("Delete recommendation error:", err);
      res.status(500).json({ error: "Failed to delete recommendation" });
    }
  }
);

app.get("/api/admin/contacts", authenticateToken, isAdmin, async (req, res) => {
  try {
    const [contacts] = await pool.query(
      "SELECT * FROM contact_submissions ORDER BY created_at DESC"
    );
    res.json({ success: true, data: contacts });
  } catch (err) {
    console.error("Failed to fetch contacts:", err);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});

app.put(
  "/api/admin/contacts/:id",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    try {
      await pool.query("UPDATE contact_submissions SET role = ? WHERE id = ?", [
        role,
        id,
      ]);
      res.json({ success: true, message: "Contact role updated" });
    } catch (err) {
      console.error("Update contact role error:", err);
      res.status(500).json({ error: "Failed to update contact role" });
    }
  }
);

app.delete(
  "/api/admin/contacts/:id",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query("DELETE FROM contact_submissions WHERE id = ?", [id]);
      res.json({ success: true, message: "Contact deleted" });
    } catch (err) {
      console.error("Delete contact error:", err);
      res.status(500).json({ error: "Failed to delete contact" });
    }
  }
);

app.get("/api/blogs", async (req, res) => {
  try {
    const [blogs] = await pool.query(
      "SELECT * FROM blogs ORDER BY created_at DESC"
    );
    res.json({ success: true, data: blogs });
  } catch (err) {
    console.error("Failed to fetch blogs:", err);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

app.post("/api/admin/blogs", authenticateToken, isAdmin, async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content)
    return res.status(400).json({ error: "Title and content required" });

  try {
    const [result] = await pool.query(
      "INSERT INTO blogs (title, content) VALUES (?, ?)",
      [title, content]
    );
    res.json({
      success: true,
      message: "Blog created",
      id: result.insertId,
    });
  } catch (err) {
    console.error("Create blog error:", err);
    res.status(500).json({ error: "Failed to create blog" });
  }
});

app.put(
  "/api/admin/blogs/:id",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
      await pool.query("UPDATE blogs SET title = ?, content = ? WHERE id = ?", [
        title,
        content,
        id,
      ]);
      res.json({ success: true, message: "Blog updated" });
    } catch (err) {
      console.error("Update blog error:", err);
      res.status(500).json({ error: "Failed to update blog" });
    }
  }
);

app.delete(
  "/api/admin/blogs/:id",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query("DELETE FROM blogs WHERE id = ?", [id]);
      res.json({ success: true, message: "Blog deleted" });
    } catch (err) {
      console.error("Delete blog error:", err);
      res.status(500).json({ error: "Failed to delete blog" });
    }
  }
);

app.get("/api/admin/users", authenticateToken, isAdmin, async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC"
    );
    res.json({ success: true, data: users });
  } catch (err) {
    console.error("Failed to fetch users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.put(
  "/api/admin/users/:id",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!["admin", "editor", "viewer"].includes(role))
      return res.status(400).json({ error: "Invalid role value" });

    try {
      const [result] = await pool.query(
        "UPDATE users SET role = ? WHERE id = ?",
        [role, id]
      );
      if (result.affectedRows === 0)
        return res.status(404).json({ error: "User not found" });

      res.json({ success: true, message: "User role updated" });
    } catch (err) {
      console.error("Update user role error:", err);
      res.status(500).json({ error: "Failed to update user role" });
    }
  }
);
app.get(/^\/(?!api).*/, (req, res) => {
  // Match all routes except those starting with /api
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});
// Initialize Services and Start Server
async function initializeServices() {
  try {
    await initializeDatabase();
    const transporter = await initializeEmailService();
    app.locals.transporter = transporter;

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log("All services initialized successfully");
    });
  } catch (err) {
    console.error("Service initialization failed:", err);
    process.exit(1);
  }
}

initializeServices();

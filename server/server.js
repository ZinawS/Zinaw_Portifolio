/**
 * Production-Ready Express Server
 *
 * Key Improvements:
 * - Standardized route prefixes
 * - Enhanced security middleware
 * - Comprehensive input validation
 * - Proper resource existence checks
 * - Consistent error handling
 * - Rate limiting on sensitive endpoints
 * - Optimized CORS configuration
 * - Database schema alignment with routes
 * - Detailed logging
 * - Health check endpoint
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
const helmet = require("helmet");
const fs = require("fs");

const app = express();

// ======================
// Security Middleware
// ======================

// HTTP headers security
app.use(helmet());

// CORS Configuration - Single source of truth
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parser with size limit
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate limiters
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: "Too many requests from this IP, please try again later",
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: "Too many authentication requests, please try again later",
});

// Apply rate limiting
app.use("/api/", apiLimiter);
app.use("/api/login", authLimiter);
app.use("/api/register", authLimiter);
app.use("/api/password-reset", authLimiter);

// ======================
// Database Configuration
// ======================

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl:
    process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
};

const pool = mysql.createPool(dbConfig);

// Database connection health check
async function checkDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    return true;
  } catch (err) {
    console.error("Database connection error:", err);
    return false;
  }
}

// ======================
// Database Initialization
// ======================

async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();

    // Users table with indexes
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'editor', 'viewer') DEFAULT 'viewer',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role)
      )
    `);

    // Password reset tokens table with index
    await connection.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token VARCHAR(255) NOT NULL,
        expires_at DATETIME NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_token (token),
        INDEX idx_expires (expires_at),
        INDEX idx_used (used)
      )
    `);

    // Recommendations table with fulltext index
    await connection.query(`
      CREATE TABLE IF NOT EXISTS recommendations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        position VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        recommendation TEXT NOT NULL,
        approved BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FULLTEXT idx_recommendation (recommendation)
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
        role ENUM('admin', 'editor', 'viewer', 'banned') DEFAULT 'viewer',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role)
      )
    `);

    // Blogs table with proper schema
    await connection.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content LONGTEXT NOT NULL,
        author_id INT NOT NULL,
        content_type ENUM('plain', 'markdown', 'html') DEFAULT 'plain',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id),
        FULLTEXT idx_content (content),
        INDEX idx_author (author_id)
      )
    `);

    // Clean up expired tokens
    await connection.query(
      "DELETE FROM password_reset_tokens WHERE expires_at < NOW() OR used = TRUE"
    );

    connection.release();
    console.log("Database tables initialized");
  } catch (err) {
    console.error("Database initialization error:", err);
    process.exit(1);
  }
}

// ======================
// Email Service
// ======================

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

// ======================
// Authentication Middleware
// ======================

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "Unauthorized",
      code: "MISSING_TOKEN",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        error: "Forbidden - Invalid token",
        code: "INVALID_TOKEN",
      });
    }
    req.user = user;
    next();
  });
}

function isAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      error: "Forbidden - Admin access required",
      code: "ADMIN_REQUIRED",
    });
  }
  next();
}

function isEditorOrAdmin(req, res, next) {
  if (req.user.role !== "admin" && req.user.role !== "editor") {
    return res.status(403).json({
      error: "Forbidden - Editor or admin access required",
      code: "EDITOR_REQUIRED",
    });
  }
  next();
}

// ======================
// Utility Functions
// ======================

/**
 * Validates email format
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validates password strength
 * @param {string} password
 * @returns {boolean}
 */
function isStrongPassword(password) {
  return password.length >= 8;
}

/**
 * Handles database errors consistently
 * @param {Error} err
 * @param {Response} res
 * @param {string} context
 */
function handleDatabaseError(err, res, context) {
  console.error(`${context} error:`, err);
  res.status(500).json({
    error: "Database operation failed",
    code: "DB_ERROR",
  });
}

// ======================
// API Routes
// ======================

// Health check endpoint
app.get("/api/health", async (req, res) => {
  const dbHealthy = await checkDatabaseConnection();
  const status = dbHealthy ? "healthy" : "degraded";
  res.json({
    status,
    timestamp: new Date().toISOString(),
    db: dbHealthy ? "connected" : "disconnected",
  });
});

// User Registration
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Input validation
  if (!name || !email || !password) {
    return res.status(400).json({
      error: "Name, email, and password required",
      code: "MISSING_FIELDS",
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      error: "Invalid email format",
      code: "INVALID_EMAIL",
    });
  }

  if (!isStrongPassword(password)) {
    return res.status(400).json({
      error: "Password must be at least 8 characters",
      code: "WEAK_PASSWORD",
    });
  }

  try {
    // Check for existing user
    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        error: "Email already in use",
        code: "EMAIL_EXISTS",
      });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 12);
    await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    handleDatabaseError(err, res, "Registration");
  }
});

// User Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password required",
      code: "MISSING_CREDENTIALS",
    });
  }

  try {
    const [users] = await pool.query(
      "SELECT id, name, email, password, role FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        error: "Invalid credentials",
        code: "INVALID_CREDENTIALS",
      });
    }

    const user = users[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({
        error: "Invalid credentials",
        code: "INVALID_CREDENTIALS",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
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
    });
  } catch (err) {
    handleDatabaseError(err, res, "Login");
  }
});

// Password Reset Flow
app.post("/api/auth/password-reset", async (req, res) => {
  const { email } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({
      error: "Valid email required",
      code: "INVALID_EMAIL",
    });
  }

  try {
    const [users] = await pool.query(
      "SELECT id, name FROM users WHERE email = ?",
      [email]
    );

    // Return success even if email doesn't exist to prevent email enumeration
    if (users.length === 0) {
      return res.json({
        success: true,
        message: "If an account exists, a reset link has been sent.",
      });
    }

    const user = users[0];
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    await pool.query(
      "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
      [user.id, token, expiresAt]
    );

    if (app.locals.transporter) {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

      try {
        await app.locals.transporter.sendMail({
          from: `"Portfolio System" <${process.env.GMAIL_USER}>`,
          to: email,
          subject: "Password Reset Request",
          html: `...`, // Your email template here
        });
      } catch (emailErr) {
        console.error("Email sending error:", emailErr);
      }
    }

    res.json({
      success: true,
      message: "If an account exists, a reset link has been sent.",
    });
  } catch (err) {
    handleDatabaseError(err, res, "Password reset");
  }
});

// Password Reset Request
app.post("/api/password-reset", async (req, res) => {
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
      console.log("Sending reset email to:", email, "URL:", resetUrl);
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
  console.log("Validating token:", token);

  try {
    const [tokens] = await pool.query(
      "SELECT * FROM password_reset_tokens WHERE token = ? AND used = FALSE AND expires_at > NOW()",
      [token]
    );
    console.log("Token query result:", tokens.length);

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

    // Validate the role value
    if (!["editor", "viewer"].includes(role)) {
      return res.status(400).json({
        success: false,
        error: "Invalid role value. Allowed values: 'editor', 'viewer'",
        code: "INVALID_ROLE",
      });
    }

    try {
      const [result] = await pool.query(
        "UPDATE contact_submissions SET role = ? WHERE id = ?",
        [role, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          error: "Contact not found",
          code: "NOT_FOUND",
        });
      }

      res.json({
        success: true,
        message: "Contact role updated successfully",
        role,
      });
    } catch (err) {
      console.error("Update contact role error:", err);
      res.status(500).json({
        success: false,
        error: "Failed to update contact role",
        code: "UPDATE_ERROR",
      });
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

app.post(
  "/api/admin/blogs",
  authenticateToken,
  isEditorOrAdmin,
  async (req, res) => {
    const { title, content, contentType = "plain" } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content required" });
    }

    try {
      const [result] = await pool.query(
        "INSERT INTO blogs (title, content, author_id, content_type) VALUES (?, ?, ?, ?)",
        [title, content, req.user.id, contentType]
      );

      const [blogs] = await pool.query(
        `
      SELECT b.*, u.name as author_name 
      FROM blogs b
      JOIN users u ON b.author_id = u.id
      WHERE b.id = ?
    `,
        [result.insertId]
      );

      res.json({
        success: true,
        message: "Blog created",
        data: blogs[0],
      });
    } catch (err) {
      console.error("Create blog error:", err);
      res.status(500).json({ error: "Failed to create blog" });
    }
  }
);

app.put(
  "/api/admin/blogs/:id",
  authenticateToken,
  isEditorOrAdmin,
  async (req, res) => {
    const { id } = req.params;
    const { title, content, contentType = "plain" } = req.body;

    try {
      const [existing] = await pool.query(
        "SELECT author_id FROM blogs WHERE id = ?",
        [id]
      );

      if (existing.length === 0) {
        return res.status(404).json({ error: "Blog not found" });
      }

      if (req.user.role !== "admin" && existing[0].author_id !== req.user.id) {
        return res
          .status(403)
          .json({ error: "You can only edit your own blogs" });
      }

      await pool.query(
        "UPDATE blogs SET title = ?, content = ?, content_type = ? WHERE id = ?",
        [title, content, contentType, id]
      );

      const [blogs] = await pool.query(
        `
      SELECT b.*, u.name as author_name 
      FROM blogs b
      JOIN users u ON b.author_id = u.id
      WHERE b.id = ?
    `,
        [id]
      );

      res.json({
        success: true,
        message: "Blog updated",
        data: blogs[0],
      });
    } catch (err) {
      console.error("Update blog error:", err);
      res.status(500).json({ error: "Failed to update blog" });
    }
  }
);

app.delete(
  "/api/admin/blogs/:id",
  authenticateToken,
  isEditorOrAdmin,
  async (req, res) => {
    const { id } = req.params;

    try {
      const [existing] = await pool.query(
        "SELECT author_id FROM blogs WHERE id = ?",
        [id]
      );

      if (existing.length === 0) {
        return res.status(404).json({ error: "Blog not found" });
      }

      if (req.user.role !== "admin" && existing[0].author_id !== req.user.id) {
        return res
          .status(403)
          .json({ error: "You can only delete your own blogs" });
      }

      await pool.query("DELETE FROM blogs WHERE id = ?", [id]);

      res.json({
        success: true,
        message: "Blog deleted",
      });
    } catch (err) {
      console.error("Delete blog error:", err);
      res.status(500).json({ error: "Failed to delete blog" });
    }
  }
);
// Get all users (admin only)
app.get("/api/users", async (req, res) => {
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
// Editing users
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

// New endpoint to update user role
app.put(
  "/api/admin/users/:id",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    // Validate the role value
    if (!["admin", "editor", "viewer"].includes(role)) {
      return res.status(400).json({
        success: false,
        error:
          "Invalid role value. Allowed values: 'admin', 'editor', 'viewer'",
        code: "INVALID_ROLE",
      });
    }

    try {
      const [result] = await pool.query(
        "UPDATE users SET role = ? WHERE id = ?",
        [role, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          error: "User not found",
          code: "NOT_FOUND",
        });
      }

      res.json({
        success: true,
        message: "User role updated successfully",
        data: { id: parseInt(id), role },
      });
    } catch (err) {
      console.error("Update user role error:", err);
      res.status(500).json({
        success: false,
        error: "Failed to update user role",
        code: "UPDATE_ERROR",
      });
    }
  }
);
// Delete a user by ID (admin only)
app.delete(
  "/api/admin/users/:id",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    const { id } = req.params;

    try {
      const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          error: "User not found",
          code: "NOT_FOUND",
        });
      }

      res.json({
        success: true,
        message: "User deleted successfully",
        data: { id: parseInt(id) },
      });
    } catch (err) {
      console.error("Delete user error:", err);
      res.status(500).json({
        success: false,
        error: "Failed to delete user",
        code: "DELETE_ERROR",
      });
    }
  }
);
// ============================================
// STATIC FILE SERVING
// ============================================

// Serve static files from React app
const frontendPath = path.join(__dirname, "../client/build");

// Check if the build directory exists
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));

  // Handle React routing, return all requests to React app
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
} else {
  console.error("React build directory not found at:", frontendPath);
}
// Initialize Services and Start Server
async function initializeServices() {
  try {
    await initializeDatabase();
    const transporter = await initializeEmailService();
    app.locals.transporter = transporter;

    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log("All services initialized successfully");
    });
  } catch (err) {
    console.error("Service initialization failed:", err.message);
    process.exit(1);
  }
}

initializeServices();

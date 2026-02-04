const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();

/**
 * =========================
 * REGISTER USER
 * =========================
 */
router.post("/register", async (req, res) => {
  try {
    // 1. Read request body
    const { email, password } = req.body;
    console.log("REGISTER REQUEST BODY:", req.body);

    // 2. Basic validation
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // 3. Check if user already exists
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: "User already exists",
      });
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Insert user
    await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2)",
      [email, hashedPassword]
    );

    // 6. Success response
    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
});

/**
 * =========================
 * LOGIN USER
 * =========================
 */
router.post("/login", async (req, res) => {
  try {
    // 1. Read request body
    const { email, password } = req.body;
    console.log("LOGIN REQUEST BODY:", req.body);

    // 2. Validation
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // 3. Get user from DB
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    // 4. Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // 5. Generate JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 6. Success response
    return res.status(200).json({
      message: "Login successful",
      token: token,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
});

module.exports = router;

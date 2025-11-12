const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { authenticate, generateToken } = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

// Register
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { email, password, firstName, lastName, phone } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: "User with this email already exists",
        });
      }

      // Create new user
      const user = new User({
        email,
        password,
        firstName,
        lastName,
        phone,
      });

      await user.save();

      // Generate token
      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        access_token: token,
        user: user.getPublicProfile(),
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({
        success: false,
        error: "Error registering user",
      });
    }
  }
);

// Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;

      // Find user and include password field
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return res.status(401).json({
          success: false,
          error: "Invalid email or password",
        });
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: "Invalid email or password",
        });
      }

      // Generate token
      const token = generateToken(user._id);

      res.json({
        success: true,
        message: "Login successful",
        access_token: token,
        user: user.getPublicProfile(),
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        error: "Error logging in",
      });
    }
  }
);

// Get Profile
router.get("/profile", authenticate, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching profile",
    });
  }
});

// Update Profile
router.put("/profile", authenticate, async (req, res) => {
  try {
    const { firstName, lastName, phone, address } = req.body;

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      error: "Error updating profile",
    });
  }
});

// Verify Token
router.post("/verify-token", authenticate, async (req, res) => {
  res.json({
    success: true,
    valid: true,
    user: req.user.getPublicProfile(),
  });
});

// Reset Password (without authentication - for forgotten passwords)
router.post(
  "/reset-password",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { email, newPassword } = req.body;

      // Find user
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      // Update password (will be hashed by the pre-save hook)
      user.password = newPassword;
      await user.save();

      res.json({
        success: true,
        message: "Password reset successfully",
      });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({
        success: false,
        error: "Error resetting password",
      });
    }
  }
);

// Change Password (authenticated - for logged in users)
router.post(
  "/change-password",
  authenticate,
  [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { currentPassword, newPassword } = req.body;

      // Get user with password field
      const user = await User.findById(req.user._id).select("+password");

      // Verify current password
      const isPasswordValid = await user.comparePassword(currentPassword);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: "Current password is incorrect",
        });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({
        success: false,
        error: "Error changing password",
      });
    }
  }
);

module.exports = router;

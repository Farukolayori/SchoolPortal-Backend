import express from "express";
import User from "../models/userModel.js";

const router = express.Router();

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json({ 
      success: true,
      count: users.length,
      users 
    });
  } catch (err) {
    console.error("Get all users error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error fetching users",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }
    res.status(200).json({ 
      success: true,
      user 
    });
  } catch (err) {
    console.error("Get user by ID error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error fetching user",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Delete user
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }
    res.status(200).json({ 
      success: true,
      message: "User deleted successfully" 
    });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error deleting user",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

export default router;
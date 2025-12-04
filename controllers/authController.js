import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

/**
 * REGISTER USER (with matricNumber generation)
 */
export const registerUser = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      dateStarted, 
      department,
      profileImage 
    } = req.body;

    console.log("Registration attempt for:", email);

    // Validate required fields
    if (!firstName || !lastName || !email || !dateStarted) {
      return res.status(400).json({ 
        message: "First name, last name, email, and date started are required" 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Generate random 10-digit matric number
    const matricNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    
    // Check if matric number already exists (unlikely but possible)
    const existingMatric = await User.findOne({ matricNumber });
    if (existingMatric) {
      // If duplicate, generate another one
      matricNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    }

    // Generate a random password (for now - you should add password field to frontend)
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      matricNumber,
      department: department || null,
      dateStarted: new Date(dateStarted),
      role: 'user',
      profileImage: profileImage || "",
    });

    await newUser.save();

    // Return success with matric number
    res.status(201).json({
      message: "Registration successful!",
      user: {
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        matricNumber: newUser.matricNumber,
        department: newUser.department,
        dateStarted: newUser.dateStarted,
        role: newUser.role,
        profileImage: newUser.profileImage,
      },
      generatedPassword: randomPassword // Include this for testing only
    });

  } catch (err) {
    console.error("Registration error:", err);
    
    // Handle specific Mongoose errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: messages 
      });
    }
    
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: "Duplicate field value entered" 
      });
    }
    
    res.status(500).json({ 
      message: "Server error during registration",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * LOGIN USER (using email and matricNumber)
 */
export const loginUser = async (req, res) => {
  try {
    const { email, matricNumber } = req.body;

    // Validate input
    if (!email || !matricNumber) {
      return res.status(400).json({ 
        message: "Email and matric number are required" 
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify matric number matches
    if (user.matricNumber !== matricNumber) {
      return res.status(401).json({ message: "Invalid matric number" });
    }

    // Login successful
    res.status(200).json({
      message: "Login successful!",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        matricNumber: user.matricNumber,
        department: user.department,
        dateStarted: user.dateStarted,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
    
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ 
      message: "Server error during login",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * ADMIN ADD USER (Same as register but with different response)
 */
export const adminAddUser = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      dateStarted, 
      department,
      profileImage 
    } = req.body;

    console.log("Admin adding user:", email);

    // Validate required fields
    if (!firstName || !lastName || !email || !dateStarted) {
      return res.status(400).json({ 
        message: "First name, last name, email, and date started are required" 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Generate random 10-digit matric number
    let matricNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    
    // Check if matric number already exists
    const existingMatric = await User.findOne({ matricNumber });
    if (existingMatric) {
      matricNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    }

    // Generate random password
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      matricNumber,
      department: department || null,
      dateStarted: new Date(dateStarted),
      role: 'user',
      profileImage: profileImage || "",
    });

    await newUser.save();

    // Return success response for admin
    res.status(201).json({
      message: "User added successfully!",
      user: {
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        matricNumber: newUser.matricNumber,
        department: newUser.department,
        dateStarted: newUser.dateStarted,
        role: newUser.role,
        profileImage: newUser.profileImage,
      },
      temporaryPassword: randomPassword, // For admin to share with user
      note: "Share matric number and temporary password with the user"
    });

  } catch (err) {
    console.error("Admin add user error:", err);
    
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: messages 
      });
    }
    
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: "Duplicate field value entered" 
      });
    }
    
    res.status(500).json({ 
      message: "Server error adding user",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
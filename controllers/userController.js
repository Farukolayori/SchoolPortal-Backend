import User from "../models/userModel.js";
import bcrypt from "bcryptjs"; // ✅ Add this import at the top if not already there

/**
 * GET ALL USERS (for Admin Dashboard)
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users: users.map(user => ({
        _id: user._id, // ✅ Changed from 'id' to '_id' to match frontend
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        matricNumber: user.matricNumber, // ✅ Add matric number
        department: user.department, // ✅ Add department
        dateStarted: user.dateStarted,
        role: user.role,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }))
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

/**
 * GET SINGLE USER BY ID
 */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        matricNumber: user.matricNumber,
        department: user.department,
        dateStarted: user.dateStarted,
        role: user.role,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

/**
 * DELETE USER BY ID (Admin only)
 */
export const deleteUser = async (req, res) => {
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
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

/**
 * UPDATE USER BY ID
 */
export const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, dateStarted, role, profileImage } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (dateStarted) user.dateStarted = dateStarted;
    if (role) user.role = role;
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        dateStarted: user.dateStarted,
        role: user.role,
        profileImage: user.profileImage,
        updatedAt: user.updatedAt
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

/**
 * FORGOT MATRIC NUMBER - Retrieve matric using email and password
 */
export const forgotMatric = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔍 Forgot matric request for email:", email);

    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide email and password' 
      });
    }

    // Find user by email (case-insensitive)
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      console.log("❌ No user found with email:", email);
      return res.status(404).json({ 
        message: 'No account found with this email' 
      });
    }

    console.log("👤 User found:", user.email);

    // Verify password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      console.log("❌ Password mismatch for user:", email);
      return res.status(401).json({ 
        message: 'Invalid password' 
      });
    }

    console.log("✅ Matric number retrieved successfully:", user.matricNumber);

    return res.status(200).json({ 
      matricNumber: user.matricNumber,
      message: 'Matric number retrieved successfully'
    });

  } catch (error) {
    console.error('❌ Forgot matric error:', error);
    return res.status(500).json({ 
      message: 'Server error. Please try again later.' 
    });
  }
};
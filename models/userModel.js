import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: true 
  },
  lastName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  matricNumber: {
    type: String,
    unique: true,
    sparse: true // Allows null but ensures uniqueness for non-null
  },
  department: {
    type: String,
    enum: [
      "Computer Science",
      "Electrical Engineering",
      "Mechanical Engineering",
      "Civil Engineering",
      "Business Administration",
      "Accounting",
      "Mass Communication",
      "Architecture",
      "Estate Management",
      "Banking and Finance"
    ]
  },
  dateStarted: { 
    type: Date, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ["user", "admin"], 
    default: "user" 
  },
  profileImage: { 
    type: String, 
    default: "" // Changed from required: true
  }
}, { 
  timestamps: true 
});

export default mongoose.model("User", userSchema);
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/userModel.js"; // Adjust path as needed

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const adminEmail = "mark@gmail.com";
    const adminPassword = "Olayori25";
    const adminMatric = "ADMIN2024"; // ✅ Add matric number

    // Delete existing admin if found
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log("⚠️ Admin user already exists. Deleting old admin...");
      await User.deleteOne({ email: adminEmail });
      console.log("✅ Old admin deleted");
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const admin = new User({
      firstName: "Ariyo",
      lastName: "Oluwapelumi",
      email: adminEmail,
      password: hashedPassword,
      matricNumber: adminMatric, // ✅ IMPORTANT: Add matric number
      department: "Administration", // ✅ Optional but recommended
      dateStarted: new Date(),
      role: "admin",
      profileImage: null
    });

    await admin.save();
    
    console.log("✅ Admin user created successfully!");
    console.log("═══════════════════════════════════");
    console.log("📧 Email:", adminEmail);
    console.log("🔑 Password:", adminPassword);
    console.log("🎓 Matric Number:", adminMatric);
    console.log("👤 Role: admin");
    console.log("═══════════════════════════════════");
    console.log("");
    console.log("🔐 LOGIN CREDENTIALS:");
    console.log("   Email: " + adminEmail);
    console.log("   Matric: " + adminMatric);
    console.log("═══════════════════════════════════");
    
    // Verify the admin was created
    const verifyAdmin = await User.findOne({ email: adminEmail });
    if (verifyAdmin && verifyAdmin.role === "admin") {
      console.log("✅ Verification successful - Admin exists in database");
      console.log("🎓 Stored Matric Number:", verifyAdmin.matricNumber);
    } else {
      console.log("❌ Verification failed - Something went wrong");
    }
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();
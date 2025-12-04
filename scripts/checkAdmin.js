import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/userModel.js";

dotenv.config();

const checkAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Find all admins
    const admins = await User.find({ role: "admin" });
    console.log(`Found ${admins.length} admin(s):`);
    admins.forEach(admin => {
      console.log({
        id: admin._id,
        name: admin.firstName + " " + admin.lastName,
        email: admin.email,
        role: admin.role,
        dateStarted: admin.dateStarted
      });
    });

    // Find user by email
    const user = await User.findOne({ email: "mark@gmail.com" });
    if (user) {
      console.log("\n✅ User with email mark@gmail.com found:");
      console.log({
        id: user._id,
        name: user.firstName + " " + user.lastName,
        email: user.email,
        role: user.role,
        hasPassword: !!user.password
      });
    } else {
      console.log("\n❌ No user found with email mark@gmail.com");
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

checkAdmin();
import express from "express";
import { 
  registerUser, 
  loginUser, 
  adminAddUser 
} from "../controllers/authController.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Admin routes (you can add auth middleware later)
router.post("/admin/add-user", adminAddUser);

export default router;
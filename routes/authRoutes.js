import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { forgotMatric } from "../controllers/userController.js"; // ✅ Import from userController

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-matric", forgotMatric); // ✅ Add this route

export default router;
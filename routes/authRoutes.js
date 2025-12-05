import express from "express";
import { registerUser, loginUser, adminLogin } from "../controllers/authController.js";
import { forgotMatric } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin/login", adminLogin); // ✅ Add admin login route
router.post("/forgot-matric", forgotMatric);

export default router;
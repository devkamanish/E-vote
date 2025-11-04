import express from "express";
import {
  register,
  login,
  requestOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
  getMe
} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", authMiddleware, getMe);

export default router;


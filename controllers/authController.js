import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/User.js";
import { sendMail } from "../utils/mailer.js";
import { generateJwt } from "../helpers/generateTokens.js";
import dotenv from "dotenv";
dotenv.config();
const SALT_ROUNDS = 10;

function generateNumericOtp(length = 6) {
  let otp = "";
  for (let i = 0; i < length; i++) otp += Math.floor(Math.random() * 10);
  return otp;
}


// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password, number, state } = req.body;

    if (!email || !password || !number || !state)
      return res.status(400).json({ message: "Email, password, number, and state are required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({ name, email, passwordHash, number, state });
    await user.save();
    

    const token = generateJwt(user);
    return res.status(201).json({
      message: "Registered successfully",
      token,
      user: { id: user._id, name, email, number, state }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.passwordHash) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateJwt(user);
    return res.json({
      message: "Logged in",
      token,
      user: { id: user._id, name: user.name, email, number: user.number, state: user.state }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// REQUEST OTP
export const requestOtp = async (req, res) => {
  try {
    const { email, number, state } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    let user = await User.findOne({ email });
    if (!user) user = new User({ email, number, state });

    const otp = generateNumericOtp(6);
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    
    await sendMail({ to: email, subject: "Your OTP Code", html: `<p>Your OTP is <b>${otp}</b>. It expires in 10 minutes.</p>` });

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// VERIFY OTP   
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpires < new Date())
      return res.status(400).json({ message: "Invalid or expired OTP" });

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = generateJwt(user);
    res.json({
      message: "OTP verified, logged in",
      token,
      user: { id: user._id, name: user.name, email, number: user.number, state: user.state }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "No user with that email" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    // Send only the token in email (simpler for testing)
    await sendMail({
      to: email,
      subject: "Password Reset",
      html: `
        <p>Your password reset token is:</p>
        <h3>${resetToken}</h3>
       
      `,
    });

    res.json({ message: "Password reset token sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// RESET PASSWORD
// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body; // use same field name as your Postman test

    // Find user by token and check expiry
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() } // token still valid
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.passwordHash = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ME
export const getMe = async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
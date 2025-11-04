import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    number: { type: String },
    state: { type: String },
    passwordHash: { type: String },

    otp: { type: String },
    otpExpires: { type: Date },

    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;

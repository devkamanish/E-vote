import React, { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

export default function OtpForm({ setUser }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const requestOtp = async () => {
    if (!email.trim()) return setMsg("Please enter your email");
    setLoading(true);
    try {
      await api("/api/auth/request-otp", { method: "POST", body: { email } });
      setOtpSent(true);
      setMsg("OTP sent to your email");
    } catch (err) {
      setMsg(err?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    if (!otp.trim()) return setMsg("Enter the OTP");
    setLoading(true);
    try {
      const data = await api("/api/auth/verify-otp", {
        method: "POST",
        body: { email, otp },
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setMsg("Login successful 🎉");
      if (data.user.email === "bhoomikadewka@gmail.com") navigate("/admin");
      else navigate("/vote");
    } catch (err) {
      setMsg(err?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
      <h3 className="text-2xl font-semibold text-center text-blue-600 mb-4">
        {otpSent ? "Verify OTP" : "OTP Login"}
      </h3>
      <div className="space-y-3">
        <input
          type="email"
          placeholder="Enter your registered email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={otpSent}
        />
        {otpSent && (
          <input
            placeholder="Enter OTP"
            className="input"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        )}
        {!otpSent ? (
          <button onClick={requestOtp} className="btn-primary w-full">
            {loading ? "Sending..." : "Get OTP"}
          </button>
        ) : (
          <button onClick={verify} className="btn-primary w-full">
            {loading ? "Verifying..." : "Verify & Login"}
          </button>
        )}
        {msg && (
          <div className="mt-4 p-2 text-center bg-blue-50 text-blue-700 rounded-md">
            {msg}
          </div>
        )}
      </div>
    </div>
  );
}


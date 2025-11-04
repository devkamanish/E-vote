// backend/utils/mailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const fromAddress = process.env.EMAIL_FROM || "no-reply@example.com";

// Create reusable transporter using Gmail SMTP
console.log("SMTP CONFIG:", {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS ? "**** (hidden)" : "(missing)"
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465, // true for SSL (465), false for TLS (587)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify connection configuration at startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Mail transporter connection failed:", error.message);
  } else {
    console.log("✅ Mail transporter connected and ready to send messages");
  }
});

// Send email helper
export async function sendMail({ to, subject, html, text }) {
  const mailOptions = {
    from: fromAddress,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📩 Email sent successfully to ${to}: ${info.response}`);
    return info;
  } catch (err) {
    console.error("❌ Failed to send email:", err.message);
    throw err;
  }
}

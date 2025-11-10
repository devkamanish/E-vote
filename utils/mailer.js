import nodemailer from "nodemailer";
import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";

dotenv.config();

const useSendGrid = process.env.USE_SENDGRID === "true";
const fromAddress = process.env.EMAIL_FROM || "no-reply@example.com";

// Setup SendGrid (if enabled)
if (useSendGrid) {
  if (!process.env.SENDGRID_API_KEY) {
    console.error("❌ Missing SENDGRID_API_KEY in environment. Falling back to SMTP.");
  } else {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log("✅ Using SendGrid for emails");
  }
} else {
  console.log("✅ Using SMTP for emails");
}

export async function sendMail({ to, subject, html, text }) {
  // 1️⃣ Try SendGrid first (if configured)
  if (useSendGrid && process.env.SENDGRID_API_KEY) {
    const msg = { to, from: fromAddress, subject, html, text };
    try {
      const response = await sgMail.send(msg);
      console.log(`📩 Email sent via SendGrid to ${to}`);
      return response;
    } catch (err) {
      console.error("❌ SendGrid error:", err.response?.body || err.message);
      console.warn("⚠️ Falling back to SMTP...");
    }
  }

  // 2️⃣ Fallback to SMTP if SendGrid fails or disabled
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      text,
      html,
    });
    console.log(`📩 Email sent via SMTP to ${to}: ${info.response}`);
    return info;
  } catch (err) {
    console.error("❌ SMTP send failed:", err.message);
    throw err;
  }
}
  
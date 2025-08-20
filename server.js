import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import User from "./models/User.js";  // Add .js extension in ESM

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

let otpStore = {}; // Temporary store { phone/email: otp }

// 📌 Common Transporter Function (GoDaddy SMTP)
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtpout.secureserver.net",
    port: process.env.SMTP_PORT || 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER || "support@mnrrealestate.in",
      pass: process.env.EMAIL_PASS || "mnrreal@1a"
    }
  });
}

// 1️⃣ Send OTP
app.post("/send-otp", (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otp;

  let transporter = createTransporter();

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}`
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error("❌ Error sending OTP:", error);
      return res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
    res.json({ success: true, message: "OTP sent to email" });
  });
});

// 2️⃣ Verify OTP
app.post("/verify-otp", async (req, res) => {
  const { name, email, phone, otp } = req.body;

  if (otpStore[email] && otpStore[email] === otp) {
    const newUser = new User({ name, email, phone, verified: true });
    await newUser.save();
    delete otpStore[email];
    return res.json({ success: true, message: "User registered successfully" });
  } else {
    return res.json({ success: false, message: "Invalid OTP" });
  }
});

// 3️⃣ Admin - get all users
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// 4️⃣ Contact Form Submission
app.post("/contact", (req, res) => {
  const { name, email, phone, subject, propertyType, budget, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ success: false, message: "Email and message are required" });
  }

  let transporter = createTransporter();

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `📩 New Contact from ${name || "Visitor"} - ${subject || "General Inquiry"}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><b>Name:</b> ${name || "N/A"}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone || "N/A"}</p>
      <p><b>Subject:</b> ${subject || "N/A"}</p>
      <p><b>Property Type:</b> ${propertyType || "N/A"}</p>
      <p><b>Budget:</b> ${budget || "N/A"}</p>
      <p><b>Message:</b></p>
      <p>${message}</p>
      <hr />
      <p><i>Sent on ${new Date().toLocaleString()}</i></p>
    `
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error("❌ Error sending contact email:", error);
      return res.status(500).json({ success: false, message: "Failed to send message" });
    }
    return res.json({ success: true, message: "Message sent successfully!" });
  });
});

// ✅ Root route (fixes "Cannot GET /")
app.get("/", (req, res) => {
  res.send("🚀 MNR Real Estate Backend is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

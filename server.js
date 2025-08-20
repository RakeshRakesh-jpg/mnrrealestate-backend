const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const User = require("./models/User");

const app = express();
app.use(cors());
app.use(express.json());

// Connect DB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

let otpStore = {}; // Temporary store { phone/email: otp }

// 1️⃣ Send OTP
app.post("/send-otp", (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otp;

  // Send OTP via Email
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
  });

  transporter.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}`
  });

  res.json({ success: true, message: "OTP sent to email" });
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

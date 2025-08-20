import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // load .env

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Check if server is running
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// ✅ Send email route
app.post("/send-email", async (req, res) => {
  const { name, email, phone, subject, propertyType, budget, message } = req.body;

  try {
    // GoDaddy Workspace SMTP config
    let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtpout.secureserver.net",
  port: process.env.SMTP_PORT || 465,   // 465 = SSL
  secure: true, // SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
    // Send email
    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`, // must be your domain email
      replyTo: email, // user’s email goes in reply-to
      to: process.env.EMAIL_USER, // receive in same inbox
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h3>Contact Form Submission</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone || "N/A"}</p>
        <p><b>Subject:</b> ${subject}</p>
        <p><b>Property Type:</b> ${propertyType || "N/A"}</p>
        <p><b>Budget:</b> ${budget || "N/A"}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email sending error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to send email.", error: error.message });
  }
});

// ✅ Start server
app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
});


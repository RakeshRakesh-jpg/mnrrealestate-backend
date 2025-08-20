import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "All fields are required" });
  }

  try {
    // ✅ GoDaddy SMTP settings
    const transporter = nodemailer.createTransport({
      host: "smtpout.secureserver.net",   // GoDaddy SMTP server
      port: 587,                          // GoDaddy SMTP port
      secure: false,                      // must be false for 587
      auth: {
        user: process.env.EMAIL_USER,     // your GoDaddy email (e.g. support@mnrrealestate.in)
        pass: process.env.EMAIL_PASS,     // your GoDaddy email password
      },
      tls: {
        ciphers: "SSLv3",
        rejectUnauthorized: false,
      },
    });

    // 📩 Send mail to your company inbox
    await transporter.sendMail({
      from: `"MNR Real Estate" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,  // your inbox
      replyTo: email,              // customer email (so you can reply directly)
      subject: `New Contact Form Submission - ${name}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `,
    });

    // ✅ Auto-reply to customer
    await transporter.sendMail({
      from: `"MNR Real Estate" <${process.env.EMAIL_USER}>`,
      to: email,  // customer email
      subject: "Thank you for contacting MNR Real Estate",
      html: `
        <h3>Hello ${name},</h3>
        <p>We have received your message:</p>
        <blockquote>${message}</blockquote>
        <p>Our team will get back to you shortly.</p>
        <br/>
        <p>Best regards,<br/>MNR Real Estate Team</p>
      `,
    });

    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, error: "Email not sent" });
  }
});

export default router;

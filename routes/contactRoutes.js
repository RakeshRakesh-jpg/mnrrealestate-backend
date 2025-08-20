import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/contact", async (req, res) => {
  try {
    const { fullName, email, phone, subject, propertyType, budgetRange, message } = req.body;

    // Validation
    if (!fullName || !email || !phone || !subject || !message) {
      return res.status(400).json({ success: false, error: "All required fields must be filled" });
    }

    // Nodemailer transporter for Office365 / GoDaddy SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com", // or "smtp.secureserver.net" if using GoDaddy SMTP
      port: 587,
      secure: false, // STARTTLS
      auth: {
        user: process.env.EMAIL_USER, // e.g., support@mnrrealestate.in
        pass: process.env.EMAIL_PASS, // App password / SMTP password
      },
    });

    // Mail options
    const mailOptions = {
      from: `"MNR Real Estate" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,       // send to your inbox
      cc: email,                        // optional: send copy to customer
      subject: `New Property Enquiry: ${subject}`,
      text: `
        Full Name: ${fullName}
        Email: ${email}
        Phone: ${phone}
        Subject: ${subject}
        Property Type: ${propertyType || "Not specified"}
        Budget Range: ${budgetRange || "Not specified"}
        Message: ${message}
      `,
      html: `
        <h2>New Property Enquiry</h2>
        <p><strong>Full Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Property Type:</strong> ${propertyType || "Not specified"}</p>
        <p><strong>Budget Range:</strong> ${budgetRange || "Not specified"}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ success: false, error: "Failed to send email" });
  }
});

export default router;


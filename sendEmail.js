import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export async function sendEmail({ name, email, phone, subject, propertyType, budget, message }) {
  try {
    // GoDaddy SMTP config
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtpout.secureserver.net",
      port: process.env.SMTP_PORT || 465,
      secure: true, // SSL for 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Mail options
    let info = await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`, // always use your domain email
      replyTo: email, // reply goes to client
      to: process.env.EMAIL_USER, // your inbox
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

    console.log("✅ Email sent:", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("❌ Email sending error:", error);
    return { success: false, error: error.message };
  }
}

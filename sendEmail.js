// backend/sendEmail.js
import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/send-email', async (req, res) => {
  const { name, email, phone, subject, propertyType, budget, message } = req.body;

  try {
    // Setup mail transporter
    let transporter = nodemailer.createTransport({
      host: 'smtp.yourdomain.com', // replace with GoDaddy or your mail host
      port: 465,
      secure: true,
      auth: {
        user: 'support@mnrrealestate.in',
        pass: 'YOUR_EMAIL_PASSWORD'
      }
    });

    // Email content
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: 'support@mnrrealestate.in',
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h3>Contact Form Submission</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone || 'N/A'}</p>
        <p><b>Subject:</b> ${subject}</p>
        <p><b>Property Type:</b> ${propertyType || 'N/A'}</p>
        <p><b>Budget:</b> ${budget || 'N/A'}</p>
        <p><b>Message:</b> ${message}</p>
      `
    });

    res.json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));

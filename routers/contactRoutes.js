import express from 'express';
const router = express.Router();

import Contact from '../models/contectdetails.js';
import nodemailer from 'nodemailer';
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Save to DB
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Thanks for contacting us!',
      text: `Hi ${name},\n\nWe got your message: "${message}".\nWe'll get back to you soon!\n\n– Team`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Contact saved and email sent!' });

  } catch (error) {
    console.error('Error in POST /contact:', error);
    res.status(500).json({ message: 'Something went wrong', error });
  }
});

export default router;

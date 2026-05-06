const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { formType, email, name, phone, company, website, bizType, message } = req.body;

  // Create Nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.titan.email',
    port: process.env.SMTP_PORT || 465,
    secure: process.env.SMTP_SECURE === 'true' || true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    let internalSubject = '';
    let internalHtml = '';
    let userEmail = email;

    if (formType === 'notify') {
      internalSubject = 'New Notify Me Request - Tantra Balm';
      internalHtml = `
        <h2>New Notify Me Request</h2>
        <p><strong>Email:</strong> ${email}</p>
      `;
    } else if (formType === 'distributor') {
      internalSubject = `New Distributor Inquiry - ${company}`;
      internalHtml = `
        <h2>New Distributor Inquiry</h2>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Contact Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Website:</strong> ${website || 'N/A'}</p>
        <p><strong>Business Type:</strong> ${bizType}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `;
    } else {
      return res.status(400).json({ error: 'Invalid form type' });
    }

    // 1. Send the email to info@tantrabalm.com
    await transporter.sendMail({
      from: `"Tantra Balm System" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: internalSubject,
      html: internalHtml,
    });

    // 2. Send the auto-reply to the user who filled the form
    const autoReplySubject = formType === 'notify' 
      ? 'Thank you for your interest in Tantra Balm' 
      : 'We have received your distributor inquiry - Tantra Balm';
      
    const autoReplyHtml = formType === 'notify'
      ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #141414;">
          <h2 style="color: #C6A355;">TANTRA BALM</h2>
          <p>Thank you for expressing interest in Tantra Balm.</p>
          <p>We have added your email (<strong>${email}</strong>) to our priority notification list. You will be the first to know when we expand to a retailer near you.</p>
          <br>
          <p>Warm regards,</p>
          <p>The Tantra Balm Team</p>
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #141414;">
          <h2 style="color: #C6A355;">TANTRA BALM</h2>
          <p>Hi ${name},</p>
          <p>Thank you for your interest in partnering with Tantra Balm. We have successfully received your inquiry for <strong>${company}</strong>.</p>
          <p>A member of our partnerships team will review your application and be in touch within 48 hours to discuss potential opportunities.</p>
          <br>
          <p>Warm regards,</p>
          <p>The Tantra Balm Partnerships Team</p>
        </div>
      `;

    await transporter.sendMail({
      from: `"Tantra Balm" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: autoReplySubject,
      html: autoReplyHtml,
    });

    res.status(200).json({ success: true, message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: 'Failed to send emails' });
  }
}

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendBlogNotificationEmail({ subscriberEmail, blogTitle, blogExcerpt, blogSlug, unsubscribeToken }) {
  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
  const blogUrl = `${FRONTEND_URL}/blog/${blogSlug}`;
  const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000';
  const unsubscribeUrl = `${SERVER_URL}/api/subscribers/unsubscribe?token=${unsubscribeToken}`;

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e2e2e2">
      <div style="background:#3D8A4B;padding:24px;text-align:center">
        <h1 style="color:#fff;font-size:20px;margin:0">New Blog Post</h1>
      </div>
      <div style="padding:32px;text-align:center">
        <h2 style="color:#111;font-size:18px;margin:0 0 12px;text-align:left">${blogTitle}</h2>
        <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 24px;text-align:left">${blogExcerpt || ''}</p>
        <a href="${blogUrl}" style="display:inline-block;background:#3D8A4B;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:bold">Read Full Article</a>
      </div>
      <div style="padding:16px 32px;border-top:1px solid #e2e2e2;text-align:center">
        <a href="${unsubscribeUrl}" style="color:#999;font-size:12px;text-decoration:underline">Unsubscribe</a>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Regent Biochem Blog" <${process.env.SMTP_FROM}>`,
    to: subscriberEmail,
    subject: `New Blog: ${blogTitle}`,
    html,
  });
}

async function sendContactEmail({ name, email, country_code, phone, subject, message }) {
  const html = `
    <h2>New Contact Form Submission</h2>
    <table style="border-collapse:collapse;width:100%;max-width:600px">
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Name</td><td style="padding:8px;border:1px solid #ddd">${name}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #ddd">${email}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Phone</td><td style="padding:8px;border:1px solid #ddd">${country_code || '+91'} ${phone || 'N/A'}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Subject</td><td style="padding:8px;border:1px solid #ddd">${subject || 'N/A'}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Message</td><td style="padding:8px;border:1px solid #ddd">${message}</td></tr>
    </table>
  `;

  await transporter.sendMail({
    from: `"Regent Biochem Contact" <${process.env.SMTP_FROM}>`,
    to: process.env.MAIL_TO,
    replyTo: email,
    subject: `Contact Form: ${subject || 'New Inquiry'} from ${name}`,
    html,
  });
}

module.exports = { sendContactEmail, sendBlogNotificationEmail };

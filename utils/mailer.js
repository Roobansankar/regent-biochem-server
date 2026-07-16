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

async function sendBlogNotificationEmail({ subscriberEmail, blogTitle, blogExcerpt, blogCategory, blogSlug, blogImage, unsubscribeToken }) {
  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
  const blogUrl = `${FRONTEND_URL}/blog/${blogSlug}`;
  const blogsUrl = `${FRONTEND_URL}/blog`;
  const contactUrl = `${FRONTEND_URL}/contact`;
  const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000';
  const unsubscribeUrl = `${SERVER_URL}/api/subscribers/unsubscribe?token=${unsubscribeToken}`;
  const logoUrl = `${FRONTEND_URL}/logo-email.png`;

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e2e2e2">
      <div style="background:#fff;padding:24px;text-align:center;border-bottom:1px solid #e2e2e2">
        <img src="${logoUrl}" alt="Bio-Chem Logo" style="height:40px;width:auto;margin:0 auto 10px;display:block" />
        <p style="margin:0;font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase">
          <span style="color:#3D8A4B">GREEN</span><span style="color:#111"> WAY TO </span><span style="color:#3D8A4B">GROWTH</span>
        </p>
      </div>
      ${blogImage ? `
      <div style="width:100%;line-height:0">
        <img src="${blogImage}" alt="${blogTitle}" style="width:100%;height:auto;display:block;max-height:280px;object-fit:cover" />
      </div>
      ` : ''}
      <div style="padding:32px;text-align:center">
        ${blogCategory ? `<span style="display:inline-block;background:#edf7f0;color:#3D8A4B;font-size:11px;font-weight:bold;padding:4px 12px;border-radius:4px;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px">${blogCategory}</span>` : ''}
        <h2 style="color:#111;font-size:18px;margin:0 0 12px;text-align:left">${blogTitle}</h2>
        <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 24px;text-align:left">${blogExcerpt || ''}</p>
        <a href="${blogUrl}" style="display:inline-block;background:#3D8A4B;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:bold">Read Full Article</a>
      </div>
      <div style="padding:24px 32px;border-top:1px solid #e2e2e2;text-align:center">
        <div style="margin-bottom:16px">
          <a href="${blogsUrl}" style="color:#3D8A4B;font-size:13px;font-weight:bold;text-decoration:none;margin:0 12px">View All Blogs</a>
          <span style="color:#ddd">|</span>
          <a href="${contactUrl}" style="color:#3D8A4B;font-size:13px;font-weight:bold;text-decoration:none;margin:0 12px">Contact Us</a>
        </div>
        <div style="margin-bottom:16px">
          <a href="https://www.linkedin.com/company/regent-biochem/" target="_blank" style="display:inline-block;width:36px;height:36px;background:#f0f2f5;border-radius:50%;line-height:36px;text-align:center;margin:0 4px;text-decoration:none">
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/linkedin.svg" alt="LinkedIn" style="width:16px;height:16px;vertical-align:middle;filter:invert(0.4)" />
          </a>
          <a href="https://youtube.com/@regentbio-chem?si=yOEOWQuYKA7JCwUa" target="_blank" style="display:inline-block;width:36px;height:36px;background:#f0f2f5;border-radius:50%;line-height:36px;text-align:center;margin:0 4px;text-decoration:none">
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/youtube.svg" alt="YouTube" style="width:16px;height:16px;vertical-align:middle;filter:invert(0.4)" />
          </a>
          <a href="https://www.facebook.com/profile.php?id=61591484781451" target="_blank" style="display:inline-block;width:36px;height:36px;background:#f0f2f5;border-radius:50%;line-height:36px;text-align:center;margin:0 4px;text-decoration:none">
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/facebook.svg" alt="Facebook" style="width:16px;height:16px;vertical-align:middle;filter:invert(0.4)" />
          </a>
          <a href="https://www.instagram.com/regent_biochem/" target="_blank" style="display:inline-block;width:36px;height:36px;background:#f0f2f5;border-radius:50%;line-height:36px;text-align:center;margin:0 4px;text-decoration:none">
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/instagram.svg" alt="Instagram" style="width:16px;height:16px;vertical-align:middle;filter:invert(0.4)" />
          </a>
        </div>
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

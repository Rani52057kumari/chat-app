/**
 * Email Service
 * Handles sending emails using nodemailer with Gmail SMTP
 */

const nodemailer = require('nodemailer');

/**
 * Create nodemailer transporter
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

/**
 * Send password reset email
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email
 * @param {string} options.name - Recipient name
 * @param {string} options.resetUrl - Password reset URL
 */
const sendPasswordResetEmail = async ({ email, name, resetUrl }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Chat App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset Request - Chat App',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 30px;
              border-radius: 10px;
              color: white;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 8px;
              margin-top: 20px;
              color: #333;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
              font-weight: bold;
            }
            .footer {
              margin-top: 20px;
              font-size: 12px;
              color: #999;
              text-align: center;
            }
            .warning {
              background: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
              color: #856404;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>💬 Chat App</h1>
            <div class="content">
              <h2>Password Reset Request</h2>
              <p>Hi <strong>${name}</strong>,</p>
              <p>You requested to reset your password. Click the button below to create a new password:</p>
              
              <a href="${resetUrl}" class="button">Reset Password</a>
              
              <div class="warning">
                <strong>⚠️ Security Notice:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>This link will expire in <strong>15 minutes</strong></li>
                  <li>If you didn't request this, please ignore this email</li>
                  <li>Never share this link with anyone</li>
                </ul>
              </div>
              
              <p>Or copy and paste this URL into your browser:</p>
              <p style="word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 4px;">
                ${resetUrl}
              </p>
              
              <p style="margin-top: 30px;">
                If you didn't request a password reset, you can safely ignore this email. 
                Your password will not be changed.
              </p>
              
              <p>
                Best regards,<br>
                <strong>Chat App Team</strong>
              </p>
            </div>
          </div>
          
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; ${new Date().getFullYear()} Chat App. All rights reserved.</p>
          </div>
        </body>
      </html>
    `
  };

  try {
    console.log('📧 Attempting to send email to:', email);
    console.log('📧 Using email account:', process.env.EMAIL_USER);
    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}`);
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    console.error('❌ Full error:', error);
    throw new Error('Email could not be sent');
  }
};

module.exports = {
  sendPasswordResetEmail
};

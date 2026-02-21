/**
 * Test Email Configuration
 * Run: node test-email.js
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('\n🔍 Testing Email Configuration...\n');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '***' + process.env.EMAIL_PASSWORD.slice(-4) : 'NOT SET');
console.log('\n');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  },
  debug: true, // Enable debug output
  logger: true // Log to console
});

async function testEmail() {
  try {
    console.log('📧 Testing SMTP connection...\n');
    
    // Verify connection
    await transporter.verify();
    console.log('\n✅ SMTP Connection successful!\n');
    
    // Send test email
    console.log('📧 Sending test email...\n');
    const info = await transporter.sendMail({
      from: `"Chat App Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: 'Test Email - Chat App',
      html: '<h1>Test Successful!</h1><p>Your email configuration is working correctly.</p>'
    });
    
    console.log('\n✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('\n✅✅✅ EMAIL CONFIGURATION IS WORKING! ✅✅✅\n');
    
  } catch (error) {
    console.error('\n❌ EMAIL TEST FAILED!\n');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    console.error('\nFull Error:', error);
    
    if (error.code === 'EAUTH') {
      console.error('\n⚠️  AUTHENTICATION FAILED!');
      console.error('Please check:');
      console.error('1. Email address is correct');
      console.error('2. App Password is correct (16 characters, no spaces)');
      console.error('3. 2-Step Verification is enabled on Google Account');
      console.error('4. App Password was generated correctly\n');
    }
  }
  
  process.exit(0);
}

testEmail();

# Password Reset Feature Documentation

## Overview
Secure Forgot Password and Reset Password functionality has been added to the Chat App backend.

## Features
✅ Secure token generation using `crypto`  
✅ Token expiration (15 minutes)  
✅ Email notifications via Gmail SMTP  
✅ Password validation with bcrypt hashing  
✅ Rate limiting for security  
✅ Clean JSON responses  

---

## 📁 Files Added/Modified

### New Files Created:
1. **`/server/utils/emailService.js`** - Email service using nodemailer
   - Handles password reset email sending
   - Professional HTML email template
   - Gmail SMTP configuration

### Modified Files:
2. **`/server/models/User.js`**
   - Added `resetPasswordToken` field (hashed)
   - Added `resetPasswordExpire` field (Date)
   - Added `getResetPasswordToken()` method

3. **`/server/controllers/authController.js`**
   - Added `forgotPassword()` controller
   - Added `resetPassword()` controller

4. **`/server/middleware/validationMiddleware.js`**
   - Added `forgotPasswordSchema` validation
   - Added `resetPasswordSchema` validation

5. **`/server/routes/authRoutes.js`**
   - Added `/forgot-password` route
   - Added `/reset-password/:token` route

6. **`/server/.env` & `/server/.env.example`**
   - Added email configuration variables

---

## 🔧 Setup Instructions

### Step 1: Install Dependencies
Nodemailer has already been installed. If you need to reinstall:
```bash
cd server
npm install nodemailer
```

### Step 2: Configure Gmail SMTP

#### Generate Gmail App Password:
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification** (enable if not enabled)
3. Scroll down to **App passwords**
4. Select app: **Mail**, Select device: **Other (Custom name)**
5. Enter name: "Chat App"
6. Click **Generate**
7. Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`)

### Step 3: Update Environment Variables

Edit `/server/.env`:
```env
# Email Configuration
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_16_char_app_password
```

**Important Notes:**
- Use App-Specific Password, **NOT** your regular Gmail password
- Remove spaces from the App Password
- Keep these credentials secret

### Step 4: Restart Server
```bash
# Stop current server (Ctrl + C)
cd server
npm run dev
```

---

## 📡 API Endpoints

### 1. Forgot Password

**Endpoint:** `POST /api/auth/forgot-password`  
**Access:** Public  
**Rate Limit:** Yes (via authLimiter)

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset email sent successfully. Please check your inbox."
}
```

**Error Responses:**

404 - User Not Found:
```json
{
  "success": false,
  "message": "No user found with this email address"
}
```

400 - Validation Error:
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

500 - Email Send Error:
```json
{
  "success": false,
  "message": "Email could not be sent. Please try again later."
}
```

---

### 2. Reset Password

**Endpoint:** `POST /api/auth/reset-password/:token`  
**Access:** Public  
**Rate Limit:** Yes (via authLimiter)

**URL Parameters:**
- `token` - Reset token received via email

**Request Body:**
```json
{
  "password": "NewPassword123"
}
```

**Password Requirements:**
- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset successful. You can now login with your new password.",
  "data": {
    "token": "jwt_token_here"
  }
}
```

**Error Responses:**

400 - Invalid/Expired Token:
```json
{
  "success": false,
  "message": "Invalid or expired reset token"
}
```

400 - Validation Error:
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "password",
      "message": "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    }
  ]
}
```

---

## 🔐 Security Features

1. **Secure Token Generation**
   - Uses `crypto.randomBytes(32)` for random token
   - Token is hashed with SHA-256 before storing in database
   - Only hashed version stored, plain token sent via email

2. **Token Expiration**
   - Tokens expire after 15 minutes
   - Expired tokens are rejected automatically
   - Server validates expiration on every reset attempt

3. **Rate Limiting**
   - Both endpoints protected by `authLimiter`
   - Prevents brute force attacks
   - Configurable limits in security middleware

4. **Password Hashing**
   - New passwords hashed with bcrypt (10 rounds)
   - Automatic hashing via mongoose pre-save hook
   - Old password never sent or stored in plain text

5. **Email Validation**
   - Joi schema validates email format
   - Case-insensitive email lookup
   - Trimmed and lowercase conversion

6. **Database Security**
   - Reset token fields excluded from default queries (`select: false`)
   - Token cleared after successful reset
   - No validation errors expose user existence

---

## 📧 Email Template

The password reset email includes:
- Professional branding with gradient design
- Clear call-to-action button
- Security warnings and instructions
- 15-minute expiration notice
- Direct URL link as fallback
- Mobile-responsive design

**Email Preview:**
```
Subject: Password Reset Request - Chat App

Hi [User Name],

You requested to reset your password. Click the button below to create a new password:

[Reset Password Button]

⚠️ Security Notice:
• This link will expire in 15 minutes
• If you didn't request this, please ignore this email
• Never share this link with anyone

Or copy and paste this URL:
http://localhost:3000/reset-password/[token]
```

---

## 🧪 Testing the Feature

### Using cURL:

**1. Request Password Reset:**
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

**2. Reset Password (replace TOKEN with actual token from email):**
```bash
curl -X POST http://localhost:5000/api/auth/reset-password/TOKEN \
  -H "Content-Type: application/json" \
  -d '{"password":"NewPassword123"}'
```

### Using Postman:

**1. Forgot Password:**
- Method: POST
- URL: `http://localhost:5000/api/auth/forgot-password`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
  ```json
  {
    "email": "test@example.com"
  }
  ```

**2. Reset Password:**
- Method: POST
- URL: `http://localhost:5000/api/auth/reset-password/[token]`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
  ```json
  {
    "password": "NewPassword123"
  }
  ```

---

## 🎨 Frontend Integration

### Reset Password Flow:

1. **Forgot Password Page:**
```jsx
const handleForgotPassword = async (email) => {
  const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  
  const data = await response.json();
  
  if (data.success) {
    alert('Reset email sent! Check your inbox.');
  }
};
```

2. **Reset Password Page:**
```jsx
const handleResetPassword = async (token, password) => {
  const response = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Store JWT token
    localStorage.setItem('token', data.data.token);
    // Redirect to chat
    navigate('/chat');
  }
};
```

3. **React Router Setup:**
```jsx
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password/:token" element={<ResetPassword />} />
```

---

## 🐛 Troubleshooting

### Email Not Sending:

**Problem:** "Email could not be sent"  
**Solutions:**
1. Verify Gmail credentials in `.env`
2. Check if 2-Step Verification is enabled
3. Use App Password, not regular password
4. Check Gmail account security settings
5. Ensure less secure app access is not required (deprecated)

### Invalid Token Error:

**Problem:** "Invalid or expired reset token"  
**Solutions:**
1. Check if 15 minutes have passed (token expired)
2. Verify token is exactly as sent in email (no extra spaces)
3. Ensure user hasn't already reset password (token deleted)
4. Try requesting a new reset email

### Rate Limit Error:

**Problem:** "Too many authentication attempts"  
**Solutions:**
1. Wait 15 minutes before retrying
2. Check authLimiter configuration in security middleware
3. Increase limit if necessary for development

---

## 📊 Database Schema Changes

**User Model - New Fields:**
```javascript
{
  resetPasswordToken: {
    type: String,
    select: false  // Not included in default queries
  },
  resetPasswordExpire: {
    type: Date,
    select: false  // Not included in default queries
  }
}
```

**Migration:** No migration needed. Fields are optional and added automatically on first use.

---

## 🔄 Workflow Diagram

```
User Forgets Password
         ↓
Enters Email → POST /api/auth/forgot-password
         ↓
Server validates email
         ↓
Server generates token (crypto.randomBytes)
         ↓
Server hashes token (SHA-256)
         ↓
Server saves hashed token + expiry to DB
         ↓
Server sends email with plain token
         ↓
User clicks link in email
         ↓
Frontend extracts token from URL
         ↓
User enters new password
         ↓
POST /api/auth/reset-password/:token
         ↓
Server hashes token and looks up in DB
         ↓
Server validates expiry (< 15 min)
         ↓
Server hashes new password (bcrypt)
         ↓
Server updates user password
         ↓
Server clears reset token fields
         ↓
Server returns JWT token
         ↓
User logged in with new password ✅
```

---

## ✅ Verification Checklist

- [ ] Nodemailer installed
- [ ] Gmail App Password generated
- [ ] `.env` file updated with email credentials
- [ ] Server restarted
- [ ] Forgot password endpoint tested
- [ ] Email received successfully
- [ ] Reset password endpoint tested
- [ ] Password successfully changed
- [ ] Old password no longer works
- [ ] New password works for login

---

## 📝 Notes

- **Existing APIs unchanged:** Login, Register, and other auth endpoints work exactly as before
- **Database compatible:** Works with existing User schema, no migration needed
- **Optional feature:** Works alongside existing authentication
- **Production ready:** Includes rate limiting, validation, and security best practices

---

## 🆘 Support

If you encounter any issues:
1. Check server logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test with a simple Gmail account first
4. Ensure server is running on correct port (5000)
5. Check firewall/network settings if emails don't send

---

**Created:** February 20, 2026  
**Version:** 1.0  
**Feature:** Password Reset with Email Verification

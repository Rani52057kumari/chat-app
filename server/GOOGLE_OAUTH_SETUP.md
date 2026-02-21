# Google OAuth 2.0 Setup Guide

This guide explains how to set up and use Google OAuth login in your chat application.

## 📋 Table of Contents
- [Overview](#overview)
- [Getting Google OAuth Credentials](#getting-google-oauth-credentials)
- [Configuration](#configuration)
- [How It Works](#how-it-works)
- [API Endpoints](#api-endpoints)
- [Frontend Integration](#frontend-integration)
- [Testing](#testing)
- [Security Considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)

---

## 🔍 Overview

The Google OAuth implementation allows users to:
- Sign in with their Google account
- Automatically create an account if they don't have one
- Link their Google account to an existing email/password account
- Receive a JWT token for authenticated API access

**Features:**
- ✅ Works alongside existing email/password authentication
- ✅ Automatic account linking for duplicate emails
- ✅ Secure JWT token generation
- ✅ No session storage (stateless authentication)
- ✅ Passport.js integration with Google Strategy

---

## 🔑 Getting Google OAuth Credentials

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** → **New Project**
3. Enter a project name (e.g., "Chat App OAuth")
4. Click **Create**

### Step 2: Enable Google+ API

1. In your project, go to **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click on it and press **Enable**

### Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client IDs**
3. Configure the consent screen if prompted:
   - User Type: **External**
   - App name: Your app name
   - User support email: Your email
   - Developer contact: Your email
   - Click **Save and Continue**

4. Configure OAuth Client:
   - Application type: **Web application**
   - Name: "Chat App OAuth Client"
   
   - **Authorized JavaScript origins:**
     ```
     http://localhost:5000
     http://localhost:3000
     ```
   
   - **Authorized redirect URIs:**
     ```
     http://localhost:5000/api/auth/google/callback
     ```
     
     **For production:**
     ```
     https://yourdomain.com/api/auth/google/callback
     ```

5. Click **Create**
6. Copy the **Client ID** and **Client Secret**

---

## ⚙️ Configuration

### 1. Update `.env` File

Add the following to your `/server/.env` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_actual_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

Replace `your_actual_client_id_here` and `your_actual_client_secret_here` with the credentials you copied.

### 2. Production Setup

For production, update:
```env
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
```

And add this URL to **Authorized redirect URIs** in Google Cloud Console.

---

## 🔄 How It Works

### Authentication Flow

```
1. User clicks "Login with Google" on frontend
   ↓
2. Frontend redirects to: http://localhost:5000/api/auth/google
   ↓
3. User is redirected to Google's login page
   ↓
4. User authenticates with Google
   ↓
5. Google redirects back to: /api/auth/google/callback
   ↓
6. Backend (Passport) verifies the user with Google
   ↓
7. Backend checks if user exists:
   - If user has googleId → Return existing user
   - If email exists (from email/password signup) → Link accounts
   - If new user → Create new user with Google info
   ↓
8. Backend generates JWT token
   ↓
9. Backend redirects to: http://localhost:3000/auth/success?token=JWT_TOKEN
   ↓
10. Frontend extracts token from URL and stores it
    ↓
11. User is logged in!
```

### Backend Implementation

**Files Modified:**

1. **`/server/models/User.js`**
   - Added `googleId` field (unique, sparse index)
   - Added `authProvider` field ('local' or 'google')
   - Made `password` optional (not required for Google users)

2. **`/server/config/passport.js`** (NEW)
   - Configures Passport with GoogleStrategy
   - Handles user lookup, creation, and account linking
   - Returns authenticated user

3. **`/server/controllers/authController.js`**
   - Added `googleAuthCallback` controller
   - Generates JWT token and redirects to frontend

4. **`/server/routes/authRoutes.js`**
   - Added `GET /google` - Initiates OAuth flow
   - Added `GET /google/callback` - Handles OAuth response

5. **`/server/server.js`**
   - Imports passport configuration
   - Initializes `passport.initialize()` middleware

---

## 🌐 API Endpoints

### 1. Initiate Google OAuth

**Endpoint:** `GET /api/auth/google`

**Description:** Redirects user to Google's login page

**Usage:**
```javascript
// Frontend button click
<a href="http://localhost:5000/api/auth/google">
  Login with Google
</a>
```

---

### 2. Google OAuth Callback

**Endpoint:** `GET /api/auth/google/callback`

**Description:** Google redirects here after authentication

**Success Response:**
- Redirects to: `http://localhost:3000/auth/success?token=JWT_TOKEN`

**Error Response:**
- Redirects to: `http://localhost:3000/login?error=oauth_failed`

---

## 💻 Frontend Integration

### React Example

#### 1. Create OAuth Success Handler

Create `/client/src/pages/AuthSuccess.js`:

```javascript
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Redirect to dashboard/home
      navigate('/');
    } else {
      // No token found, redirect to login
      navigate('/login?error=no_token');
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing login...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;
```

#### 2. Add Route

In `/client/src/App.js`:

```javascript
import AuthSuccess from './pages/AuthSuccess';

// Inside your routes
<Route path="/auth/success" element={<AuthSuccess />} />
```

#### 3. Add Google Login Button

In your Login component:

```javascript
const Login = () => {
  const handleGoogleLogin = () => {
    // Redirect to backend OAuth endpoint
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div>
      {/* Existing email/password form */}
      
      {/* Google OAuth Button */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="mt-4 w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="text-gray-700 font-medium">Sign in with Google</span>
        </button>
      </div>
    </div>
  );
};
```

---

## 🧪 Testing

### Manual Testing Steps

1. **Restart the server** to load new environment variables:
   ```bash
   cd server
   npm start
   ```

2. **Visit your login page:**
   ```
   http://localhost:3000/login
   ```

3. **Click "Sign in with Google"**

4. **Authorize the app** on Google's consent screen

5. **Check the result:**
   - You should be redirected to `/auth/success?token=...`
   - Token should be stored in localStorage
   - You should be logged in

### Testing with cURL (Backend Only)

```bash
# This will redirect you to Google's login page
curl -L http://localhost:5000/api/auth/google
```

### Check User in Database

After logging in, check MongoDB:

```javascript
// In MongoDB Compass or Shell
db.users.find({ authProvider: "google" })
```

You should see:
```json
{
  "_id": ObjectId("..."),
  "googleId": "1234567890",
  "name": "John Doe",
  "email": "john@gmail.com",
  "authProvider": "google",
  "avatar": "https://lh3.googleusercontent.com/...",
  // No password field for Google users
}
```

---

## 🔒 Security Considerations

### ✅ Implemented Security Features

1. **No Session Storage**
   - Uses JWT tokens (stateless authentication)
   - Tokens are short-lived (configurable via `JWT_EXPIRE`)

2. **HTTPS Required in Production**
   - OAuth callback URL must use HTTPS in production
   - Google enforces this for security

3. **Client Secret Protection**
   - Client secret stored in `.env` file
   - Never exposed to frontend
   - Added to `.gitignore`

4. **Account Linking**
   - If email exists (from email/password signup), accounts are linked
   - Prevents duplicate accounts
   - User can access via both methods

5. **Email Verification**
   - Google verifies email addresses
   - Only verified Gmail accounts can log in

### 🛡️ Best Practices

1. **Rotate Secrets Regularly**
   - Generate new Client Secret every 90 days in production

2. **Use Environment Variables**
   - Never hardcode credentials
   - Different credentials for dev/prod

3. **Restrict Redirect URIs**
   - Only whitelist trusted domains
   - Remove `localhost` in production

4. **Monitor OAuth Usage**
   - Check Google Cloud Console for unusual activity
   - Set up alerts for quota limits

5. **Implement Rate Limiting**
   - Already implemented via `authLimiter` middleware
   - Prevents brute force attacks

---

## 🐛 Troubleshooting

### Error: "Error: redirect_uri_mismatch"

**Cause:** The redirect URI doesn't match what's configured in Google Cloud Console

**Solution:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Edit your OAuth 2.0 Client ID
3. Add the exact redirect URI: `http://localhost:5000/api/auth/google/callback`
4. Make sure there are no trailing slashes

---

### Error: "OAuth failed - redirected to login"

**Cause:** Passport authentication failed

**Solution:**
1. Check server logs for detailed error
2. Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`
3. Make sure Google+ API is enabled
4. Restart the server after environment changes

---

### Error: "User is created but no token returned"

**Cause:** JWT generation issue

**Solution:**
1. Verify `JWT_SECRET` is set in `.env`
2. Check `generateToken()` function in `authController.js`
3. Look for errors in server console

---

### Error: "Cannot read property 'emails' of undefined"

**Cause:** Google profile doesn't include email

**Solution:**
1. Make sure email scope is requested:
   ```javascript
   scope: ['profile', 'email']
   ```
2. Check if user's Google account has an email

---

### User Exists with Email/Password, How to Link?

**Automatic:** When a user with an existing email (from email/password signup) logs in via Google, the accounts are automatically linked.

**Manual Check:**
```javascript
// In passport.js, this handles linking:
const existingUser = await User.findOne({ email: profile.emails[0].value });
if (existingUser) {
  existingUser.googleId = profile.id;
  existingUser.authProvider = 'google';
  await existingUser.save();
  return done(null, existingUser);
}
```

---

## 📚 Additional Resources

- [Passport.js Documentation](http://www.passportjs.org/docs/)
- [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

## 🎉 Summary

You've successfully implemented Google OAuth 2.0 login! Users can now:
- ✅ Sign in with Google (one-click login)
- ✅ Create accounts automatically
- ✅ Link Google accounts to existing accounts
- ✅ Use both email/password and Google login methods

**Next Steps:**
1. Get Google OAuth credentials from Cloud Console
2. Update `.env` with your credentials
3. Restart the server
4. Test the OAuth flow
5. Implement the frontend integration

---

**Questions or Issues?** Check the Troubleshooting section or review the implementation files.


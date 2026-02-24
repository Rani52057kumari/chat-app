/**
 * Authentication Routes
 * Handles user authentication endpoints
 */

const express = require('express');
const passport = require('passport');
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  searchUsers,
  changePassword,
  forgotPassword,
  resetPassword,
  googleAuthCallback,
  uploadAvatar
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/securityMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
  validateRequest,
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} = require('../middleware/validationMiddleware');

const router = express.Router();

// Public routes with rate limiting
router.post(
  '/register',
  authLimiter,
  validateRequest(registerSchema),
  registerUser
);

router.post(
  '/login',
  authLimiter,
  validateRequest(loginSchema),
  loginUser
);

// Protected routes
router.get('/me', protect, getMe);

router.put(
  '/profile',
  protect,
  validateRequest(updateProfileSchema),
  updateProfile
);

router.post(
  '/upload-avatar',
  protect,
  upload.single('avatar'),
  uploadAvatar
);

router.put(
  '/change-password',
  protect,
  authLimiter,
  validateRequest(changePasswordSchema),
  changePassword
);

router.get('/users', protect, searchUsers);

// Password reset routes
router.post(
  '/forgot-password',
  authLimiter,
  validateRequest(forgotPasswordSchema),
  forgotPassword
);

router.post(
  '/reset-password/:token',
  authLimiter,
  validateRequest(resetPasswordSchema),
  resetPassword
);

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`
  }),
  googleAuthCallback
);

module.exports = router;

/**
 * Authentication Controller
 * Handles user registration, login, and profile management
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendPasswordResetEmail } = require('../utils/emailService');
const { 
  asyncHandler, 
  AuthenticationError, 
  ConflictError, 
  NotFoundError,
  BadRequestError
} = require('../middleware/errorMiddleware');

/**
 * Generate JWT Token
 * @param {string} id - User ID
 * @returns {string} JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ConflictError('User already exists with this email');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password
  });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      onboardingCompleted: user.onboardingCompleted,
      onboardingStep: user.onboardingStep,
      token: generateToken(user._id)
    }
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Update online status
  user.isOnline = true;
  user.lastSeen = Date.now();
  await user.save();

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      isOnline: user.isOnline,
      onboardingCompleted: user.onboardingCompleted,
      onboardingStep: user.onboardingStep,
      token: generateToken(user._id)
    }
  });
});

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      phone: user.phone,
      isOnline: user.isOnline,
      lastSeen: user.lastSeen,
      onboardingCompleted: user.onboardingCompleted,
      onboardingStep: user.onboardingStep
    }
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  user.name = req.body.name || user.name;
  user.bio = req.body.bio || user.bio;
  
  if (req.body.phone !== undefined) {
    user.phone = req.body.phone;
  }
  
  if (req.body.avatar) {
    user.avatar = req.body.avatar;
  }

  const updatedUser = await user.save();

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
      phone: updatedUser.phone
    }
  });
});

/**
 * @desc    Change user password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Check current password
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    throw new AuthenticationError('Current password is incorrect');
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});

/**
 * @desc    Search users
 * @route   GET /api/auth/users?search=keyword
 * @access  Private
 */
const searchUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } }
        ]
      }
    : {};

  // Find users excluding current user
  const users = await User.find(keyword)
    .find({ _id: { $ne: req.user._id } })
    .select('-password')
    .limit(10);

  res.json({
    success: true,
    count: users.length,
    data: users
  });
});

/**
 * @desc    Forgot password - Send reset email
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundError('No user found with this email address');
  }

  // Generate reset token
  const resetToken = user.getResetPasswordToken();

  // Save user with reset token (without validation to avoid password required error)
  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  try {
    // Send email
    await sendPasswordResetEmail({
      email: user.email,
      name: user.name,
      resetUrl
    });

    res.json({
      success: true,
      message: 'Password reset email sent successfully. Please check your inbox.'
    });
  } catch (error) {
    // If email fails, remove reset token from database
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    throw new Error('Email could not be sent. Please try again later.');
  }
});

/**
 * @desc    Reset password using token
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;

  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // Find user with valid token
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  }).select('+resetPasswordToken +resetPasswordExpire');

  if (!user) {
    throw new BadRequestError('Invalid or expired reset token');
  }

  // Set new password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  // Save user (password will be hashed by pre-save hook)
  await user.save();

  // Generate new JWT token
  const token = generateToken(user._id);

  res.json({
    success: true,
    message: 'Password reset successful. You can now login with your new password.',
    data: {
      token
    }
  });
});

/**
 * @desc    Google OAuth callback - Generate JWT token
 * @route   GET /api/auth/google/callback
 * @access  Public (Passport handles authentication)
 */
const googleAuthCallback = asyncHandler(async (req, res) => {
  // User is already authenticated by passport
  const user = req.user;

  // Generate JWT token
  const token = generateToken(user._id);

  // Send success response - redirect to client with token
  res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
});

/**
 * @desc    Upload user avatar
 * @route   POST /api/auth/upload-avatar
 * @access  Private
 */
const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new BadRequestError('Please upload an image file');
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Get file URL - depends on storage type (local or cloudinary)
  let avatarUrl;
  if (req.file.path.startsWith('http')) {
    // Cloudinary URL
    avatarUrl = req.file.path;
  } else {
    // Local file path
    avatarUrl = `${process.env.API_URL || 'http://localhost:5000'}/uploads/${req.file.filename}`;
  }

  user.avatar = avatarUrl;
  const updatedUser = await user.save();

  res.json({
    success: true,
    message: 'Avatar uploaded successfully',
    data: {
      avatar: updatedUser.avatar
    }
  });
});

/**
 * @desc    Update onboarding status
 * @route   PUT /api/auth/onboarding
 * @access  Private
 */
const updateOnboarding = asyncHandler(async (req, res) => {
  const { step, completed } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (step !== undefined) {
    user.onboardingStep = step;
  }

  if (completed !== undefined) {
    user.onboardingCompleted = completed;
  }

  const updatedUser = await user.save();

  res.json({
    success: true,
    message: 'Onboarding status updated',
    data: {
      onboardingCompleted: updatedUser.onboardingCompleted,
      onboardingStep: updatedUser.onboardingStep
    }
  });
});

/**
 * @desc    Get public profile
 * @route   GET /api/users/:userId/public-profile
 * @access  Private
 */
const getPublicProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).select('name avatar bio isOnline lastSeen createdAt city state country locationEnabled');

  if (!user) {
    throw new NotFoundError('User not found');
  }

  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio || 'Hey there! I am using Chat App',
      isOnline: user.isOnline,
      lastSeen: user.lastSeen,
      joinedDate: user.createdAt,
      city: user.city,
      state: user.state,
      country: user.country,
      locationEnabled: user.locationEnabled
    }
  });
});

/**
 * @desc    Update user location
 * @route   PUT /api/users/update-location
 * @access  Private
 */
const updateLocation = asyncHandler(async (req, res) => {
  const { city, state, country, locationEnabled } = req.body;

  // Validate locationEnabled flag
  if (typeof locationEnabled !== 'boolean') {
    throw new BadRequestError('locationEnabled must be a boolean value');
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Update location fields
  user.city = city || null;
  user.state = state || null;
  user.country = country || null;
  user.locationEnabled = locationEnabled;
  user.lastLocationUpdate = locationEnabled ? Date.now() : null;

  await user.save();

  res.json({
    success: true,
    message: 'Location updated successfully',
    data: {
      city: user.city,
      state: user.state,
      country: user.country,
      locationEnabled: user.locationEnabled,
      lastLocationUpdate: user.lastLocationUpdate
    }
  });
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
  searchUsers,
  forgotPassword,
  resetPassword,
  googleAuthCallback,
  uploadAvatar,
  updateOnboarding,
  getPublicProfile,
  updateLocation
};

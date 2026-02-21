/**
 * File Upload Middleware
 * Handles file uploads for images and PDFs (supports local and Cloudinary)
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const config = require('../config/env');

// Configure Cloudinary if credentials are provided
if (config.cloudinary.enabled) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret
  });
}

// Storage configuration based on environment
const getStorage = () => {
  // Use Cloudinary in production if configured
  if (config.nodeEnv === 'production' && config.cloudinary.enabled) {
    return new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'chat-app',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf'],
        resource_type: 'auto',
        transformation: [
          { width: 1000, height: 1000, crop: 'limit' }
        ]
      }
    });
  }

  // Use local storage for development
  const uploadDir = './uploads';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
};

// File filter - Only allow specific file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|mp4|mp3/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype.startsWith('image/') || 
                   file.mimetype.startsWith('video/') || 
                   file.mimetype.startsWith('audio/') || 
                   file.mimetype === 'application/pdf' ||
                   file.mimetype === 'application/msword' ||
                   file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, videos, audio, PDFs and documents are allowed!'), false);
  }
};

// Configure multer
const upload = multer({
  storage: getStorage(),
  limits: {
    fileSize: config.upload.maxFileSize, // 10MB default
    files: config.upload.maxFiles
  },
  fileFilter: fileFilter
});

/**
 * Error handler for multer
 */
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: `File too large. Maximum size is ${config.upload.maxFileSize / (1024 * 1024)}MB`
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: `Too many files. Maximum is ${config.upload.maxFiles}`
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  next();
};

module.exports = upload;
module.exports.handleMulterError = handleMulterError;
module.exports.cloudinary = cloudinary;

/**
 * Validation Middleware
 * Joi schemas for request validation
 */

const Joi = require('joi');

/**
 * Validate request body against schema
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    req.body = value;
    next();
  };
};

/**
 * User Registration Validation Schema
 */
const registerSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .trim()
    .messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters',
      'any.required': 'Name is required'
    }),
  email: Joi.string()
    .email()
    .required()
    .lowercase()
    .trim()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .min(6)
    .max(128)
    .required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      'any.required': 'Password is required'
    }),
  avatar: Joi.string().uri().optional()
});

/**
 * User Login Validation Schema
 */
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .lowercase()
    .trim()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});

/**
 * Update Profile Validation Schema
 */
const updateProfileSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .trim()
    .optional(),
  avatar: Joi.string().uri().optional(),
  bio: Joi.string().max(200).trim().optional(),
  phone: Joi.string()
    .pattern(/^[+]?[0-9\s\-().]{7,20}$/)
    .trim()
    .allow('')
    .optional()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number'
    })
});

/**
 * Change Password Validation Schema
 */
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'any.required': 'Current password is required'
    }),
  newPassword: Joi.string()
    .min(6)
    .max(128)
    .required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .messages({
      'string.min': 'New password must be at least 6 characters long',
      'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, and one number',
      'any.required': 'New password is required'
    })
});

/**
 * Forgot Password Validation Schema
 */
const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .lowercase()
    .trim()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    })
});

/**
 * Reset Password Validation Schema
 */
const resetPasswordSchema = Joi.object({
  password: Joi.string()
    .min(6)
    .max(128)
    .required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      'any.required': 'Password is required'
    })
});

/**
 * Create Chat Validation Schema
 */
const createChatSchema = Joi.object({
  userId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid user ID format',
      'any.required': 'User ID is required'
    })
});

/**
 * Create Group Chat Validation Schema
 */
const createGroupChatSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .required()
    .trim()
    .messages({
      'string.min': 'Group name must be at least 3 characters long',
      'string.max': 'Group name cannot exceed 50 characters',
      'any.required': 'Group name is required'
    }),
  users: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .min(2)
    .required()
    .messages({
      'array.min': 'Group must have at least 2 users',
      'any.required': 'Users array is required'
    }),
  groupImage: Joi.string().uri().optional()
});

/**
 * Update Group Chat Validation Schema
 */
const updateGroupSchema = Joi.object({
  chatName: Joi.string()
    .min(3)
    .max(50)
    .trim()
    .optional(),
  groupImage: Joi.string().uri().optional()
});

/**
 * Add/Remove User Group Validation Schema
 */
const groupUserSchema = Joi.object({
  chatId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid chat ID format',
      'any.required': 'Chat ID is required'
    }),
  userId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid user ID format',
      'any.required': 'User ID is required'
    })
});

/**
 * Send Message Validation Schema
 */
const sendMessageSchema = Joi.object({
  chatId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid chat ID format',
      'any.required': 'Chat ID is required'
    }),
  content: Joi.string()
    .max(5000)
    .when('fileUrl', {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required()
    })
    .messages({
      'string.max': 'Message content cannot exceed 5000 characters',
      'any.required': 'Message content is required'
    }),
  fileUrl: Joi.string().uri().optional(),
  fileType: Joi.string()
    .valid('image', 'video', 'audio', 'document')
    .optional(),
  fileName: Joi.string().max(255).optional()
});

module.exports = {
  validateRequest,
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  createChatSchema,
  createGroupChatSchema,
  updateGroupSchema,
  groupUserSchema,
  sendMessageSchema
};

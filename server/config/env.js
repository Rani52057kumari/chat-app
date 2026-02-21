/**
 * Environment Variables Configuration
 * Validates and loads environment variables
 */

const Joi = require('joi');
require('dotenv').config();

/**
 * Environment variables schema
 */
const envSchema = Joi.object({
  // Server
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(5000),
  CLIENT_URL: Joi.string().required(),

  // Database
  MONGO_URI: Joi.string().required(),

  // JWT
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRE: Joi.string().default('30d'),

  // File Upload (Optional - for cloud storage)
  CLOUDINARY_CLOUD_NAME: Joi.string().optional(),
  CLOUDINARY_API_KEY: Joi.string().optional(),
  CLOUDINARY_API_SECRET: Joi.string().optional(),

  // Upload limits
  MAX_FILE_SIZE: Joi.number().default(10485760), // 10MB in bytes
  MAX_FILES: Joi.number().default(1)
})
  .unknown()
  .required();

/**
 * Validate environment variables
 */
const validateEnv = () => {
  const { error, value: envVars } = envSchema.validate(process.env);

  if (error) {
    throw new Error(`❌ Environment validation error: ${error.message}`);
  }

  return envVars;
};

// Validate on load
const env = validateEnv();

/**
 * Export validated environment configuration
 */
module.exports = {
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  clientUrl: env.CLIENT_URL,
  
  database: {
    uri: env.MONGO_URI
  },
  
  jwt: {
    secret: env.JWT_SECRET,
    expire: env.JWT_EXPIRE
  },
  
  cloudinary: {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
    enabled: !!(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET)
  },
  
  upload: {
    maxFileSize: env.MAX_FILE_SIZE,
    maxFiles: env.MAX_FILES
  }
};

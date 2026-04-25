const jwt = require('jsonwebtoken');
require('dotenv').config();

// Validate secrets on startup
if (!process.env.JWT_SECRET) {
    console.error('❌ FATAL ERROR: JWT_SECRET is not defined in environment variables');
    process.exit(1);
}

if (!process.env.OTP_SECRET) {
    console.error('❌ FATAL ERROR: OTP_SECRET is not defined in environment variables');
    process.exit(1);
}

console.log('✅ JWT secrets are configured');

/**
 * Generates a standard user auth JWT token.
 * @param {Object} user - The user object.
 * @returns {string} JWT token
 */
const generateToken = (user) => {
  // Validate input
  if (!user || !user.user_id || !user.role) {
    console.error("Invalid user object for token generation:", user);
    throw new Error("User object missing required fields for token generation");
  }

  // Check if JWT_SECRET exists
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables");
    throw new Error("Server configuration error");
  }

  // Create payload
  const payload = {
    user_id: user.user_id,
    role: user.role,
    email: user.email || null,
    iat: Math.floor(Date.now() / 1000)
  };

  // Generate token
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY || '24h' }
  );

  // Verify token was generated correctly
  if (!token || token.split('.').length !== 3) {
    throw new Error("Token generation failed - invalid format");
  }

  return token;
};

/**
 * Verifies a JWT token.
 * @param {string} token - The JWT token.
 * @returns {Object} Decoded payload.
 * @throws {Error} If token is invalid or expired.
 */
const verifyToken = (token) => {
    if (!token) {
        throw new Error('No token provided');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Validate required fields
        if (!decoded.user_id || !decoded.role) {
            throw new Error('Token missing required fields');
        }
        
        return decoded;
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            throw new Error('Invalid token format');
        } else if (error.name === 'TokenExpiredError') {
            throw new Error('Token has expired');
        }
        throw error;
    }
};

/**
 * Generates an OTP verification JWT token.
 * @param {Object} params - Parameters object
 * @param {string} params.email - User email
 * @param {string} params.type - OTP purpose (e.g. 'signup', 'reset')
 * @returns {string} JWT token
 */
const generateOtpToken = ({ email, type }) => {
    try {
        if (!email || !type) {
            throw new Error('Email and type are required for OTP token');
        }

        const token = jwt.sign(
            { email, type },
            process.env.OTP_SECRET,
            { expiresIn: process.env.OTP_EXPIRY || '10m' }
        );

        // Verify token format
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('OTP token generation produced invalid format');
        }

        return token;

    } catch (error) {
        console.error('❌ OTP Token generation error:', error.message);
        throw new Error('Failed to generate OTP token');
    }
};

/**
 * Verifies an OTP JWT token.
 * @param {string} token - The OTP token.
 * @returns {Object} Decoded payload with email and type.
 * @throws {Error} If token is invalid or expired.
 */
const verifyOtpToken = (token) => {
    if (!token) {
        throw new Error('No OTP token provided');
    }

    try {
        const decoded = jwt.verify(token, process.env.OTP_SECRET);
        
        if (!decoded.email || !decoded.type) {
            throw new Error('Token missing required fields (email or type)');
        }

        return decoded;

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            throw new Error('Invalid OTP token format');
        } else if (error.name === 'TokenExpiredError') {
            throw new Error('OTP token has expired');
        }
        throw error;
    }
};

// Helper function to decode token without verification (for debugging only)
const decodeToken = (token) => {
    try {
        return jwt.decode(token);
    } catch (error) {
        console.error('Token decode error:', error.message);
        return null;
    }
};

module.exports = {
    generateToken,
    verifyToken,
    generateOtpToken,
    verifyOtpToken,
    decodeToken // Export for debugging
};
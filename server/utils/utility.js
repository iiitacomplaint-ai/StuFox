const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Generates a standard user auth JWT token.
 * @param {Object} user - The user object.
 * @returns {string} JWT token valid for 1 hour.
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      user_id: user.user_id,
      role: user.role  // Changed from 'user_role' to 'role' for consistency
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' } // Extended to 24 hours for better user experience
  );
};

/**
 * Verifies a JWT token.
 * @param {string} token - The JWT token.
 * @returns {Object} Decoded payload.
 * @throws {Error} If token is invalid or expired.
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Generates an OTP verification JWT token.
 * @param {string} email - User email.
 * @param {string} type - OTP purpose (e.g. 'signup', 'reset').
 * @returns {string} JWT token valid for 10 minutes.
 */
const generateOtpToken = ({email, type}) => {
  return jwt.sign(
    { email, type },
    process.env.OTP_SECRET,
    { expiresIn: '10m' }
  );
};

/**
 * Verifies an OTP JWT token.
 * @param {string} token - The OTP token.
 * @returns {Object} Decoded payload with email and type.
 * @throws {Error} If token is invalid or expired.
 */
const verifyOtpToken = (token) => {
  const decoded = jwt.verify(token, process.env.OTP_SECRET);
  
  // Ensure 'type' exists in decoded
  if (!decoded.type) {
    throw new Error("Token does not contain 'type' field.");
  }

  return decoded;
};

module.exports = {
  generateToken,
  verifyToken,
  generateOtpToken,
  verifyOtpToken
};
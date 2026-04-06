const express = require('express');
const router = express.Router();
const {
  signup,
  sendotp,
  verifyOtpCont,
  login,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword
} = require('../controller/authController');
const { authenticate } = require('../middleware/authMiddleware');

// Public Routes (No authentication required)
router.post('/send-otp', sendotp);
router.post('/verify-otp', verifyOtpCont);
router.post('/signup', signup);
router.post('/login', login);
router.post('/reset-password', resetPassword);

// Protected Routes (Authentication required)
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, changePassword);

// Optional: Logout route (client-side token removal)
router.post('/logout', authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Optional: Refresh token route
router.post('/refresh-token', authenticate, async (req, res) => {
  try {
    const user = req.user;
    const newToken = generateToken(user);
    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      token: newToken
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error refreshing token',
      error: error.message
    });
  }
});

module.exports = router;
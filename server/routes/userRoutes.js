const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getMyComplaints,
  getComplaintDetails,
  getComplaintHistory,
  cancelComplaint,
  withdrawComplaint,    // ✅ Add this
  reopenComplaint,
  getDashboardStats,
  getProfile,
  changePriority
} = require('../controller/userController');
const { authenticate, authorise } = require('../middleware/authMiddleware');

// All routes require authentication and user role
router.use(authenticate);
router.use(authorise(['user']));

// Profile Routes
router.get('/profile', getProfile);
router.get('/dashboard', getDashboardStats);

// Complaint Management Routes
router.post('/complaints', createComplaint);
router.get('/complaints', getMyComplaints);
router.get('/complaints/:complaint_id', getComplaintDetails);
router.get('/complaints/:complaint_id/history', getComplaintHistory);

// Complaint Action Routes
router.put('/complaints/:complaint_id/cancel', cancelComplaint);      // Deprecated - kept for backward compatibility
router.put('/complaints/:complaint_id/withdraw', withdrawComplaint);  // ✅ New - withdraw complaint
router.put('/complaints/:complaint_id/reopen', reopenComplaint);      // Updated - works with Withdrawn status
router.put('/complaints/:complaint_id/priority', changePriority);
module.exports = router;
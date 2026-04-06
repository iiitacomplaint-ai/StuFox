const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getMyComplaints,
  getComplaintDetails,
  getComplaintHistory,
  cancelComplaint,
  reopenComplaint,
  getDashboardStats,
  getProfile
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
router.put('/complaints/:complaint_id/cancel', cancelComplaint);
router.put('/complaints/:complaint_id/reopen', reopenComplaint);

module.exports = router;
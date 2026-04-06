const express = require('express');
const router = express.Router();
const {
  getAssignedComplaints,
  getComplaintById,
  updateComplaintStatus,
  addRemark,
  getStatusHistory,
  getProfile,
  getDashboardStats
} = require('../controller/workerController');
const { authenticate, authorise } = require('../middleware/authMiddleware');

// All routes require authentication and worker role
router.use(authenticate);
router.use(authorise(['worker']));

// Profile Routes
router.get('/profile', getProfile);
router.get('/dashboard', getDashboardStats);

// Complaint Management Routes
router.get('/complaints', getAssignedComplaints);
router.get('/complaints/:complaint_id', getComplaintById);
router.get('/complaints/:complaint_id/history', getStatusHistory);

// Complaint Update Routes
router.put('/complaints/status', updateComplaintStatus);
router.put('/complaints/remark', addRemark);

module.exports = router;
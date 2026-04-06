const express = require('express');
const router = express.Router();
const {
  createWorker,
  getWorkers,
  deleteWorker,
  getAllComplaints,
  assignComplaint,
  reassignComplaint,
  updateComplaintStatus,
  getAuditLogs
} = require('../controller/adminController');
const { authenticate, authorise } = require('../middleware/authMiddleware');

// Worker Management Routes
router.post('/createWorker', 
  authenticate, 
  authorise(['admin']), 
  createWorker
);

router.get('/getWorkers', 
  authenticate, 
  authorise(['admin']), 
  getWorkers
);

router.delete('/deleteWorker/:user_id', 
  authenticate, 
  authorise(['admin']), 
  deleteWorker
);

// Complaint Management Routes
router.get('/getAllComplaints', 
  authenticate, 
  authorise(['admin']), 
  getAllComplaints
);

router.post('/assignComplaint', 
  authenticate, 
  authorise(['admin']), 
  assignComplaint
);

router.put('/reassignComplaint', 
  authenticate, 
  authorise(['admin']), 
  reassignComplaint
);

router.put('/updateComplaintStatus', 
  authenticate, 
  authorise(['admin']), 
  updateComplaintStatus
);

// Audit Logs Route
router.get('/getAuditLogs', 
  authenticate, 
  authorise(['admin']), 
  getAuditLogs
);

module.exports = router;
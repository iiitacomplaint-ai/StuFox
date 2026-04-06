const pool = require('../config/db');

// Helper function to validate complaint ownership
const isOwnedByUser = async (complaintId, userId, client = null) => {
  const queryClient = client || pool;
  const result = await queryClient.query(
    'SELECT user_id, status FROM complaints WHERE complaint_id = $1',
    [complaintId]
  );
  
  if (result.rows.length === 0) {
    return { owned: false, exists: false, complaint: null };
  }
  
  const complaint = result.rows[0];
  return {
    owned: complaint.user_id === userId,
    exists: true,
    complaint: complaint
  };
};

// Helper function to validate allowed categories
const validCategories = ['Network', 'Cleaning', 'Carpentry', 'PC Maintenance', 'Plumbing', 'Electricity'];

// 1. CREATE COMPLAINT
const createComplaint = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const userId = req.user.user_id;
    const { title, description, category, priority, media_urls = [] } = req.body;
    
    // Validate required fields
    if (!title || !description || !category || !priority) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, description, category, priority'
      });
    }
    
    // Validate category
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Must be one of: ${validCategories.join(', ')}`
      });
    }
    
    // Validate priority
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: `Invalid priority. Must be one of: ${validPriorities.join(', ')}`
      });
    }
    
    // Validate media_urls is array
    if (!Array.isArray(media_urls)) {
      return res.status(400).json({
        success: false,
        message: 'media_urls must be an array'
      });
    }
    
    await client.query('BEGIN');
    
    // Insert complaint
    const insertQuery = `
      INSERT INTO complaints (user_id, title, description, category, priority, media_urls, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'Submitted')
      RETURNING *
    `;
    
    const result = await client.query(insertQuery, [
      userId, title, description, category, priority, JSON.stringify(media_urls)
    ]);
    
    const newComplaint = result.rows[0];
    
    // Insert into audit_logs
    await client.query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_value)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        userId,
        'CREATE_COMPLAINT',
        'complaints',
        newComplaint.complaint_id,
        JSON.stringify({ title, category, priority })
      ]
    );
    
    await client.query('COMMIT');
    
    return res.status(201).json({
      success: true,
      message: 'Complaint created successfully',
      data: newComplaint
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating complaint:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating complaint',
      error: error.message
    });
  } finally {
    client.release();
  }
};

// 2. VIEW OWN COMPLAINTS (with filters)
const getMyComplaints = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { status, category, priority, date, page = 1, limit = 10 } = req.query;
    
    let query = `
      SELECT 
        c.complaint_id,
        c.title,
        c.description,
        c.category,
        c.priority,
        c.status,
        c.media_urls,
        c.remark,
        c.created_at,
        c.updated_at,
        w.name as worker_name,
        w.department as worker_department
      FROM complaints c
      LEFT JOIN users w ON c.assigned_to = w.user_id
      WHERE c.user_id = $1
    `;
    
    const values = [userId];
    let paramIndex = 2;
    
    if (status) {
      query += ` AND c.status = $${paramIndex++}`;
      values.push(status);
    }
    
    if (category) {
      query += ` AND c.category = $${paramIndex++}`;
      values.push(category);
    }
    
    if (priority) {
      query += ` AND c.priority = $${paramIndex++}`;
      values.push(priority);
    }
    
    if (date) {
      query += ` AND DATE(c.created_at) = $${paramIndex++}`;
      values.push(date);
    }
    
    // Pagination
    const offset = (page - 1) * limit;
    query += ` ORDER BY c.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    values.push(limit, offset);
    
    const result = await pool.query(query, values);
    
    // Get total count for pagination
    let countQuery = `SELECT COUNT(*) as total FROM complaints WHERE user_id = $1`;
    const countValues = [userId];
    let countIndex = 2;
    
    if (status) {
      countQuery += ` AND status = $${countIndex++}`;
      countValues.push(status);
    }
    if (category) {
      countQuery += ` AND category = $${countIndex++}`;
      countValues.push(category);
    }
    if (priority) {
      countQuery += ` AND priority = $${countIndex++}`;
      countValues.push(priority);
    }
    if (date) {
      countQuery += ` AND DATE(created_at) = $${countIndex++}`;
      countValues.push(date);
    }
    
    const countResult = await pool.query(countQuery, countValues);
    const total = parseInt(countResult.rows[0].total);
    
    return res.status(200).json({
      success: true,
      message: 'Complaints retrieved successfully',
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching complaints',
      error: error.message
    });
  }
};

// 3. VIEW SINGLE COMPLAINT DETAILS
const getComplaintDetails = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { complaint_id } = req.params;
    
    if (!complaint_id || isNaN(complaint_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid complaint ID'
      });
    }
    
    const query = `
      SELECT 
        c.*,
        w.name as worker_name,
        w.email as worker_email,
        w.department as worker_department,
        w.phone_number as worker_phone
      FROM complaints c
      LEFT JOIN users w ON c.assigned_to = w.user_id
      WHERE c.complaint_id = $1
    `;
    
    const result = await pool.query(query, [complaint_id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }
    
    const complaint = result.rows[0];
    
    // Security check: Verify complaint belongs to user
    if (complaint.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own complaints.'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Complaint details retrieved successfully',
      data: complaint
    });
    
  } catch (error) {
    console.error('Error fetching complaint details:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching complaint details',
      error: error.message
    });
  }
};

// 4. VIEW STATUS HISTORY
const getComplaintHistory = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { complaint_id } = req.params;
    
    if (!complaint_id || isNaN(complaint_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid complaint ID'
      });
    }
    
    // Verify complaint belongs to user
    const ownershipCheck = await isOwnedByUser(complaint_id, userId);
    
    if (!ownershipCheck.exists) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }
    
    if (!ownershipCheck.owned) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view history of your own complaints.'
      });
    }
    
    // Get status history
    const historyQuery = `
      SELECT 
        sh.id,
        sh.old_status,
        sh.new_status,
        sh.changed_at,
        u.name as changed_by_name,
        u.role as changed_by_role
      FROM status_history sh
      LEFT JOIN users u ON sh.changed_by = u.user_id
      WHERE sh.complaint_id = $1
      ORDER BY sh.changed_at ASC
    `;
    
    const result = await pool.query(historyQuery, [complaint_id]);
    
    return res.status(200).json({
      success: true,
      message: 'Status history retrieved successfully',
      data: result.rows,
      count: result.rowCount
    });
    
  } catch (error) {
    console.error('Error fetching status history:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching status history',
      error: error.message
    });
  }
};

// 5. CANCEL COMPLAINT (Only if status is 'Submitted')
const cancelComplaint = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const userId = req.user.user_id;
    const { complaint_id } = req.params;
    
    if (!complaint_id || isNaN(complaint_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid complaint ID'
      });
    }
    
    // Verify complaint belongs to user
    const ownershipCheck = await isOwnedByUser(complaint_id, userId, client);
    
    if (!ownershipCheck.exists) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }
    
    if (!ownershipCheck.owned) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only cancel your own complaints.'
      });
    }
    
    // Check if complaint can be cancelled (only 'Submitted' status)
    if (ownershipCheck.complaint.status !== 'Submitted') {
      return res.status(400).json({
        success: false,
        message: `Complaint cannot be cancelled because status is '${ownershipCheck.complaint.status}'. Only 'Submitted' complaints can be cancelled.`
      });
    }
    
    await client.query('BEGIN');
    
    // Update complaint status to 'Closed' (cancelled)
    const updateResult = await client.query(
      `UPDATE complaints 
       SET status = 'Closed', updated_at = CURRENT_TIMESTAMP
       WHERE complaint_id = $1
       RETURNING *`,
      [complaint_id]
    );
    
    // Insert into status_history
    await client.query(
      `INSERT INTO status_history (complaint_id, old_status, new_status, changed_by)
       VALUES ($1, $2, $3, $4)`,
      [complaint_id, 'Submitted', 'Closed', userId]
    );
    
    // Insert into audit_logs
    await client.query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_value, new_value)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        userId,
        'CANCEL_COMPLAINT',
        'complaints',
        complaint_id,
        JSON.stringify({ status: 'Submitted' }),
        JSON.stringify({ status: 'Closed', reason: 'Cancelled by user' })
      ]
    );
    
    await client.query('COMMIT');
    
    return res.status(200).json({
      success: true,
      message: 'Complaint cancelled successfully',
      data: updateResult.rows[0]
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error cancelling complaint:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while cancelling complaint',
      error: error.message
    });
  } finally {
    client.release();
  }
};

// 6. REOPEN COMPLAINT (Optional - only after Resolved, not after Closed)
const reopenComplaint = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const userId = req.user.user_id;
    const { complaint_id } = req.params;
    
    if (!complaint_id || isNaN(complaint_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid complaint ID'
      });
    }
    
    // Verify complaint belongs to user
    const ownershipCheck = await isOwnedByUser(complaint_id, userId, client);
    
    if (!ownershipCheck.exists) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }
    
    if (!ownershipCheck.owned) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only reopen your own complaints.'
      });
    }
    
    // Check if complaint can be reopened (only 'Resolved' status)
    if (ownershipCheck.complaint.status !== 'Resolved') {
      return res.status(400).json({
        success: false,
        message: `Complaint cannot be reopened because status is '${ownershipCheck.complaint.status}'. Only 'Resolved' complaints can be reopened.`
      });
    }
    
    await client.query('BEGIN');
    
    // Update complaint status back to 'In Progress'
    const updateResult = await client.query(
      `UPDATE complaints 
       SET status = 'In Progress', updated_at = CURRENT_TIMESTAMP
       WHERE complaint_id = $1
       RETURNING *`,
      [complaint_id]
    );
    
    // Insert into status_history
    await client.query(
      `INSERT INTO status_history (complaint_id, old_status, new_status, changed_by)
       VALUES ($1, $2, $3, $4)`,
      [complaint_id, 'Resolved', 'In Progress', userId]
    );
    
    // Insert into audit_logs
    await client.query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_value, new_value)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        userId,
        'REOPEN_COMPLAINT',
        'complaints',
        complaint_id,
        JSON.stringify({ status: 'Resolved' }),
        JSON.stringify({ status: 'In Progress', reason: 'Reopened by user' })
      ]
    );
    
    await client.query('COMMIT');
    
    return res.status(200).json({
      success: true,
      message: 'Complaint reopened successfully',
      data: updateResult.rows[0]
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error reopening complaint:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while reopening complaint',
      error: error.message
    });
  } finally {
    client.release();
  }
};

// 7. GET DASHBOARD STATS (User's complaint statistics)
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    const query = `
      SELECT 
        COUNT(*) as total_complaints,
        COUNT(*) FILTER (WHERE status = 'Submitted') as submitted,
        COUNT(*) FILTER (WHERE status = 'Assigned') as assigned,
        COUNT(*) FILTER (WHERE status = 'In Progress') as in_progress,
        COUNT(*) FILTER (WHERE status = 'Resolved') as resolved,
        COUNT(*) FILTER (WHERE status = 'Closed') as closed,
        COUNT(*) FILTER (WHERE status = 'Escalated') as escalated,
        COUNT(*) FILTER (WHERE priority = 'high') as high_priority,
        COUNT(*) FILTER (WHERE priority = 'medium') as medium_priority,
        COUNT(*) FILTER (WHERE priority = 'low') as low_priority
      FROM complaints
      WHERE user_id = $1
    `;
    
    const result = await pool.query(query, [userId]);
    
    // Get recent complaints
    const recentQuery = `
      SELECT 
        complaint_id,
        title,
        category,
        priority,
        status,
        created_at
      FROM complaints
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 5
    `;
    
    const recentResult = await pool.query(recentQuery, [userId]);
    
    return res.status(200).json({
      success: true,
      message: 'Dashboard statistics retrieved successfully',
      data: {
        statistics: result.rows[0],
        recent_complaints: recentResult.rows
      }
    });
    
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard statistics',
      error: error.message
    });
  }
};

// 8. GET USER PROFILE
const getProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    const result = await pool.query(
      `SELECT user_id, name, email, phone_number, role, created_at, updated_at 
       FROM users 
       WHERE user_id = $1 AND role = 'user'`,
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching profile',
      error: error.message
    });
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getComplaintDetails,
  getComplaintHistory,
  cancelComplaint,
  reopenComplaint,
  getDashboardStats,
  getProfile
};
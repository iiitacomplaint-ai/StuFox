const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { createTable } = require('./config/createTable');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');      
const adminRoutes = require('./routes/adminRoutes');
const workerRoutes = require('./routes/workerRoutes');  

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data
app.use(cors());

const PORT = process.env.PORT || 3000;

// Initialize database tables
createTable().then(() => {
    console.log('✅ Database tables created/verified successfully');
}).catch(error => {
    console.error('❌ Error creating database tables:', error);
    process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);        
app.use('/api/admin', adminRoutes);
app.use('/api/worker', workerRoutes);   

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ 
        success: true,
        message: "College Complaint Management System Server is running",
        version: "1.0.0",
        endpoints: {
            auth: "/api/auth",
            user: "/api/user",
            admin: "/api/admin",
            worker: "/api/worker"
        }
    });
});

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Auth routes: http://localhost:${PORT}/api/auth`);
    console.log(`👤 User routes: http://localhost:${PORT}/api/user`);
    console.log(`👑 Admin routes: http://localhost:${PORT}/api/admin`);
    console.log(`🔧 Worker routes: http://localhost:${PORT}/api/worker`);
});
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const { createTable } = require("./config/createTable");

// Route imports
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const workerRoutes = require("./routes/workerRoutes");

// ---------------- CORS Configuration ----------------
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'https://www.stufix.space',
  'https://stufix.space',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        console.log(`Blocked CORS request from origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin'
    ],
    exposedHeaders: ['Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);

// ---------------- Additional Security Headers ----------------
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// ---------------- Request Logging Middleware (Console) ----------------
app.use((req, res, next) => {
  const start = Date.now();
  
  // Log request
  console.log(`\n📨 ${req.method} ${req.url}`);
  console.log(`   IP: ${req.ip}`);
  console.log(`   User-Agent: ${req.get('user-agent')}`);
  if (req.method === 'POST' && req.body) {
    const logBody = { ...req.body };
    if (logBody.password) logBody.password = '[REDACTED]';
    if (logBody.cnfpassword) logBody.cnfpassword = '[REDACTED]';
    console.log(`   Body:`, logBody);
  }
  
  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusIcon = res.statusCode >= 400 ? '❌' : '✅';
    console.log(`${statusIcon} ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------- Health Check ----------------
app.get("/", (req, res) => {
  console.log("🏥 Health check endpoint called");
  
  res.status(200).json({
    success: true,
    message: "College Complaint Management System Server is running",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development"
  });
});

// ---------------- API Routes ----------------
console.log("\n📋 Registering API routes...");

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/worker", workerRoutes);

console.log("✅ All routes registered successfully");

// ---------------- 404 Handler ----------------
app.use((req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// ---------------- Global Error Handler ----------------
app.use((err, req, res, next) => {
  console.error(`❌ Global error:`, err.message);
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log("\n🔄 Starting server initialization...");
    
    // Create database tables
    await createTable();
    console.log("✅ Database tables created/verified successfully");

    // Start server
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📋 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔗 CORS enabled for: ${allowedOrigins.join(', ')}`);
      console.log(`${'='.repeat(60)}\n`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// ---------------- Graceful Shutdown ----------------
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

startServer();
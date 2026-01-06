const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const routes = require("./routes");
const authMiddleware = require("./middlewares/auth");
const adminMiddleware = require("./middlewares/admin");
const { generalLimiter } = require("./middlewares/rateLimiter"); // ✅ destructure here
const logger = require("./middlewares/logger");
const corsOptions = require("../config/cors");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Global middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(logger);
app.use(generalLimiter); // ✅ now defined

// Public routes
app.use("/api/auth", routes.auth);

// Protected routes
app.use("/api/users", authMiddleware, routes.user);

// Admin routes
app.use("/api/admin", authMiddleware, adminMiddleware, routes.admin);

// Student
app.use("/api/students", routes.student);

// Excel
app.use("/api/excel", routes.excel);

// Error handler
app.use(errorHandler);

module.exports = app;

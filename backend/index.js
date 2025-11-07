require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { PORT } = require("./config");

// Import db to initialize MongoDB connection
require("./db");

const app = express();

// CORS configuration - allow multiple origins
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "https://localhost:5173"
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());

// Health check endpoint (should work even if DB is down)
app.get("/health", (req, res) => {
    const mongoose = require("mongoose");
    const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
    res.json({ 
        status: "ok",
        database: dbStatus,
        timestamp: new Date().toISOString()
    });
});

const mainRouter = require("./routes/index");

app.use("/api/v1", mainRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: "Something went wrong!",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
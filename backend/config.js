require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-in-production";
const MONGODB_URL = process.env.MONGODB_URL;
const PORT = process.env.PORT || 3000;

if (!MONGODB_URL) {
    console.warn("Warning: MONGODB_URL not set in environment variables");
}

module.exports = {
    JWT_SECRET,
    MONGODB_URL,
    PORT
};
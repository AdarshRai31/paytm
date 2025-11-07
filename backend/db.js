const mongoose = require("mongoose");
const { MONGODB_URL } = require("./config");

// Don't throw error if MONGODB_URL is missing, just warn
// This allows the server to start and fail gracefully
if (!MONGODB_URL) {
    console.warn("Warning: MONGODB_URL is not defined in environment variables");
    console.warn("Server will start but database operations will fail");
} else {
    // Connect to MongoDB with better error handling
    mongoose.connect(MONGODB_URL, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    }).then(() => {
        console.log("Connected to MongoDB");
    }).catch((error) => {
        console.error("Failed to connect to MongoDB:", error.message);
        // Don't exit process immediately, allow server to start
        // The connection will be retried automatically by mongoose
    });

    mongoose.connection.on("connected", () => {
        console.log("MongoDB connection established");
    });

    mongoose.connection.on("error", (error) => {
        console.error("MongoDB connection error:", error.message);
    });

    mongoose.connection.on("disconnected", () => {
        console.warn("MongoDB disconnected. Attempting to reconnect...");
    });

    // Handle process termination
    process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
    });
}

// Create a Schema for Users
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
});

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    }
});

const transactionSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Account = mongoose.model('Account', accountSchema);
const User = mongoose.model('User', userSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = {
    User,
    Account,
    Transaction
};
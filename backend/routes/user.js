const express = require("express");
const jwt = require("jsonwebtoken");
const zod = require("zod");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");
const { User, Account } = require("../db");

const router = express.Router();

const signupSchema = zod.object({
    username: zod.string().email("Invalid email format"),
    password: zod.string().min(6, "Password must be at least 6 characters"),
    firstName: zod.string().min(1, "First name is required").max(50),
    lastName: zod.string().min(1, "Last name is required").max(50),
})

// signup 
router.post("/signup", async (req, res) => {
    try {
        const body = req.body;

        const validation = signupSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                message: "Invalid input",
                errors: validation.error.errors
            });
        }

        const existingUser = await User.findOne({ username: body.username});
        if(existingUser) {
            return res.status(400).json({
                message: "Email already taken"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(body.password, 10);

        const dbUser = await User.create({
            ...body,
            password: hashedPassword
        });

        if (!dbUser) {
            return res.status(500).json({ message: "User creation failed" });
        }

        // create a new account with initial balance
        const initialBalance = Math.floor(1 + Math.random() * 10000);
        await Account.create({
            userId: dbUser._id,
            balance: initialBalance
        });

        // creating the token
        const token = jwt.sign({
            userId: dbUser._id
        }, JWT_SECRET);

        res.status(201).json({
            message: "User created successfully",
            token: token
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
})

//updating user details 
const updateBody = zod.object({
    password : zod.string().min(6, "Password must be at least 6 characters").optional(),
    firstName: zod.string().min(1).max(50).optional(),
    lastName: zod.string().min(1).max(50).optional(),
})

router.put("/", authMiddleware, async (req, res) => {
    try {
        const validation = updateBody.safeParse(req.body);
        if(!validation.success) {
            return res.status(400).json({
                message: "Invalid input",
                errors: validation.error.errors
            });
        }

        const updateData = { ...req.body };

        // Hash password if provided
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        await User.updateOne(
            { _id: req.userId },
            { $set: updateData }
        );

        res.json({
            message: "Updated successfully"
        });
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({
            message: "Error while updating information"
        });
    }
})

// filtering users through firstName or lastName
router.get("/bulk", authMiddleware, async (req, res) => {
    try {
        const filter = req.query.filter || "";

        // Exclude current user from results
        const users = await User.find({
            _id: { $ne: req.userId },
            $or: [{
                firstName: {
                    "$regex": filter,
                    $options: "i", // case-insensitive
                }
            }, {
                lastName: {
                    "$regex": filter,
                    $options: "i", // case-insensitive
                }
            }]
        }).limit(50); // Limit results to prevent abuse

        res.json({
            user: users.map(user => ({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id
            }))
        });
    } catch (error) {
        console.error("Bulk user fetch error:", error);
        res.status(500).json({
            message: "Error fetching users"
        });
    }
})


// user signin schema
const signinBody = zod.object({
    username: zod.string().email("Invalid email format"),
    password: zod.string().min(1, "Password is required")
})

// signin 
router.post("/signin", async (req, res) => {
    try {
        const validation = signinBody.safeParse(req.body);
        if(!validation.success) {
            return res.status(400).json({
                message: "Incorrect inputs",
                errors: validation.error.errors
            });
        }

        const user = await User.findOne({ 
            username: req.body.username
        });

        if(!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        
        if(!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);

        res.json({
            message: "Login successful",
            token: token
        });
    } catch (error) {
        console.error("Signin error:", error);
        res.status(500).json({
            message: "Error while logging in"
        });
    }
})

// Get current user info
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        res.json({
            user: {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id
            }
        });
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({
            message: "Error fetching user"
        });
    }
});

module.exports = router;
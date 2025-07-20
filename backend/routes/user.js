const express = require("express");
const jwt = require("jsonwebtoken");
const zod = require("zod");
const { JWT_SECRET } = require("../config");
const { authMiddlware } = require("../middleware");
const { User, Account } = require("../db");

const router = express.Router();

const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string(),
})

// signup 
router.post("/signup", async (req, res) => {
    const body = req.body;

    const {success} = signupSchema.safeParse(req.body);
    if (!success) {
        return res.json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = await User.findOne({ username: body.username});

    if(user) {
        return res.json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const dbUser = await User.create(body);

    if (!dbUser) {
    return res.status(500).json({ message: "User creation failed" });
}

    // create a new account
    await Account.create({
        userId: dbUser._id,
        balance: 1 + Math.random()* 10000
    })

    // creating the token
    const token = jwt.sign({
        userId: dbUser._id
    }, JWT_SECRET);

    res.json({
        "msg": "User created Successfully",
        token: token
    })
})

//updating user details 
const updateBody = zod.object({
    password : zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put("/", authMiddlware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body);
    if(!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne(req.body, {
        id: req.userId
    })

    res.json({
        message: "Updated Succesfully"
    })
})

// filtering users through firstName or lastName
router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex" : filter,
                $options: "i", // case-insensitive
            }
        }, {
            lastName : {
                "$regex" : filter,
                $options: "i", // case-insensitive
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})


// user signin schema
const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

// signin 
router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body);
    if(!success) {
        return res.json({
            message: "Email already taken / Incorrect inputs"
        });
    }

    const user = await User.findOne({ 
        username: req.body.username,
        password: req.body.password
    });

    if(user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);

        res.json({
            token: token
        })
        return;
    }

    res.status(411).json({
        message: "Error while logging in"
    })
})

module.exports = router;
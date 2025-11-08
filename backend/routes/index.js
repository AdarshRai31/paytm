const express = require("express");
const userRouter = require("./user");
const accountRouter = require("./account");

const router = express.Router();

// API v1 root endpoint
router.get("/", (req, res) => {
    res.json({
        message: "Paytm API v1",
        version: "1.0.0",
        endpoints: {
            user: {
                signup: "POST /api/v1/user/signup",
                signin: "POST /api/v1/user/signin",
                me: "GET /api/v1/user/me (requires auth)",
                update: "PUT /api/v1/user (requires auth)",
                bulk: "GET /api/v1/user/bulk?filter=... (requires auth)"
            },
            account: {
                balance: "GET /api/v1/account/balance (requires auth)",
                transfer: "POST /api/v1/account/transfer (requires auth)",
                transactions: "GET /api/v1/account/transactions (requires auth)"
            }
        }
    });
});

router.use("/user", userRouter);
router.use("/account", accountRouter);

module.exports = router;
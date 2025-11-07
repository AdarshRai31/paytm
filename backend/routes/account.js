const express = require("express");
const zod = require("zod");
const { authMiddleware } = require("../middleware");
const { Account, Transaction } = require("../db");
const { default: mongoose } = require('mongoose');

const router = express.Router();

const transferSchema = zod.object({
    to: zod.string().min(1, "Recipient ID is required"),
    amount: zod.number().positive("Amount must be positive").min(0.01, "Amount must be at least 0.01")
});

// checking balance
router.get("/balance", authMiddleware, async (req, res) => {
    try {
        const account = await Account.findOne({
            userId: req.userId
        });

        if (!account) {
            return res.status(404).json({
                message: "Account not found"
            });
        }

        res.json({
            balance: account.balance
        });
    } catch (error) {
        console.error("Balance fetch error:", error);
        res.status(500).json({
            message: "Error fetching balance"
        });
    }
});

// performing transaction i.e. debiting and crediting at the same time simultaneously  
router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    
    try {
        session.startTransaction();
        
        const validation = transferSchema.safeParse(req.body);
        if (!validation.success) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid input",
                errors: validation.error.errors
            });
        }

        const { amount, to } = req.body;

        // Prevent self-transfer
        if (req.userId.toString() === to.toString()) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Cannot transfer to yourself"
            });
        }

        // Fetch the accounts within the transaction
        const fromAccount = await Account.findOne({ userId: req.userId }).session(session);

        if(!fromAccount) {
            await session.abortTransaction();
            return res.status(404).json({
                message: "Sender account not found"
            });
        }

        if(fromAccount.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }

        const toAccount = await Account.findOne({ userId: to }).session(session);

        if(!toAccount) {
            await session.abortTransaction();
            return res.status(404).json({
                message: "Recipient account not found"
            });
        }

        // Perform the transfer
        await Account.updateOne(
            { userId: req.userId }, 
            { $inc: { balance: -amount } }
        ).session(session);
        
        await Account.updateOne(
            { userId: to }, 
            { $inc: { balance: amount } }
        ).session(session);

        // Create transaction record
        await Transaction.create([{
            from: req.userId,
            to: to,
            amount: amount
        }], { session });

        // Commit the transaction
        await session.commitTransaction();
        
        res.json({
            message: "Transfer successful"
        });
    } catch (error) {
        await session.abortTransaction();
        console.error("Transfer error:", error);
        res.status(500).json({
            message: "Transfer failed"
        });
    } finally {
        session.endSession();
    }
});

// Get transaction history
router.get("/transactions", authMiddleware, async (req, res) => {
    try {
        const transactions = await Transaction.find({
            $or: [
                { from: req.userId },
                { to: req.userId }
            ]
        })
        .populate('from', 'firstName lastName')
        .populate('to', 'firstName lastName')
        .sort({ timestamp: -1 })
        .limit(50);

        res.json({
            transactions: transactions.map(t => ({
                id: t._id,
                from: {
                    id: t.from._id,
                    name: `${t.from.firstName} ${t.from.lastName}`
                },
                to: {
                    id: t.to._id,
                    name: `${t.to.firstName} ${t.to.lastName}`
                },
                amount: t.amount,
                timestamp: t.timestamp,
                type: t.from._id.toString() === req.userId.toString() ? 'sent' : 'received'
            }))
        });
    } catch (error) {
        console.error("Transaction history error:", error);
        res.status(500).json({
            message: "Error fetching transaction history"
        });
    }
});

module.exports = router;
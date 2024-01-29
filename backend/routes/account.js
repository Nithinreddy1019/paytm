const express = require("express");
const { authMiddleware } = require("../middleware");
const router = express.Router()
const { Account } = require("../db");
const { default: mongoose } = require("mongoose");


router.get("/balance", authMiddleware, async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    })

    res.status(200).json({
        balance: account.balance
    })
})


router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();

    session.startTransaction();

    try {
        const { to, amount } = req.body;

        const account = await Account.findOne({ userId: req.userId}).session(session);
    
        if(!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance"
            })
        }
    
        const toAccount = await Account.findOne({ userId: to}).session(session);
    
        if(!toAccount){
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid account"
            })
        }
    
    
        await Account.updateOne({ userId: req.userId}, {
            $inc: {balance: -amount}
        }).session(session);
        await Account.updateOne({ userId: to} ,{
            $inc: {balance: amount}
        }).session(session);
    
        await session.commitTransaction();
        res.status(200).json({
            message: "Transfer successfull"
        })
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({
            message: "Something went wrong"
        });
    }


})

module.exports = router;
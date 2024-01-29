const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { User, Account } = require("../db")
const JWT_SECRET  = require("../config");
const { authMiddleware } = require("../middleware");

const router = express.Router();

const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
})
router.post("/signup", async (req, res) => {
    const { username, password, lastName, firstName } = req.body;

    const { success } = signupSchema.safeParse(req.body);
    if(!success) {
        res.status(411).json({
            message:"Email already taken / Incorrect inputs"
        })
        return;
    }

    const existingUser = await User.findOne({ username : username});
    if(existingUser){
        res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
        return;
    }

    const newUser = new User({
        username: username,
        firstName: firstName,
        lastName: lastName
    });

    const hashedPassword = await newUser.createHash(password);
    newUser.password_hash = hashedPassword;
    await newUser.save()

    const userId = newUser._id;

    await Account.create({
        userId: userId,
        balance: 1 + Math.random() * 10000
    })
    
    const token = jwt.sign({userId:JSON.parse(JSON.stringify(userId))}, JWT_SECRET);

    res.status(200).json({
        message: "User created successfully", 
        token: token
    })
})


//Signin route
const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string()
})
router.post("/signin", async (req, res) => {
    const { username, password } = req.body;
    const { success } = signinSchema.safeParse(req.body);
    if(!success){
        res.status(411).json({
            message:"Incorrect inputs"
        });
        return
    };

    const user = await User.findOne({username: username});
    const validated = await user.validatePassword(password);

    if(user && validated){
        const token = jwt.sign({userId:JSON.parse(JSON.stringify(user._id))}, JWT_SECRET);
        res.status(200).json({
            token: token
        });
        return;
    };

    res.status(411).json({
        message: "Error while logging in"
    })
})

//Update route
const updateSchema = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
})
router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateSchema.safeParse(req.body);
    if(!success){
        res.status(411).json({
            message:"Error while updating information"
        })
        return
    };

    await User.updateOne({
        _id: req.userId
    }, req.body);

    res.json({
        message:"User updated successfully"
    })
})


//get users route
router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName :{
                "$regex": filter
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


module.exports = router;
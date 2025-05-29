
const express = require('express');
const authRouter = express.Router();
const User = require("../Models/user"); // Changed to 'User' for clarity and consistency
const { validateSignUpdata } = require("../Utils/Helper/passwordValidation");
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');


authRouter.use(cookieParser());
authRouter.use(express.json()); 

authRouter.post("/signup", async (req, res) => {
    try {
        // Validate sign-up data
        validateSignUpdata(req);
        // Destructure required fields
        const { firstName, lastName, email, password } = req.body;
        // Ensure password exists
        if (!password) {
            return res.status(400).json({ error: "Password is required" });
        }

        // Hash password securely
        const passwordHash = await bcrypt.hash(password, 8);
        console.log("Hashed Password:", passwordHash);

        // Create new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash
        });
        const savedUser = await newUser.save();
        const token = savedUser.getJwt();
        console.log("Generated Token:", token);

        // Set token in cookies
        res.cookie('token', token, {
            expires: new Date(Date.now() + 86400000), // 1 day expiration
            httpOnly: true // Secure cookie
        });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully.", data: savedUser });

    } catch (error) {
        console.error("Signup Error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: "Internal Server Error" });
    }
});
authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Compare passwords (Add `await`)
        const isMatch = await user.passwordValide(password);
        if (!isMatch) {
            return res.status(401).json({ error: "Incorrect password" });
        }

        // Generate JWT token
        const token = user.getJwt();
        console.log("Generated Token:", token);

        // Set token in cookies
        res.cookie('token', token, {
            expires: new Date(Date.now() + 86400000), // 1 day expiration
            httpOnly: true // Secure cookie
        });

        res.json({ message: "User logged in successfully" });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
authRouter.post("/logout", async (req, res) => {
    res
        .cookie('token', null, {
            expires: new Date(Date.now())
        })
        .send("User logged out successfully");
})


module.exports = authRouter;
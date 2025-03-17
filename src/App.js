const express = require('express');
const app = express();
const connectDB = require('./config/Database');
const User = require("./Models/user"); // Changed to 'User' for clarity and consistency
const validateSignUpdata = require('./Utils/Helper/passwordValidation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const { UserAuth } = require('./Middleware/auth');

app.use(cookieParser());

connectDB()
    .then(() => {
        console.log('Database connected');
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch((err) => {
        console.log('Error connecting to database', err);
    });

app.use(express.json());

app.post("/signup", async (req, res) => {
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

        await newUser.save();
        res.status(201).json({ message: "User registered successfully." });

    } catch (error) {
        console.error("Signup Error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 🛠️ Login Route (Changed to POST)
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Compare passwords
        const isMatch = user.passwordValide(password);
        if (!isMatch) {
            return res.status(401).json({ error: "Incorrect password" });
        }
        if (isMatch) {
            const token = user.getJwt();
            console.log("Generated Token:", token);

            res.cookie('token', token, {
                expires: new Date(Date.now() + 86400000)
            });
            res.json({ message: "User logged in successfully" });
        } else {
            res.status(401).json({ error: "Incorrect password" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/profile", UserAuth, async (req, res) => {
    try {

        const user = req.user;
        // console.log(user);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.send(user);
        //     res.send("Reading cookies");
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/connectCheck", UserAuth, async (req, res) => {
    console.log("User is connected");
    res.send("User is connected");
});



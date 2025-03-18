
const express = require('express');
const profile = express.Router();
const { UserAuth } = require('../Middleware/auth');
const { validateProfileDate, isStrongPassword } = require('../Utils/Helper/passwordValidation');
const bcrypt = require('bcrypt');


profile.get("/profile/view", UserAuth, async (req, res) => {
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

profile.patch("/profile/update", UserAuth, async (req, res) => {
    try {
        if (!validateProfileDate(req)) {
            throw new Error("Invalid fields");
        };

        const loggedInUser = req.user;

        Object.keys(req.body).forEach(key => {
            loggedInUser[key] = req.body[key];
        });
        await loggedInUser.save();

        res.json({ message: `Profile Updated of user : [${loggedInUser.email}]`, data: loggedInUser })


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


profile.patch("/profile/updatePassword", UserAuth, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        console.log(req.body);
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ error: "Both old and new passwords are required" });
        }
        if (!isStrongPassword(newPassword)) {
            return res.status(400).json({ error: "Password is weak. Please enter a strong password." });
        }
        const user = req.user; // User is attached to request from `UserAuth` middleware

        // Step 1: Validate the old password
        const isMatch = await user.passwordValide(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ error: "Old password is incorrect" });
        }

        // Step 2: Hash the new password
        // const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, 8);

        console.log(user);
        // Step 3: Save the updated user document
        await user.save();

        res.clearCookie("token"); // If using cookies for authentication

        res.json({ message: "Password updated successfully. Please log in again." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});




module.exports = profile;
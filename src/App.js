const express = require('express');
const app = express();
const connectDB = require('./config/Database');
const user = require("./Models/user");

connectDB()
    .then(() => {
        console.log('Database connected');
        app.listen(7777, () => {
            console.log('Server is running on port 7777');
        });

    }).catch((err) => {
        console.log('Error connecting to database');
    });


app.use(express.json());
app.post("/signup", async (req, res) => {
    //dummy data for practacing
    // console.log(req.body);
    const newUser = new user(req.body);
    //create a inctacne of user model

    await newUser.save();
    try {
        res.send("User registered successfully");
        console.log(`check db`);
    } catch (err) {
        res.send(err.message)
        console.error(err);
    }
})
// find user by email
app.get("/byEmail", async (req, res) => {
    const userEmail = req.body.email;
    try {
        const UserData = await user.findOne({ email: userEmail });
        if (!UserData) {
            res.status(401).send("User not found");
        }
        else {
            res.send(UserData);
        }
    } catch (err) {
        res.status(400).send(err.message)
        console.error(err);
    }

})
// all the Data 
app.get("/all", async (req, res) => {
    try {
        const UserData = await user.find({});
        res.send(UserData);
    } catch (err) {
        res.status(400).send(err.message)
        console.error(err);
    }

})
app.get("/oneMail", async (req, res) => {
    const userEmail = req.body.email;
    try {
        console.log(userEmail)
        const UserData = await user.findOne({ email: userEmail });
        if (!UserData) {
            res.status(401).send("User not found");
        }
        else {
            res.send(UserData);
        }
        res.send(UserData);
    } catch (err) {
        res.status(400).send(err.message)
        console.error(err);
    }
})

app.get("/mailExist", async (req, res) => {
    const mail = req.body.email;
    try {
        const UserData = await user.exists({ email: mail });
        if (UserData) {
            res.send("Email Exist");
        }
        else {
            res.send("Email not Exist");
        }
    }
    catch (err) {
        res.status(400).send(err.message)
        console.error(err);
    }
})

app.delete("/delete", async (req, res) => {
    const userId = req.body.userID;
    try {
        const UserData = await user.findOneAndDelete({ userId });
        res.send("User Deleted");
    }
    catch (err) {
        res.status(400).send(err.message)
        console.error(err);
    }
});
const mongoose = require("mongoose");

app.patch("/update", async (req, res) => {
    const userId = req.body.userId; // Fix the key name
    const updateData = {
        ...req.body
    };
    try {
        const updatedUser = await user.findByIdAndUpdate(
            userId,
            updateData,
            { runValidators: true } // Ensure validation and return updated doc
        );

        if (!updatedUser) {
            return res.status(404).send("User not found");
        }

        res.send({ message: "User updated successfully", user: updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});






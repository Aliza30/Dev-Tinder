const express = require('express');
const app = express();
const connectDB = require('./config/Database');
const user = require("./Models/user");

app.post("/signup", async (req, res) => {
    //dummy data for practacing

    const newUser = new user({
        firstName: "Akshai",
        lastName: "saine",
        email: "akshasaine@example.com",
        password: "323232",
    })
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

connectDB()
    .then(() => {
        console.log('Database connected');
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });

    }).catch((err) => {
        console.log('Error connecting to database');
    });

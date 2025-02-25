const express = require('express');
const app = express();
const connectDB = require('./config/Database');
const user = require("./Models/user");


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
        res.send(UserData);
    } catch (err) {
        res.send(err.message)
        console.error(err);
    }

})


app.get("/feed", (req, res) => {

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

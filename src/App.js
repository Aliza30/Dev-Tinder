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
    try {
        // Create an instance of user model
        const newUser = new user(req.body);

        // Save the user (this might fail if validation fails)
        await newUser.save();

        res.status(201).json("User registered successfully User saved in the database ");
        console.log(`User saved in the database`);
    } catch (err) {
        console.error(err); // Logs the full error in the terminal

        if (err.name === "ValidationError") {
            return res.status(400).json({ error: err.message });
        }

        res.status(500).json({ error: "Internal Server Error" });
    }
});
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

app.patch("/update/:userId", async (req, res) => {
    const userId = req.params?.userId; // Fix the key name
    const updateData = {
        ...req.body
    };
    try {
        const ALLOWED_UPDATE = ["age", "skills", "photoUrl",]
        const isUpdateAllowed = Object.keys(updateData).every((k) => ALLOWED_UPDATE.includes(k));
        if (!isUpdateAllowed) {
            throw new Error("Invalid update fields");
        }

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






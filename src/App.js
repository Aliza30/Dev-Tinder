const express = require('express');
const app = express();
const connectDB = require('./config/Database');
const cookieParser = require('cookie-parser');

const authRouter = require('./Router/authRouter');
const profileRouter = require('./Router/profile');
const connectionRouter = require('./Router/connection');

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRouter);

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



// 🛠️ Login Route (Changed to POST)




const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/Database');

// Routers
const authRouter = require('./Router/authRouter');
const profileRouter = require('./Router/profile');
const connectionRouter = require('./Router/connection');
const userConnect = require('./Router/userRouter');

const app = express();

// 🔐 Middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRouter);
app.use("/", userConnect);

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




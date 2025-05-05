
const express = require('express');
const userRouter = express.Router();

const { UserAuth } = require('../Middleware/auth');
const connectionRequest = require('../Models/connectionRequest');
const user = require('../Models/user');

const USER_SAFE_DATA = ["id", "firstName", "lastName", "photoUrl", "age", "about", "gender"];
userRouter.get('/user/request/received', UserAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await connectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA);

        res.json({
            message: "Connection requests fetched successfully",
            data: connectionRequests
        })

    } catch (error) {
        console.error("Error:", error); // Logs error to console
        res.status(400).json({ error: error.message });

    }
})
userRouter.get('/user/connection', UserAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await connectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequests.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        })
        res.json({
            message: "User Connection",
            data
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(400).json({ error: error.message });
    }
});

userRouter.get('/feed', UserAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        if (limit > 50) limit = 50; // set a maximum limit
        const skip = (page - 1) * limit;
        const connectionRequests = await connectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId status").populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);


        // set -> like an array , contain unique elemet and if u sent repeeated value it will sil it
        const hideUserFromFeed = new Set();
        connectionRequests.forEach((req) => {
            hideUserFromFeed.add(req.fromUserId);
            hideUserFromFeed.add(req.toUserId);
        })

        const users = await user.find({
            $and: [
                { _id: { $nin: Array.from(hideUserFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select('age gender about').select(USER_SAFE_DATA).skip(skip).limit(limit);
        res.json(users)

    } catch (error) {
        console.error("Error:", error);
        res.status(400).json({ error: error.message });
    }
})


module.exports = userRouter;
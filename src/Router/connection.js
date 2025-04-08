
const express = require('express');
const router = express.Router();
const { UserAuth } = require('../Middleware/auth');
const User = require('../Models/user');
const ConnectionRequest = require('../Models/connectionRequest');


router.post("/request/send/:status/:toUserId", UserAuth, async (req, res) => {
    try {
        const fromUser = req.user;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        // status check
        const allowedStatus = ["interested", "ignore"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status", status: status });
        }

        // check if user exists
        const checkToUser = await User.findById(toUserId);
        if (!checkToUser) {
            return res.status(400).json({ message: "User Not Found" });
        }

        // connection request check if pending or if already exists then we can not send again 
        const exisingRequest = await ConnectionRequest.findOne({
            $or: [{
                fromUserId: fromUser,
                toUserId: toUserId
            },
            {
                fromUserId: toUserId,
                toUserId: fromUser
            }]
        })
        if (exisingRequest) {
            return res.status(400).json({ message: "Connection request already exists", status: status });
        }
        const connectionRequest = new ConnectionRequest({
            fromUserId: fromUser._id,
            toUserId: toUserId,
            status: status
        });
        const connectionData = await connectionRequest.save();
        //chainning of res
        res
            .status(200)
            .json({
                message: req.user.firstName + " Connection request sent successfully " + toUserId.firstName,
                data: connectionData
            });

    }
    catch (e) {
        console.error("Error:", e); // Logs error to console
        res.status(400).json({ error: e.message });
    }

});


router.post("/request/review/:status/:requestId", UserAuth, async (req, res) => {
    try {

        const loggesInUser = req.user;

        const { status, requestId } = req.params;
        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status", status: status });
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggesInUser._id,
            status: "interested"
        });

        if (!connectionRequest) {
            return res.status(404).json({ message: "connection request not found", status: status });
        }

        connectionRequest.status = status;
        connectionRequest.save();
        res.status(200).json({ message: "connection request has been : " + status });
    }

    //67dd34fede72ff146e5400fa  
    catch (e) {
        console.error("Error:", e); // Logs error to console
        res.status(400).json({ error: e.message });
    }

});
module.exports = router;

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
        const allowedStatus = ["interested", "ignored"];
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
        const loggedInUser = req.user;
        const { status, requestId } = req.params;
        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status", status: req.params.status });
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        })
        if (!connectionRequest) {
            return res.status(400).json({ message: "Connection request not found" });
        }
        connectionRequest.status = status;
        await connectionRequest.save();
        res.status(200).json({
            message: `Connection request ${status} successfully`,
            data: connectionRequest
        });

    } catch (error) {
        console.error("Error:", error); // Logs error to console
        res.status(400).json({ error: error.message });
    }
})

module.exports = router;
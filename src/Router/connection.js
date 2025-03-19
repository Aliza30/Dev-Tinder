
const express = require('express');
const router = express.Router();
const { UserAuth } = require('../Middleware/auth');
const User = require('../Models/user');
const ConnectionRequest = require('../Models/connectionRequest');

//intern level code 
router.post("/request/send/:status/:toUserId", UserAuth, async (req, res) => {
    try {
        const fromUser = req.user;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

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
                message: "Connection request sent successfully",
                data: connectionData
            });

    }
    catch (e) {
        res.status(400).send(e);
    }
});



module.exports = router;
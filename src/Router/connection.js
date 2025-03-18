
const express = require('express');
const router = express.Router();
const { UserAuth } = require('../Middleware/auth');
const User = require('../Models/user');


router.get("/connectCheck", UserAuth, async (req, res) => {
    console.log("User is connected");
    res.send("User is connected");
});



module.exports = router;
const jwt = require("jsonwebtoken");
const User = require("../Models/user");


const UserAuth = async (req, res, next) => {  // Fixed parameter order
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ error: "Invalid Token auth" });
        }

        const decodedmessage = await jwt.verify(token, "Namastedev@123");

        const { _id } = decodedmessage; // Extract `_id` instead of `id`
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { UserAuth };
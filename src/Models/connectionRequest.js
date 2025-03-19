const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        enum: {
            values: ["interested", "ignore", "accepted", "rejected"],
            message: `{VALUE} is not supported`
        },
    },

},
    {
        timestamps: true
    }
);

const connectionRequest = mongoose.model(
    "ConnectionRequest", connectionRequestSchema
);

module.exports = connectionRequest;
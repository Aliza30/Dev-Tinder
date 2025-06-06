const mongoose = require("mongoose");
require("./user");


const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    status: {
        type: String,
        enum: {
            values: ["interested", "ignored", "accepted", "rejected"],
            message: `{VALUE} is not supported`
        },
    },
},
    {
        timestamps: true
    }
);
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("You can not send request to yourself");
    }
    next();
});
const connectionRequest = mongoose.model(
    "ConnectionRequest", connectionRequestSchema
);

module.exports = connectionRequest;
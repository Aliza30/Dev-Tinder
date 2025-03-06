
const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 18,
        validate(value) {
            if (value < 18) {
                throw new Error("Age must be greater than 18");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://images.app.goo.gl/3SGHoP5yS31CG94B9",
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("gender dosent exisit");
            }
        }
    }
},
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('user', userSchema);
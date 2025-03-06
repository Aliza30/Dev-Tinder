
const mongoose = require('mongoose');
const validator = require('validator');


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
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid");
            }
        }
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
    },
    skills: {
        type: [String],
        validate(value) {
            if (value.length > 20) {
                throw new Error("Malasious Data")
            }
        }
    }
},
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('user', userSchema);
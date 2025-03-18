
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Password is weak please enter a strong password");
            }
        }
    },
    about: {
        type: String,
        validate(value) {
            if (value.length > 200) {
                throw new Error("About can not be more than 200 characters");
            }
        },
        default: "Hi i am new to the platform"
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
        validator(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid URL" + value);
            }
        }
    },
    gender: {
        type: String,
        enum: {
            values: ["male", "female", "others"],
            message: "{VALUE} is not supported"
        }
    },
    skills: {
        type: [String],
        validate(value) {
            if (value.length > 20) {
                throw new Error("Malasious Data")
            }
        }
    },
    sports: {
        type: [String],
        validate(value) {
            if (value.length > 10) {
                throw new Error("No sport can be added")
            }
        }
    }
},
    {
        timestamps: true,
    }
)

userSchema.methods.getJwt = function () {
    const user = this;
    const token = jwt.sign({ _id: user._id }, "Namastedev@123", { expiresIn: "1 days" });
    return token;
}

userSchema.methods.passwordValide = async function (password) {
    const user = this;
    const passwordHash = user.password;
    const isMatch = await bcrypt.compare(password, passwordHash);
    return isMatch;
}
module.exports = mongoose.model('user', userSchema);
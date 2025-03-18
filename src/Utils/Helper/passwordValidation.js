
const validator = require('validator');


const validateSignUpdata = (req) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName) {
        return "Please fill all the fields";
    }
    if (!validator.isEmail(email)) {
        return "Email is invalid";
    }
    if (!validator.isStrongPassword(password)) {
        return "Password is weak please enter a strong password";
    }
}
const validateProfileDate = (req) => {
    const allowedEditFields = ['firstName', 'lastName', 'about', 'photoUrl', 'age', 'skills', 'sports', 'gender'];
    const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));
    if (!isEditAllowed) return false;

    // ✅ Check if `photoUrl` exists and is a valid URL
    if (req.body.photoUrl && !validator.isURL(req.body.photoUrl, { require_protocol: true })) {
        return false;  // Invalid URL
    }

    return true;
}

const isStrongPassword = (password) => {
    return validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    });
};

module.exports = { validateSignUpdata, validateProfileDate, isStrongPassword };
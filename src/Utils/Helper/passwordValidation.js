
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

module.exports = validateSignUpdata;
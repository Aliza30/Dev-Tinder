// Middleware/auth.js
const AdminAuth = (req, res, next) => {  // Fixed parameter order
    console.log('Admin Auth');
    const password = 'xydz';
    const token = password === 'xyz';
    if (!token) {
        res.status(401).send('Admin data Unauthorized');
    } else {
        next();
    }
};

const UserAuth = (req, res, next) => {  // Fixed parameter order
    console.log('User Auth');
    const password = 'xyz';
    if (password === 'xyz') {
        next();
    } else {
        res.status(401).send('User data Unauthorized');  // Added status code
    }
};

module.exports = { AdminAuth, UserAuth };
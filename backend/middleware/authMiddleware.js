const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = (req, res, next) => {
    // 1. Get the token from the header
    const token = req.header('x-auth-token');

    // 2. If no token, kick them out
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // 3. Verify the token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to the request
        next(); // Allow them to pass
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
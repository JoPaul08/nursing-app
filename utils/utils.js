const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
require('dotenv').config();

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '3d' });
};

const requireAuth = async (context) => {
    const { req } = context;
    const token = req.headers.authorization;
    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            context.user = await User.findById(decodedToken.id);
            if (!context.user) {
                throw new Error('No user found with this token');
            }
            return context;
        } catch (err) {
            err.status = 401; // Unauthorized
            throw err;
        }
    } else {
        const error = new Error('Authorization token required');
        error.status = 401; // Unauthorized
        throw error;
    }
};

module.exports = { createToken, requireAuth };

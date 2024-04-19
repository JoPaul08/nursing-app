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
         return context;
      } catch (err) {
         throw new Error('Invalid/expired token');
      }
   } else {
      throw new Error('Authorization token required');
   }
};

module.exports = { createToken, requireAuth };

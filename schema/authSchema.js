const { GraphQLObjectType, GraphQLString, GraphQLNonNull } = require('graphql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { UserType } = require('./userSchema');

const AuthMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        signup: {
            type: UserType,
            args: {
                email: { type: GraphQLNonNull(GraphQLString) },
                password: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: async (_, { email, password }) => {
                try {
                    const existingUser = await User.findOne({ email });
                    if (existingUser) {
                        throw new Error('User already exists');
                    }
                    const hashedPassword = await bcrypt.hash(password, 10);
                    const newUser = new User({ email, password: hashedPassword });
                    const savedUser = await newUser.save();
                    return savedUser;
                } catch (err) {
                    throw new Error(err.message);
                }
            }
        },
        login: {
            type: UserType,
            args: {
                email: { type: GraphQLNonNull(GraphQLString) },
                password: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: async (_, { email, password }) => {
                try {
                    const user = await User.findOne({ email });
                    if (!user) {
                        throw new Error('User not found');
                    }
                    const auth = await bcrypt.compare(password, user.password);
                    if (!auth) {
                        throw new Error('Invalid password');
                    }
                    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' });
                    return { token, user };
                } catch (err) {
                    throw new Error(err.message);
                }
            }
        }
    })
});

module.exports = { AuthMutationType };

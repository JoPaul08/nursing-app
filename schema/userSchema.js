const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLNonNull, GraphQLEnumType } = require('graphql');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');
const User = require('../models/user');

// Define the GraphQL type for User
const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'This represents a user',
    fields: () => ({
        _id: { type: GraphQLNonNull(GraphQLID) },
        email: { type: GraphQLNonNull(GraphQLString) },
        role: { type: GraphQLNonNull(RoleEnumType) }
    })
});

// Define the RoleEnumType
const RoleEnumType = new GraphQLEnumType({
    name: 'Role',
    values: {
        NURSE: { value: 'nurse' },
        PATIENT: { value: 'patient' }
    }
});

// Define the GraphQL mutation for User
const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        createUser: {
            type: UserType,
            description: 'Create a new user',
            args: {
                email: { type: GraphQLNonNull(GraphQLString) },
                password: { type: GraphQLNonNull(GraphQLString) },
                role: { type: GraphQLNonNull(RoleEnumType) }
            },
            resolve: async (parent, args) => {
                try {
                    const { email, password, role } = args;
                    const hashedPassword = await bcrypt.hash(password, 10);
                    const newUser = new User({ email, password: hashedPassword, role });
                    const savedUser = await newUser.save();
                    return savedUser;
                } catch (err) {
                    console.error(err);
                    throw new Error('Error creating user');
                }
            }
        }
    })
});

module.exports = { UserType, RootMutationType };

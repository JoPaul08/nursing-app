const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLNonNull, GraphQLFloat } = require('graphql');
const VitalSigns = require('../models/VitalSigns');

// Define the GraphQL type for VitalSigns
const VitalSignsType = new GraphQLObjectType({
    name: 'VitalSigns',
    description: 'This represents vital signs',
    fields: () => ({
        _id: { type: GraphQLNonNull(GraphQLID) },
        userId: { type: GraphQLNonNull(GraphQLID) },
        date: { type: GraphQLString },
        bodyTemperature: { type: GraphQLFloat },
        heartRate: { type: GraphQLFloat },
        bloodPressure: { type: GraphQLString },
        respiratoryRate: { type: GraphQLFloat }
    })
});

// Define the GraphQL mutation for VitalSigns
const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        createVitalSigns: {
            type: VitalSignsType,
            description: 'Create vital signs',
            args: {
                userId: { type: GraphQLNonNull(GraphQLID) },
                bodyTemperature: { type: GraphQLFloat },
                heartRate: { type: GraphQLFloat },
                bloodPressure: { type: GraphQLString },
                respiratoryRate: { type: GraphQLFloat }
            },
            resolve: async (parent, args) => {
                try {
                    const newVitalSigns = new VitalSigns({ ...args });
                    const savedVitalSigns = await newVitalSigns.save();
                    return savedVitalSigns;
                } catch (err) {
                    console.error(err);
                    throw new Error('Error creating vital signs');
                }
            }
        }
    })
});

module.exports = { VitalSignsType, RootMutationType };

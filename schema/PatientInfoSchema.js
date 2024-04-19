const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLNonNull, GraphQLList, GraphQLFloat } = require('graphql');
const PatientInfo = require('../models/PatientInfo');

// Define the GraphQL type for PatientInfo
const PatientInfoType = new GraphQLObjectType({
    name: 'PatientInfo',
    description: 'This represents patient information',
    fields: () => ({
        _id: { type: GraphQLNonNull(GraphQLID) },
        userId: { type: GraphQLNonNull(GraphQLID) },
        date: { type: GraphQLString },
        pulseRate: { type: GraphQLFloat },
        bloodPressure: { type: GraphQLString },
        weight: { type: GraphQLFloat },
        temperature: { type: GraphQLFloat },
        respiratoryRate: { type: GraphQLFloat }
    })
});

// Define the GraphQL mutation for PatientInfo
const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        createPatientInfo: {
            type: PatientInfoType,
            description: 'Create a new patient information',
            args: {
                userId: { type: GraphQLNonNull(GraphQLID) },
                pulseRate: { type: GraphQLFloat },
                bloodPressure: { type: GraphQLString },
                weight: { type: GraphQLFloat },
                temperature: { type: GraphQLFloat },
                respiratoryRate: { type: GraphQLFloat }
            },
            resolve: async (parent, args) => {
                try {
                    const newPatientInfo = new PatientInfo({ ...args });
                    const savedPatientInfo = await newPatientInfo.save();
                    return savedPatientInfo;
                } catch (err) {
                    console.error(err);
                    throw new Error('Error creating patient information');
                }
            }
        }
    })
});

module.exports = { PatientInfoType, RootMutationType };


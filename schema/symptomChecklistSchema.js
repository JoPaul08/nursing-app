const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLNonNull, GraphQLList } = require('graphql');
const SymptomChecklist = require('../models/SymptomChecklist');

// Define the GraphQL type for SymptomChecklist
const SymptomChecklistType = new GraphQLObjectType({
    name: 'SymptomChecklist',
    description: 'This represents a symptom checklist',
    fields: () => ({
        _id: { type: GraphQLNonNull(GraphQLID) },
        userId: { type: GraphQLNonNull(GraphQLID) },
        date: { type: GraphQLString },
        symptoms: { type: GraphQLList(GraphQLString) }
    })
});

// Define the GraphQL mutation for SymptomChecklist
const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        createSymptomChecklist: {
            type: SymptomChecklistType,
            description: 'Create a new symptom checklist',
            args: {
                userId: { type: GraphQLNonNull(GraphQLID) },
                symptoms: { type: GraphQLList(GraphQLString) }
            },
            resolve: async (parent, args) => {
                try {
                    const newSymptomChecklist = new SymptomChecklist({ ...args });
                    const savedSymptomChecklist = await newSymptomChecklist.save();
                    return savedSymptomChecklist;
                } catch (err) {
                    console.error(err);
                    throw new Error('Error creating symptom checklist');
                }
            }
        }
    })
});

module.exports = { SymptomChecklistType, RootMutationType };

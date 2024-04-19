const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType } = require('graphql');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


// Import mutation types from schema files with different names
const { RootMutationType: UserMutation, UserType } = require('./schema/userSchema');
const { RootMutationType: PatientInfoMutation, PatientInfoType } = require('./schema/PatientInfoSchema');
const { RootMutationType: SymptomChecklistMutation, SymptomChecklistType } = require('./schema/symptomChecklistSchema');
const { RootMutationType: VitalSignsMutation, VitalSignsType } = require('./schema/vitalSignsSchema');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));


const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
       
    })
});

// Construct a GraphQL schema
const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: {
            ...UserMutation.getFields(),
            ...PatientInfoMutation.getFields(),
            ...SymptomChecklistMutation.getFields(),
            ...VitalSignsMutation.getFields()
        }
    })
});

const app = express();

// Middleware to handle JSON requests
app.use(express.json());

// Middleware to handle GraphQL requests
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true // Enable GraphiQL for easy testing
}));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/graphql`);
});

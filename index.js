const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLNonNull,
    GraphQLList,
    GraphQLFloat,
    GraphQLEnumType,
    GraphQLSchema
} = require('graphql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import models
const User = require('./models/user');
const VitalSigns = require('./models/vitalsigns');
const PatientInfo = require('./models/PatientInfo');
const SymptomChecklist = require('./models/SymptomChecklist');

// Set up constants from environment variables
const PORT = process.env.PORT || 4000;
const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING; 

// Connecting to MongoDB
mongoose.connect(MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB successfully'))
.catch(err => console.error('Failed to connect to MongoDB:', err));

// Define GraphQL EnumType for User Roles
const RoleEnumType = new GraphQLEnumType({
    name: 'Role',
    values: {
        NURSE: { value: 'nurse' },
        PATIENT: { value: 'patient' }
    }
});

// Define GraphQL Object Types
const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'This represents a user',
    fields: () => ({
        _id: { type: GraphQLNonNull(GraphQLID) },
        email: { type: GraphQLNonNull(GraphQLString) },
        role: { type: GraphQLNonNull(RoleEnumType) }
    })
});

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

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        user: {
            type: UserType,
            args: { id: { type: GraphQLNonNull(GraphQLID) } },
            resolve: (_, args) => {
                return User.findById(args.id);
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve: () => {
                return User.find({});
            }
        }
    })
});

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        signup: {
            type: UserType,
            args: {
                email: { type: GraphQLNonNull(GraphQLString) },
                password: { type: GraphQLNonNull(GraphQLString) },
                role: { type: GraphQLNonNull(RoleEnumType) }
            },
            resolve: async (_, { email, password, role }) => {
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    throw new Error('User already exists');
                }
                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = new User({ email, password: hashedPassword, role });
                return await newUser.save();
            }
        },
        login: {
            type: UserType,
            args: {
                email: { type: GraphQLNonNull(GraphQLString) },
                password: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: async (_, { email, password }) => {
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
            }
        },
        createVitalSigns: {
            type: VitalSignsType,
            args: {
                userId: { type: GraphQLNonNull(GraphQLID) },
                bodyTemperature: { type: GraphQLFloat },
                heartRate: { type: GraphQLFloat },
                bloodPressure: { type: GraphQLString },
                respiratoryRate: { type: GraphQLFloat }
            },
            resolve: async (_, args) => {
                const newVitalSigns = new VitalSigns(args);
                return await newVitalSigns.save();
            }
        },
        createPatientInfo: {
            type: PatientInfoType,
            args: {
                userId: { type: GraphQLNonNull(GraphQLID) },
                pulseRate: { type: GraphQLFloat },
                bloodPressure: { type: GraphQLString },
                weight: { type: GraphQLFloat },
                temperature: { type: GraphQLFloat },
                respiratoryRate: { type: GraphQLFloat }
            },
            resolve: async (_, args) => {
                const newPatientInfo = new PatientInfo(args);
                return await newPatientInfo.save();
            }
        },
        createSymptomChecklist: {
            type: SymptomChecklistType,
            args: {
                userId: { type: GraphQLNonNull(GraphQLID) },
                symptoms: { type: GraphQLList(GraphQLString) }
            },
            resolve: async (_, args) => {
                const newSymptomChecklist = new SymptomChecklist(args);
                return await newSymptomChecklist.save();
            }
        }
    })
});


const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
});



const app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true // Enable GraphiQL in development
}));

// Basic Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

// Root endpoint
app.get('/', (req, res) => {
    res.send('Welcome to the GraphQL API Server');
  });

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = {
    UserType,
    RootMutationType,
    VitalSignsType,
    PatientInfoType,
    SymptomChecklistType
};
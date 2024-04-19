const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLNonNull, GraphQLList, GraphQLFloat, GraphQLEnumType } = require('graphql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const VitalSigns = require('../models/vitalSigns');
const PatientInfo = require('../models/patientInfo');
const SymptomChecklist = require('../models/symptomChecklist');

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
const AuthMutationType = new GraphQLObjectType({
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
                try {
                    const existingUser = await User.findOne({ email });
                    if (existingUser) {
                        throw new Error('User already exists');
                    }
                    const hashedPassword = await bcrypt.hash(password, 10);
                    const newUser = new User({ email, password: hashedPassword, role });
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
const PatientInfoMutationType = new GraphQLObjectType({
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
const SymptomChecklistMutationType = new GraphQLObjectType({
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


module.exports = { 
    UserType, 
    AuthMutationType, 
    VitalSignsType, 
    VitalSignsMutationType,
    PatientInfoType, 
    PatientInfoMutationType,
    SymptomChecklistType, 
    SymptomChecklistMutationType
};

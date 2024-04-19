const mongoose = require('mongoose');

const symptomChecklistSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        validate: {
            // Validate that the userId corresponds to a user with a 'patient' role
            validator: async function(value) {
                const user = await mongoose.model('User').findById(value);
                return user && user.role === 'patient';
            },
            message: () => 'SymptomChecklist can only be created for users with a patient role.'
        }
    },
    date: { type: Date, default: Date.now },
    symptoms: [{ type: String }]  // List of symptoms selected by the patient
});

module.exports = mongoose.model('SymptomChecklist', symptomChecklistSchema);

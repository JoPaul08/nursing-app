const mongoose = require('mongoose');

const vitalSignsSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true,
        validate: {
            validator: async function(value) {
                // Check if the user is a nurse
                const user = await mongoose.model('User').findById(value);
                return user && user.role === 'nurse';
            },
            message: 'Vital signs can only be recorded by users with a nurse role.'
        }
    },
    date: { type: Date, default: Date.now },
    bodyTemperature: { type: Number, required: false },
    heartRate: { type: Number, required: false },
    bloodPressure: { type: String, required: false },
    respiratoryRate: { type: Number, required: false }
});

module.exports = mongoose.model('VitalSigns', vitalSignsSchema);


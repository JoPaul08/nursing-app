const mongoose = require('mongoose');

const patientInfoSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        validate: {
            validator: async function(value) {
                try {
                    const user = await mongoose.model('User').findById(value);
                    return user && user.role === 'patient';
                } catch (err) {
                    throw new Error('Database error during validation');
                }
            },
            message: () => 'PatientInfo can only be created for users with a patient role.'
        }
    },
    date: { type: Date, default: Date.now },
    pulseRate: { type: Number, required: false },
    bloodPressure: { type: String, required: false },
    weight: { type: Number, required: false },
    temperature: { type: Number, required: false },
    respiratoryRate: { type: Number, required: false }
});

module.exports = mongoose.model('PatientInfo', patientInfoSchema);

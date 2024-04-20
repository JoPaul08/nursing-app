const mongoose = require('mongoose');

const vitalSignsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        validate: {
            validator: async function(value) {
                try {
                    const user = await mongoose.model('User').findById(value);
                    return user && user.role === 'nurse';
                } catch (err) {
                    throw new Error('Database error during validation');
                }
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



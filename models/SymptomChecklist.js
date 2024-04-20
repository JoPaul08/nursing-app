const mongoose = require('mongoose');

const symptomChecklistSchema = new mongoose.Schema({
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
            message: () => 'SymptomChecklist can only be created for users with a patient role.'
        }
    },
    date: { type: Date, default: Date.now },
    symptoms: [{ type: String }]
});

module.exports = mongoose.model('SymptomChecklist', symptomChecklistSchema);


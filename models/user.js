const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters']
    },
    role: {
        type: String,
        enum: ['nurse', 'patient'],
        required: true
    }
});

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email }).select('+password');
    if (!user) {
        throw Error('Email does not exist');
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
        throw Error('Incorrect password');
    }
    return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;


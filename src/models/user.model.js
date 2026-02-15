const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required for registration"],
        unique: [true, "Email already exists"],
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, "Please use a valid email address"]
    },
    name:{
        type: String,
        required: [true, "Name is required for registration"],
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required for registration"],
        minlength: [6, "Password must be at least 6 characters long"],
        select: false
    }
}, {
    timestamps: true
})

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
})
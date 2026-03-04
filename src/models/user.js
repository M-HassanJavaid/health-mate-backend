import mongoose from 'mongoose';
import validator from 'validator'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
    },

    email: {
        type: String,
        required: true,
        validate: {
            validator: (value) => validator.isEmail(value),
            message: 'Email is not valid'
        }
    },

    password: {
        type: String,
        required: true,
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    otp: {
        type: String,
        default: null
    },

    otpExpiry: {
        type: Date,
        default: null
    },

    gender: {
        type: String,
        required: true,
        enum : ['male' , 'female' , 'others']
    },

    dateOfBirth: {
        type: String,
        required: true,
    },

    lastWeight: {
        type: Number,
        default: null
    },

    lastSugar: {
        type: Number,
        default: null
    },

    lastBloodPressure: {
        type: {
            systolic: {
                type: Number,
                required: true
            },
            diastolic: {
                type: Number,
                required: true
            }
        },
        default: null
    },

    lastSleepingDuration: {
        type: Number,
        default: null
    },

} , { timestamps: true })



const User = mongoose.model("User" , userSchema , "users");
export default User;

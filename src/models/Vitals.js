import mongoose from "mongoose";

const vitalsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        required: true
    },

    weight: {
        type: Number,
        default: null
    },

    sugar: {
        type: Number,
        default: null
    },

    bloodPressure: {
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

    sleepingDuration: {
        type: Number,
        default: null
    },

    notes: {
        type: String,
        default: null
    }
}, {timestamps: true});

const Vitals = mongoose.model('Vitals' , vitalsSchema , 'vitals');

export default Vitals
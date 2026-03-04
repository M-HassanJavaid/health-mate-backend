import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    
    url:{
        type: String,
        required: true,
    },

    name: {
        type: String,
        required: true
    },

    fileId: {
        type: String,
        required: true,
    },

    note: {
        type: String,
    },

    aiReport: {
        default: null,
        type: mongoose.Types.ObjectId
    }
}, { timestamps: true });

const Document = mongoose.model('Document' , documentSchema , 'documents');
export default Document
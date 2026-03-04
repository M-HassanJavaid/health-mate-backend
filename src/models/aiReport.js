import mongoose from "mongoose";

const aiReportSchema = new mongoose.Schema({

    user: {
        type: mongoose.Types.ObjectId,
        required: true
    },

    sourceId:{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Document'
    },

    source: {
        type: String,
        enum: ['document' , 'vitals'],
        required: true
    },

    summaryInEnglish: {
        type: String,
        required: true
    },

    summaryInRomanUrdu: {
        type: String,
        required: true
    },

    questionsToDoctorInEnglish: {
        type: [String],
        required: true
    },

    questionsToDoctorInRomanUrdu: {
        type: [String],
        required: true
    },


    foodsToEatInEnglish: {
        type: [String],
        required: true
    },

    foodsToEatInRomanUrdu: {
        type: [String],
        required: true
    },


    foodsToAvoidInEnglish: {
        type: [String],
        required: true
    },

    foodsToAvoidInRomanUrdu: {
        type: [String],
        required: true
    },


    homeRemediesInEnglish: {
        type: [String],
        required: true
    },

    homeRemediesInRomanUrdu: {
        type: [String],
        required: true
    },

} , {timestamps: true});

const AiReport = mongoose.model('aiReport' , aiReportSchema , 'aiReports');
export default AiReport
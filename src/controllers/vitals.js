import Vitals from "../models/Vitals.js";
import User from '../models/user.js'

export async function addVitals(req, res) {
    try {
        let {
            weight,
            sugar,
            bloodPressure,
            sleepingDuration,
            notes
        } = req.body;

        if (!weight && !sugar && !bloodPressure && !sleepingDuration && !notes) {
            return res.status(400).json({
                success: false,
                message: 'At least one vital is required'
            })
        }
        
        let newVitals = new Vitals({
            user: req.user._id
        });

        let user = await User.findById(req.user._id);
        
        if (weight) {
            newVitals.weight = weight;
            user.lastWeight = weight;
        }
        if (bloodPressure) {
            let {diastolic , systolic} = bloodPressure;
            if (!diastolic || !systolic) {
                return res.status(400).json({
                    success: false,
                    message: "For bloodpressure 'diastolic' and 'systolic' are required"
                })
            }
            newVitals.bloodPressure = {};
            user.lastBloodPressure = {};
            newVitals.bloodPressure.systolic = systolic;
            user.lastBloodPressure.systolic = systolic;
            newVitals.bloodPressure.diastolic = diastolic;
            user.lastBloodPressure.diastolic = diastolic;
        }
        
        if (sugar) {
            newVitals.sugar = sugar;
            user.lastSugar = sugar;
        }

        if (sleepingDuration) {
            newVitals.sleepingDuration = sleepingDuration;
            user.lastSleepingDuration = sleepingDuration;
        }
        if (notes) newVitals.notes = notes;            

        let savedVitals = (await newVitals.save()).toObject();

        res.status(201).json({
            success: true,
            message: 'Vitals are added successfully',
            vitals : savedVitals
        });

        await user.save();

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export async function getVitals(req ,res) {
    try {
        let userId = req.user._id;
        let vitals = await Vitals.find({ user : userId }).sort({createdAt : -1});
        res.status(200).json({
            success: true,
            message: 'Vitals has sent successfully',
            vitals
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
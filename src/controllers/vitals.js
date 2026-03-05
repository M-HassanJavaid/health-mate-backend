import mongoose from "mongoose";
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
            let { diastolic, systolic } = bloodPressure;
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
            vitals: savedVitals
        });

        await user.save();

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export async function getVitals(req, res) {
    try {
        let userId = req.user._id;
        let vitals = await Vitals.find({ user: userId }).sort({ createdAt: -1 });
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

export async function deleteVitals(req, res) {
    try {
        let vitalsId = req.params.id;

        let latestVitals = await Vitals
            .find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(2);


        let deletedVitals = await Vitals.findByIdAndDelete({
            _id: new mongoose.Types.ObjectId(vitalsId),
            user: req.user._id
        });

        if (!deletedVitals) {
            return res.status(404).json({
                success: false,
                message: 'Vitals not found'
            })
        }


        if (deletedVitals._id.toString() === latestVitals[0]._id.toString()) {
            if (deletedVitals.weight) {
                req.user.lastWeight = latestVitals[1].weight;
            }
            if (deletedVitals.sugar) {
                req.user.lastSugar = latestVitals[1].sugar;
            }
            if (deletedVitals.bloodPressure) {
                req.user.lastBloodPressure = latestVitals[1].bloodPressure;
            }
            if (deletedVitals.sleepingDuration) {
                req.user.lastSleepingDuration = latestVitals[1].sleepingDuration;
            }
            await req.user.save();
        }

        res.status(200).json({
            success: true,
            message: 'Vitals has deleted successfully'
        });

        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
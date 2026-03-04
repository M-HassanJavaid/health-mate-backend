import Document from "../models/document.js";

export async function getKpis(req, res) {
    try {
        let totalReports = await Document.countDocuments();
        let lastUplaod = await Document.find().sort({ createdAt: -1 }).limit(1);
        let lastUplaodDate = lastUplaod.createdAt;

        let kpis = {
            lastUplaodDate,
            totalReports,
            lastBloodPressure: req.user.lastBloodPressure ? (
                `${req.user.lastBloodPressure.systolic}/${req.user.lastBloodPressure.diastolic}`
            ) : null,
            lastSugar: req.user.lastSugar,
            lastWeight: req.user.lastWeight,
            lastSleepingDuration: req.user.lastSleepingDuration
        }

        res.status(200).json({
            success: true,
            message: 'KPIs has sent successfully',
            anylatics: kpis
        });

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
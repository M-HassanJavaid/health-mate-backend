import express from 'express'
import getAiReport from '../utils/generateReport.js';
import AiReport from '../models/aiReport.js'; 
import Document from '../models/document.js';
import mongoose from 'mongoose';

export async function generateAiReport(req , res) {
    try {
        let { documentId } = req.body;

        let doc = await Document.findById(documentId);

        if (!doc) {
            return res.status(400).json({
                success: false,
                message: 'Document not found'
            })
        }

        console.log(doc.url)
        let aiReponse = await getAiReport(doc.url);
        console.log(aiReponse)

        if(!aiReponse.ok){
            return res.status(400).json({
                success: false,
                message: aiReponse.error
            })
        }

        // console.log(aiReponse)
        delete aiReponse.ok

        let newAiReport = new AiReport({
            source: 'document',
            sourceId: doc._id,
            user: req.user._id,
            ...aiReponse
        });

        let savedAiReport = await newAiReport.save();
        
        doc.aiReport = savedAiReport._id;
        await doc.save()

        res.status(200).json({
            success: true,
            message: 'Reponse has generated and saved to document',
            aiReport : savedAiReport
        });

        doc.aiReport = savedAiReport._id;
        await doc.save()

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export async function getAiReportById(req , res) {
    try {
        let id = req.params.id;
        let aiReport = await AiReport.findOne({
            _id: new mongoose.Types.ObjectId(id),
            user: req.user._id
        }).populate('sourceId');

        if (!aiReport) {
            return res.status(404).json({
                success: false,
                message: 'Report not found.'
            })
        }

        res.status(200).json({
            success: true,
            message: 'report has sent',
            aiReport
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export async function getAllReports() {
    
}
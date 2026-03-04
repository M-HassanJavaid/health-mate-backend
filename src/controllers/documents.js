import Document from "../models/document.js";
import cloudinaryUpload from "../utils/cloudinaryUpload.js";
import { v2 as cloudinary } from 'cloudinary'
import mongoose from "mongoose";

export async function uploadDocument(req , res) {
    try {
        const { name , note } = req.body ?? {};
        let userId = req.user._id;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Name is required.'
            })
        }

        if (!req?.file || !req?.file?.buffer) {
            return res.status(400).json({
                success: false,
                message: "Document is not provided"
            })
        }

        const fileExt = req.file.mimetype.split("/")[1]

        let cloudinaryRes = await cloudinaryUpload(req.file.buffer, { 
            folder: 'healthMate',
            resource_type: "auto",
            format: fileExt,
            type: "upload"
        });

        // console.log(cloudinary.type)

        req.fileId = cloudinaryRes.public_id;


        let newDocument = new Document({
            name,
            note,
            url: cloudinaryRes.secure_url,
            fileId: cloudinaryRes.public_id,
            user: userId
        });

        let savedDocument = (await newDocument.save()).toObject();

        res.status(201).json({
            success: true,
            message: 'Document has saved.',
            document: savedDocument
        })


    } catch (error) {

        if (req.fileId) {
            await cloudinary.uploader.destroy(req.fileId)
        }
        
        res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

export async function getDocumentById(req , res) {
    try {
        let documentId = req.params.id;
        let document = await Document.findOne({ 
            _id: new mongoose.Types.ObjectId(documentId),
            user: req.user._id
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Document has send to you',
            document
        });


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};


export async function getAllDocuments(req , res) {
    try {
        let documents = await Document.find({ user : req.user._id });
        res.status(200).json({
            success: true,
            message: "User's all documents has sent to you.",
            documents
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export async function updateDocument(req , res) {
    try {
        let documentId = req.params.id;
        let { name , note } = req.body ?? {} ;
        console.log(req.body)
        

        if (!name && !note && !req?.file && !req?.file?.buffer) {
            return res.status(400).json({
                success: false,
                message: 'No updates provided'
            })
        }

        let document = await Document.findOne({ 
            _id: new mongoose.Types.ObjectId(documentId),
            user: req.user._id
        });

        if (name) document.name = name;
        if (note) document.note = note;

        if (req.file && req.file.buffer) {
            const fileExt = req.file.mimetype.split("/")[1]
    
            let cloudinaryRes = await cloudinaryUpload(req.file.buffer, { 
                folder: 'healthMate',
                resource_type: "auto",
                format: fileExt,
                type: "upload"
            });

            req.documentToDelete = document.fileId;

            document.url = cloudinaryRes.secure_url;
            document.fileId = cloudinaryRes.public_id;
            
        }


        let updatedDocument = await document.save();

        res.status(200).json({
            success: true,
            message: 'Document has updated successfully',
            updatedDocument
        })
        
        if (req.documentToDelete) {
            await cloudinary.uploader.destroy(req.documentToDelete)
        }
        


    } catch (error) {
        
        res.status(500).json({
            success: false,
            message: error.message
        })

    }
}


export async function deleteDocument(req  , res) {
    try {
        let documentId = req.params.id;
        let deletedDocument = await Document.findByIdAndDelete(documentId);
        if (!deletedDocument) {
            return res.status(404).json({
                success: false,
                message: 'docuument not found'
            })
        }

        res.status(200).json({
            success: false,
            message: 'Document has deleted successfully'
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
import express from 'express'
const documentRouter = express.Router();
import upload from '../middleware/upload.js'
import { deleteDocument, getAllDocuments, getDocumentById, updateDocument, uploadDocument } from '../controllers/documents.js';

documentRouter.post('/add' ,  upload.single('document') , uploadDocument);
documentRouter.get('/id/:id' , getDocumentById);
documentRouter.get('/all' , getAllDocuments);
documentRouter.put('/update/:id', upload.single('document') , updateDocument);
documentRouter.delete('/delete/:id' , deleteDocument);


export default documentRouter
import express from 'express';
import { addVitals, deleteVitals, getVitals } from '../controllers/vitals.js';

const vitalsRouter = express.Router();

vitalsRouter.post('/add' , addVitals);
vitalsRouter.get('/getVitals' , getVitals);
vitalsRouter.delete('/delete/:id' , deleteVitals);


export default vitalsRouter
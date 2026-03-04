import express from 'express';
import { addVitals, getVitals } from '../controllers/vitals.js';

const vitalsRouter = express.Router();

vitalsRouter.post('/add' , addVitals);
vitalsRouter.get('/getVitals' , getVitals)

export default vitalsRouter
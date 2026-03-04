import express from 'express';
import { getKpis } from '../controllers/anylatics.js';
const anylaticsRouter = express.Router();

anylaticsRouter.get('/kpis' , getKpis);

export default anylaticsRouter
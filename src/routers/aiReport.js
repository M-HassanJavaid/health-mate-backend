import express from "express";
import { generateAiReport, getAiReportById } from "../controllers/aiReport.js";

const aiReportRouter = express.Router();

aiReportRouter.post('/generateAiReport' , generateAiReport);
aiReportRouter.get('/id/:id' , getAiReportById)

export default aiReportRouter
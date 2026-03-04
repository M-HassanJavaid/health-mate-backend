import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/database.js";
import dns from 'node:dns'
dns.setServers(['1.1.1.1', '8.8.8.8']);
import authRouter from './routers/authRouter.js'
import cookieParser from "cookie-parser";
import documentRouter from "./routers/document.js";
import checkAuth from "./middleware/checkAuth.js";
import aiReportRouter from "./routers/aiReport.js";
import anylaticsRouter from "./routers/anylatics.js";
import vitalsRouter from "./routers/vitalsRouter.js";

dotenv.config()
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(cors({
    credentials: true,
    origin: true
}))
app.use(express.json());
app.use(express.urlencoded({  extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello from express')
});

app.use('/api/v1/auth' , authRouter);
app.use('/api/v1/document' ,  checkAuth , documentRouter);
app.use('/api/v1/ai' , checkAuth , aiReportRouter)
app.use('/api/v1/anylatics' , checkAuth , anylaticsRouter);
app.use('/api/v1/vitals', checkAuth , vitalsRouter)
// Connect to database
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`)
        })
    })
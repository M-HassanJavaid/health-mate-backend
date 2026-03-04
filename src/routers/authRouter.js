import express from 'express'
import { changePassword, getLogout, getUser, login, markUserVerify, resendVerificationMail, sentOtpForResetPass, signup, verifyOtp } from '../controllers/auth.js';
const authRouter = express.Router();



authRouter.post('/signup' , signup);
authRouter.post('/login' , login);
authRouter.get('/markVerify/:token' , markUserVerify);
authRouter.get('/resend-verification-email' , resendVerificationMail);
authRouter.post('/otp-for-reset-password' , sentOtpForResetPass);
authRouter.put('/verify-otp' , verifyOtp);
authRouter.put('/change-password' , changePassword);
authRouter.get('/getUser' , getUser);
authRouter.post('/logout' , getLogout)


export default authRouter
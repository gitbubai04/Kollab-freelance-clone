import express from 'express';
import {
    RequestRegistrationOtpController,
    UserLoginController,
    UserLogoutController,
    UserRegisterController,
    VerifyRegistrationOtpController,
} from '../controllers/auth.controller';

const authRouter = express.Router();

authRouter.post('/send-registration-otp', RequestRegistrationOtpController);
authRouter.post('/verify-registration-otp', VerifyRegistrationOtpController);
authRouter.post('/register', UserRegisterController);
authRouter.post('/signin', UserLoginController);
authRouter.post('/logout', UserLogoutController);

export default authRouter;

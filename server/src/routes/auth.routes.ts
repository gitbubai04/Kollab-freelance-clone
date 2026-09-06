import express from 'express';
import { UserLoginController, UserLogoutController } from '../controllers/auth.controller';

const authRouter = express.Router();

authRouter.post('/signin', UserLoginController);
authRouter.post('/logout', UserLogoutController);

export default authRouter;
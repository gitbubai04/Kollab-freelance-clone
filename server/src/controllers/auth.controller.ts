import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { ApiError } from '../utils/error.util';
import { HTTP_STATUSCODE, HTTPS_MESSAGE } from '../constant/http.constant';
import userModel from '../models/user.model';
import { ADMIN_INFO } from '../constant/adminInfo.constant';
import {
    AuthLoginService,
    RequestRegistrationOtpService,
    UserRegisterService,
    VerifyRegistrationOtpService,
} from '../service/auth.service';
import { IUser } from '../interface/user.interface';

const sendAuthError = (res: Response, error: unknown, logMessage: string) => {
    console.error(logMessage, error);

    if (error instanceof ApiError) {
        return res.status(error.status).json({
            success: false,
            message: error.message,
        });
    }

    return res.status(HTTP_STATUSCODE.INTERNAL_ERROR).json({
        success: false,
        message: HTTPS_MESSAGE.INTERNAL_ERROR,
    });
};

const sanitizeUser = (user: IUser) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    is_email_verified: user.is_email_verified,
    is_phone_verified: user.is_phone_verified,
    is_profile_completed: user.is_profile_completed
});

// seed admin user
export const SeedAdminUser = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            throw new Error("ADMIN_EMAIL or ADMIN_PASSWORD missing in .env");
        }
        const existingAdmin = await userModel.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log("Admin already exists");
            return;
        }

        const hashedPassword = await bcrypt.hash(adminPassword as string, 10);

        await userModel.create({
            ...ADMIN_INFO,
            email: adminEmail,
            password: hashedPassword
        });

        console.log("Default admin created");

    } catch (error: unknown | ApiError) {
        console.error('Error in seedAdminUser:', error);
    }
}

// user login controller
export const UserLoginController = async (req: Request, res: Response) => {
    try {
        const { access_token, user } = await AuthLoginService(req.body);
        res.status(HTTP_STATUSCODE.OK).json({
            success: true,
            message: 'User logged in successfully',
            data: {
                access_token,
                user: sanitizeUser(user)
            }
        });
    } catch (error: unknown | ApiError) {
        sendAuthError(res, error, 'Error in UserLoginController:');
    }
}

// user logout controller
export const UserLogoutController = async (req: Request, res: Response) => {
    try {
        res.status(HTTP_STATUSCODE.OK).json({
            success: true,
            message: 'User logged out successfully',
        });
    } catch (error: unknown | ApiError) {
        sendAuthError(res, error, 'Error in UserLogoutController:');
    }
}

export const UserRegisterController = async (req: Request, res: Response) => {
    try {
        const user = await UserRegisterService(req.body);

        res.status(HTTP_STATUSCODE.CREATE).json({
            success: true,
            message: 'User registered successfully',
            data: sanitizeUser(user),
        });
    } catch (error: unknown | ApiError) {
        sendAuthError(res, error, 'Error in UserRegisterController:');
    }
}

export const RequestRegistrationOtpController = async (req: Request, res: Response) => {
    try {
        const data = await RequestRegistrationOtpService(req.body);

        res.status(HTTP_STATUSCODE.OK).json({
            success: true,
            message: 'Registration OTP sent successfully',
            data,
        });
    } catch (error: unknown | ApiError) {
        sendAuthError(res, error, 'Error in RequestRegistrationOtpController:');
    }
}

export const VerifyRegistrationOtpController = async (req: Request, res: Response) => {
    try {
        const data = await VerifyRegistrationOtpService(req.body);

        res.status(HTTP_STATUSCODE.OK).json({
            success: true,
            message: 'Registration OTP verified successfully',
            data,
        });
    } catch (error: unknown | ApiError) {
        sendAuthError(res, error, 'Error in VerifyRegistrationOtpController:');
    }
}


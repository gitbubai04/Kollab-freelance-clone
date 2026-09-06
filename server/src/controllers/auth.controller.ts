import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { ApiError } from '../utils/error.util';
import { HTTP_STATUSCODE, HTTPS_MESSAGE } from '../constant/http.constant';
import { AdminLoginSchema } from '../validators/admin.validator';
import { handleValidationError } from '../utils/response.util';
import userModel from '../models/user.model';
import { ADMIN_INFO } from '../constant/adminInfo.constant';

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

        const parsed = AdminLoginSchema.safeParse(req.body);
        if (!parsed.success) return handleValidationError(res, parsed.error);

        const { email, password } = parsed.data;

        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, 'Invalid email Address');
        }

        if (!user.is_active || user.is_deleted) throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, 'User is deleted or inactive');

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, 'Wrong password!');
        }

        // set last login at
        user.last_login = new Date();
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
            expiresIn: '7d',
        });

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);

        // change cookie name
        res.cookie('test', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: expiryDate,
        });

        res.status(HTTP_STATUSCODE.OK).json({
            success: true,
            message: 'User logged in successfully',
            data: {
                role: user.role
            }
        });
    } catch (error: unknown | ApiError) {
        console.error('Error in userSignUpController:', error);

        if (error instanceof ApiError) {
            res.status(error.status).json({
                success: false,
                message: error.message,
            });
        } else {
            res.status(HTTP_STATUSCODE.INTERNAL_ERROR).json({
                success: false,
                message: HTTPS_MESSAGE.INTERNAL_ERROR,
            });
        }
    }
}

// user logout controller
export const UserLogoutController = async (req: Request, res: Response) => {
    try {
        res.clearCookie('test',
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            }
        );
        res.status(HTTP_STATUSCODE.OK).json({
            success: true,
            message: 'User logged out successfully',
        });
    } catch (error: unknown | ApiError) {
        console.error('Error in userSignUpController:', error);

        if (error instanceof ApiError) {
            res.status(error.status).json({
                success: false,
                message: error.message,
            });
        } else {
            res.status(HTTP_STATUSCODE.INTERNAL_ERROR).json({
                success: false,
                message: HTTPS_MESSAGE.INTERNAL_ERROR,
            });
        }
    }
}


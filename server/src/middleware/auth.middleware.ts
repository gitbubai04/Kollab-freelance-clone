import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.utils";
import userModel from "../models/user.model";
import { ApiError } from "../utils/error.util";
import { HTTP_STATUSCODE, HTTPS_MESSAGE } from "../constant/http.constant";
import { IUserRole } from "../constant/enum";

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        const token = authHeader?.startsWith("Bearer ")
            ? authHeader.slice(7)
            : undefined;

        if (!token) {
            throw new ApiError(
                HTTP_STATUSCODE.AUTH_FAILED,
                HTTPS_MESSAGE.NOT_AUTHORISED
            );
        }

        const decoded = verifyToken(token);

        if (!decoded) {
            throw new ApiError(
                HTTP_STATUSCODE.AUTH_FAILED,
                HTTPS_MESSAGE.NOT_AUTHORISED
            );
        }

        const user = await userModel.findOne({
            _id: decoded.userId,
            is_deleted: false,
            is_active: true,
        });

        if (!user) {
            throw new ApiError(
                HTTP_STATUSCODE.NOT_PRESENT,
                "User is not present"
            );
        }

        res.locals.userId = decoded.userId;
        res.locals.user = user;

        next();
    } catch (error: unknown) {
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
    }
};

export const requireRole = (...roles: IUserRole[]) => {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const user = res.locals.user;

            if (!user || !roles.includes(user.role)) {
                throw new ApiError(
                    HTTP_STATUSCODE.AUTH_FAILED,
                    "You are not authorised to access this resource"
                );
            }

            next();
        } catch (error: unknown) {
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
        }
    };
};
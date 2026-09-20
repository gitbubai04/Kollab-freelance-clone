import { Response } from 'express';
import { HTTP_STATUSCODE, HTTPS_MESSAGE } from '../constant/http.constant';

export class ApiError extends Error {
    status: number;
    message: string;

    constructor(status: number, message: string) {
        super();
        this.status = status;
        this.message = message;
    }
}

export const SendError = (res: Response, error: unknown, logMessage: string) => {
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


import { Response } from "express";
import { ZodError } from "zod";
import { HTTP_STATUSCODE } from "../constant/http.constant";

export const handleSuccess = (
    res: Response,
    code = HTTP_STATUSCODE.OK,
    message = "Success",
    data?: any,
    // pagination?: IPagination
) => res.status(code).json({ success: true, message, data });

export const handleError = (
    res: Response,
    code = HTTP_STATUSCODE.INTERNAL_ERROR,
    message = "Something went wrong"
) => res.status(code).json({ success: false, message });

export const handleValidationError = (
    res: Response,
    error: ZodError
) => res.status(HTTP_STATUSCODE.BAD_REQUEST).json({ success: false, message: error.issues[0].message });
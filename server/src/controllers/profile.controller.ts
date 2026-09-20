import { Request, Response } from "express"
import { ApiError, SendError } from "../utils/error.util"
import { HTTP_STATUSCODE } from "../constant/http.constant";
import { CompleteClientProfileService } from "../service/profile.service";

export const CompleteClientProfile = async (req: Request, res: Response) => {
    try {
        const { profile } = CompleteClientProfileService(req.body, res.locals.user_id);
        res.status(HTTP_STATUSCODE.OK).json({
            success: true,
            message: 'Client profile completed successfully',
        });

    } catch (error: unknown | ApiError) {
        SendError(res, error, 'Error in CompleteClientProfile:')
    }
}
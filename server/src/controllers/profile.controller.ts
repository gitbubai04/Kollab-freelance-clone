import { Request, Response } from "express"
import { ApiError, SendError } from "../utils/error.util"
import { HTTP_STATUSCODE } from "../constant/http.constant";
import { CompleteClientProfileService } from "../service/profile.service";

export const CompleteClientProfileController = async (
    req: Request,
    res: Response
) => {
    try {

        console.log('res.locals.user_id', res.locals.userId);
        const profile = await CompleteClientProfileService(
            req.body,
            res.locals.userId
        );

        res.status(HTTP_STATUSCODE.OK).json({
            success: true,
            message: "Client profile completed successfully",
            data: {
                profile,
            },
        });
    } catch (error: unknown) {
        SendError(res, error, "Error in CompleteClientProfile:");
    }
};
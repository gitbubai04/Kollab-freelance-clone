import { Request, Response } from 'express';
import { HTTP_STATUSCODE, HTTPS_MESSAGE } from '../constant/http.constant';
import { ApiError } from '../utils/error.util';
import { addSkillService } from '../service/skill.service';

// admin: add skill controller
export const AddSkillController = async (req: Request, res: Response) => {
    try {
        const skill = await addSkillService(req.body);

        res.status(HTTP_STATUSCODE.OK).json({
            success: true,
            message: 'Skill added successfully',
            data: skill
        });

    } catch (error: unknown | ApiError) {
        console.error('Error in AddSkillController:', error);

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
};

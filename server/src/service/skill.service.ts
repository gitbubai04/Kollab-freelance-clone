import Skill from '../models/skill.model';
import { ApiError } from '../utils/error.util';
import { HTTP_STATUSCODE } from '../constant/http.constant';
import { AddSkillSchema } from '../validators/skill.validator';

export const addSkillService = async (payload: string) => {
    const parsed = AddSkillSchema.safeParse(payload);
    if (!parsed.success) throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, parsed.error.message);

    const { name } = parsed.data;

    const existingSkill = await Skill.findOne({ name });
    if (existingSkill) throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, 'Skill already exists');

    const skill = await Skill.create({
        name,
        isDeleted: false
    });

    return skill;
};
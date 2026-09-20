import { EUserRole } from "../constant/enum";
import { HTTP_STATUSCODE } from "../constant/http.constant";
import { ClientProfile } from "../models/clientProfile.model";
import userModel from "../models/user.model";
import { ApiError } from "../utils/error.util";
import { createClientProfileSchema, TCreateClientProfileInput } from "../validators/profile.validitor";

export const CompleteClientProfileService = async (
    payload: TCreateClientProfileInput,
    user_id: string
) => {
    // Validate payload
    const parsed = createClientProfileSchema.safeParse(payload);

    if (!parsed.success) {
        throw new ApiError(
            HTTP_STATUSCODE.BAD_REQUEST,
            parsed.error.message
        );
    }

    // Find existing profile
    const user = await userModel.findOne({
        _id: user_id,
        is_deleted: false
    });

    console.log(user, user_id);
    if (!user) {
        throw new ApiError(
            HTTP_STATUSCODE.BAD_REQUEST,
            "User profile not found"
        );
    }

    const profile = await ClientProfile.create({
        user_id,
        ...parsed.data,
    });

    await userModel.findOneAndUpdate
        ({ _id: user_id }, { $set: { is_profile_completed: true } });

    return profile;
};

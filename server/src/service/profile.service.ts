import { HTTP_STATUSCODE } from "../constant/http.constant";
import { ClientProfile } from "../models/clientProfile.model";
import { ApiError } from "../utils/error.util";
import { createClientProfileSchema, TCreateClientProfileInput } from "../validators/profile.validitor";

export const CompleteClientProfileService = async (payload: TCreateClientProfileInput, user_id: string) => {
    const parsed = createClientProfileSchema.safeParse(payload);
    if (!parsed.success) throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, parsed.error.message);

    const profile = await ClientProfile.findOne({ user_id });
    if (!profile) throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, 'Profile not found');


}

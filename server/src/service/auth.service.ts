import bcrypt from 'bcryptjs';
import crypto from "crypto";
import jwt from 'jsonwebtoken';
import { HTTP_STATUSCODE } from "../constant/http.constant";
import { OtpChannel } from "../interface/otp.interface";
import {
    LoginPayload,
    RegisterPayload,
    RegistrationOtpRequestPayload,
    VerifyRegistrationOtpPayload,
} from "../interface/user.interface";
import otpVerificationModel from "../models/otpVerification.model";
import userModel from "../models/user.model";
import { ApiError } from "../utils/error.util";
import {
    AdminLoginSchema,
    AdminRegisterSchema,
    RegistrationOtpRequestSchema,
    VerifyRegistrationOtpSchema,
} from "../validators/admin.validator";
import { sendEmailOtp, sendSmsOtp } from "./notification.service";

const OTP_PURPOSE = "REGISTER";

const getOtpExpiryMinutes = () => Number(process.env.OTP_EXPIRY_MINUTES || 10);
const getOtpMaxAttempts = () => Number(process.env.OTP_MAX_ATTEMPTS || 5);
const normalizeEmail = (email: string) => email.trim().toLowerCase();
const normalizePhone = (phone: string) => phone.trim().replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "");
const generateOtp = () => crypto.randomInt(100000, 1000000).toString();
const getExpiryDate = () => new Date(Date.now() + getOtpExpiryMinutes() * 60 * 1000);
const getOtpLabel = (channel: OtpChannel) => channel === "EMAIL" ? "Email" : "Phone";

const normalizeAndValidatePhone = (phone: string) => {
    const normalizedPhone = normalizePhone(phone);
    const digitCount = normalizedPhone.replace(/\D/g, "").length;

    if (digitCount < 7 || digitCount > 15) {
        throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, "Invalid phone number");
    }

    return normalizedPhone;
};

const ensureNoDuplicateContact = async (email: string, phone: string) => {
    const existingUser = await userModel.findOne({ $or: [{ email }, { phone }] }).lean();

    if (!existingUser) return;

    if (existingUser.email === email) {
        throw new ApiError(HTTP_STATUSCODE.DUPLICATE_RECORD, "Email already exists");
    }

    if (existingUser.phone === phone) {
        throw new ApiError(HTTP_STATUSCODE.DUPLICATE_RECORD, "Phone number already exists");
    }

    throw new ApiError(HTTP_STATUSCODE.DUPLICATE_RECORD, "User already exists");
};

const saveOtp = async (identifier: string, channel: OtpChannel, otp: string) => {
    await otpVerificationModel.deleteMany({
        identifier,
        channel,
        purpose: OTP_PURPOSE,
        consumed_at: null,
    });

    return otpVerificationModel.create({
        identifier,
        channel,
        purpose: OTP_PURPOSE,
        otp_hash: await bcrypt.hash(otp, 10),
        expires_at: getExpiryDate(),
    });
};

const verifyOtp = async (identifier: string, channel: OtpChannel, otp: string) => {
    const label = getOtpLabel(channel);
    const otpRecord = await otpVerificationModel
        .findOne({
            identifier,
            channel,
            purpose: OTP_PURPOSE,
            consumed_at: null,
            expires_at: { $gt: new Date() },
        })
        .sort({ createdAt: -1 });

    if (!otpRecord) {
        throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, `${label} OTP has expired or was not requested`);
    }

    if (otpRecord.attempts >= getOtpMaxAttempts()) {
        throw new ApiError(HTTP_STATUSCODE.LIMIT_EXCEEDED, `${label} OTP attempt limit exceeded`);
    }

    const isOtpMatch = await bcrypt.compare(otp, otpRecord.otp_hash);
    if (!isOtpMatch) {
        otpRecord.attempts += 1;
        await otpRecord.save();
        throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, `Invalid ${label.toLowerCase()} OTP`);
    }

    otpRecord.verified_at = new Date();
    await otpRecord.save();

    return otpRecord;
};

const findVerifiedOtp = async (identifier: string, channel: OtpChannel) => {
    return otpVerificationModel
        .findOne({
            identifier,
            channel,
            purpose: OTP_PURPOSE,
            consumed_at: null,
            verified_at: { $ne: null },
            expires_at: { $gt: new Date() },
        })
        .sort({ verified_at: -1 });
};

const ensureVerifiedRegistrationContacts = async (email: string, phone: string) => {
    const [emailOtp, phoneOtp] = await Promise.all([
        findVerifiedOtp(email, "EMAIL"),
        findVerifiedOtp(phone, "PHONE"),
    ]);

    if (!emailOtp || !phoneOtp) {
        throw new ApiError(
            HTTP_STATUSCODE.BAD_REQUEST,
            "Email and phone OTP must be verified before registration",
        );
    }

    return { emailOtp, phoneOtp };
};

const handleDuplicateKeyError = (error: unknown): never => {
    if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
        const keyPattern = "keyPattern" in error ? error.keyPattern as Record<string, number> : {};

        if (keyPattern.email) {
            throw new ApiError(HTTP_STATUSCODE.DUPLICATE_RECORD, "Email already exists");
        }

        if (keyPattern.phone) {
            throw new ApiError(HTTP_STATUSCODE.DUPLICATE_RECORD, "Phone number already exists");
        }

        throw new ApiError(HTTP_STATUSCODE.DUPLICATE_RECORD, "User already exists");
    }

    throw error;
};

export const AuthLoginService = async (payload: LoginPayload) => {
    const parsed = AdminLoginSchema.safeParse(payload);
    if (!parsed.success) throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, parsed.error.message);

    const { password } = parsed.data;
    const email = normalizeEmail(parsed.data.email);

    const user = await userModel.findOne({ email });
    if (!user) {
        throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, 'Invalid email Address');
    }

    if (!user.is_active || user.is_deleted) throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, 'User is deleted or inactive');

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, 'Wrong password!');
    }

    user.last_login = new Date();
    await user.save();

    const access_token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
        expiresIn: '7d',
    });

    return {
        access_token,
        user
    };
}

export const UserRegisterService = async (payload: RegisterPayload) => {
    const parsed = AdminRegisterSchema.safeParse(payload);
    if (!parsed.success) throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, parsed.error.message);

    const { name, password, role } = parsed.data;
    const email = normalizeEmail(parsed.data.email);
    const phone = normalizeAndValidatePhone(parsed.data.phone);

    await ensureNoDuplicateContact(email, phone);
    const { emailOtp, phoneOtp } = await ensureVerifiedRegistrationContacts(email, phone);

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
            role,
            phone,
            is_email_verified: true,
            is_phone_verified: true,
        });

        await otpVerificationModel.updateMany({
            _id: { $in: [emailOtp._id, phoneOtp._id] },
        }, {
            $set: { consumed_at: new Date() },
        });

        return user;
    } catch (error: unknown) {
        return handleDuplicateKeyError(error);
    }
}

export const RequestRegistrationOtpService = async (payload: RegistrationOtpRequestPayload) => {
    const parsed = RegistrationOtpRequestSchema.safeParse(payload);
    if (!parsed.success) throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, parsed.error.message);

    const email = normalizeEmail(parsed.data.email);
    const phone = normalizeAndValidatePhone(parsed.data.phone);

    await ensureNoDuplicateContact(email, phone);

    const emailOtp = generateOtp();
    const phoneOtp = generateOtp();

    await Promise.all([
        saveOtp(email, "EMAIL", emailOtp),
        saveOtp(phone, "PHONE", phoneOtp),
    ]);

    await Promise.all([
        sendEmailOtp(email, emailOtp),
        sendSmsOtp(phone, phoneOtp),
    ]);

    return {
        email,
        phone,
        expires_in_minutes: getOtpExpiryMinutes(),
    };
}

export const VerifyRegistrationOtpService = async (payload: VerifyRegistrationOtpPayload) => {
    const parsed = VerifyRegistrationOtpSchema.safeParse(payload);
    if (!parsed.success) throw new ApiError(HTTP_STATUSCODE.BAD_REQUEST, parsed.error.message);

    const email = normalizeEmail(parsed.data.email);
    const phone = normalizeAndValidatePhone(parsed.data.phone);

    await ensureNoDuplicateContact(email, phone);

    await Promise.all([
        verifyOtp(email, "EMAIL", parsed.data.email_otp),
        verifyOtp(phone, "PHONE", parsed.data.phone_otp),
    ]);

    return {
        email_verified: true,
        phone_verified: true,
    };
}

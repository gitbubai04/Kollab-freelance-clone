import mongoose, { Schema } from "mongoose";
import { IOtpVerification, OTP_CHANNEL, OTP_PURPOSE } from "../interface/otp.interface";

const otpVerificationSchema = new Schema<IOtpVerification>(
    {
        identifier: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        channel: {
            type: String,
            enum: OTP_CHANNEL,
            required: true,
        },
        purpose: {
            type: String,
            enum: OTP_PURPOSE,
            required: true,
            default: "REGISTER",
        },
        otp_hash: {
            type: String,
            required: true,
        },
        attempts: {
            type: Number,
            default: 0,
        },
        expires_at: {
            type: Date,
            required: true,
        },
        verified_at: {
            type: Date,
            default: null,
        },
        consumed_at: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true },
);

otpVerificationSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });
otpVerificationSchema.index({ identifier: 1, channel: 1, purpose: 1, consumed_at: 1 });

export default mongoose.model<IOtpVerification>("OtpVerification", otpVerificationSchema);

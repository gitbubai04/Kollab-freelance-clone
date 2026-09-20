import { Document } from "mongoose";

export const OTP_CHANNEL = ["EMAIL", "PHONE"] as const;
export const OTP_PURPOSE = ["REGISTER"] as const;

export type OtpChannel = (typeof OTP_CHANNEL)[number];
export type OtpPurpose = (typeof OTP_PURPOSE)[number];

export interface IOtpVerification extends Document {
    identifier: string;
    channel: OtpChannel;
    purpose: OtpPurpose;
    otp_hash: string;
    attempts: number;
    expires_at: Date;
    verified_at?: Date | null;
    consumed_at?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

import { Document } from "mongoose";
import { Role } from "../constant/enum";

export interface IUser extends Document {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
    last_login: Date;
    is_active: boolean;
    is_phone_verified: boolean;
    is_email_verified: boolean;
    is_deleted: boolean;
    is_profile_completed: boolean;
}

export type LoginPayload = {
    email: string;
    password: string;
};

export type RegisterPayload = {
    email: string;
    password: string;
    name: string;
    phone: string;
    role?: Role;
};

export type RegistrationOtpRequestPayload = {
    email: string;
    phone: string;
};

export type VerifyRegistrationOtpPayload = RegistrationOtpRequestPayload & {
    email_otp: string;
    phone_otp: string;
};

import { z } from "zod";
import { ROLE } from "../constant/enum";

const phoneSchema = z
    .string()
    .trim()
    .min(7, "Phone must be at least 7 characters")
    .max(20, "Phone must be under 20 characters")
    .regex(/^\+?[0-9\s()-]+$/, "Invalid phone number");

const otpSchema = z.string().trim().regex(/^\d{6}$/, "OTP must be exactly 6 digits");

export const AdminLoginSchema = z.object({
    email: z.string().trim().min(1, "Email is required").email("Invalid email address"),
    password: z.string().trim().min(1, "Password is required"),
});

export const AdminRegisterSchema = AdminLoginSchema.extend({
    name: z.string().trim().min(1, "Name is required").max(100, "Name must be under 100 characters"),
    phone: phoneSchema,
    role: z.enum(ROLE).default("ADMIN"),
});

export const RegistrationOtpRequestSchema = z.object({
    email: z.string().trim().min(1, "Email is required").email("Invalid email address"),
    phone: phoneSchema,
});

export const VerifyRegistrationOtpSchema = RegistrationOtpRequestSchema.extend({
    email_otp: otpSchema,
    phone_otp: otpSchema,
});

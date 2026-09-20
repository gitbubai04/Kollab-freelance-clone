import { z } from "zod";
import { ROLE } from "../../constant/enum";
import { registry } from "../registry";
import { errorResponse, registerSuccessResponse } from "../common";
import {
    AdminLoginSchema,
    AdminRegisterSchema,
    RegistrationOtpRequestSchema,
    VerifyRegistrationOtpSchema,
} from "../../validators/admin.validator";

const TAG = "Auth";

// Named schemas: each shows up under its own name in the Swagger "Schemas"
// section, and as a named type (components["schemas"][Name]) in the
// frontend's generated types — see `@/types/index` for the re-exports.
const SignInRequest = registry.register("SignInRequest", AdminLoginSchema);
const RegisterRequest = registry.register("RegisterRequest", AdminRegisterSchema);
const RegistrationOtpRequest = registry.register("RegistrationOtpRequest", RegistrationOtpRequestSchema);
const VerifyRegistrationOtpRequest = registry.register("VerifyRegistrationOtpRequest", VerifyRegistrationOtpSchema);

const RegistrationOtpResponse = z.object({
    email: z.string().email().openapi({ example: "john@example.com" }),
    phone: z.string().openapi({ example: "+919999999999" }),
    expires_in_minutes: z.number().openapi({ example: 10 }),
});

const VerifyRegistrationOtpResponse = z.object({
    email_verified: z.boolean().openapi({ example: true }),
    phone_verified: z.boolean().openapi({ example: true }),
});

const RegisteredUserResponse = z.object({
    id: z.string().openapi({ example: "66a9f0e67d0f0b21f5e9c123" }),
    name: z.string().openapi({ example: "John Doe" }),
    email: z.string().email().openapi({ example: "john@example.com" }),
    phone: z.string().openapi({ example: "+919999999999" }),
    role: z.enum(ROLE).openapi({ example: "CLIENT" }),
    is_email_verified: z.boolean().openapi({ example: true }),
    is_phone_verified: z.boolean().openapi({ example: true }),
});

registry.registerPath({
    method: "post",
    path: "/api/v1/admin/auth/send-registration-otp",
    tags: [TAG],
    summary: "Send 6-digit email and phone OTPs before registration",
    request: {
        body: {
            content: {
                "application/json": { schema: RegistrationOtpRequest },
            },
        },
    },
    responses: {
        200: registerSuccessResponse(
            "RegistrationOtpResponse",
            RegistrationOtpResponse,
            "Registration OTPs sent successfully",
        ),
        400: errorResponse("Invalid email or phone"),
        409: errorResponse("Email or phone already exists"),
    },
});

registry.registerPath({
    method: "post",
    path: "/api/v1/admin/auth/verify-registration-otp",
    tags: [TAG],
    summary: "Verify registration email and phone OTPs",
    request: {
        body: {
            content: {
                "application/json": { schema: VerifyRegistrationOtpRequest },
            },
        },
    },
    responses: {
        200: registerSuccessResponse(
            "VerifyRegistrationOtpResponse",
            VerifyRegistrationOtpResponse,
            "Registration OTPs verified successfully",
        ),
        400: errorResponse("OTP is invalid, expired, or missing"),
        409: errorResponse("Email or phone already exists"),
        429: errorResponse("OTP attempt limit exceeded"),
    },
});

registry.registerPath({
    method: "post",
    path: "/api/v1/admin/auth/register",
    tags: [TAG],
    summary: "Register after email and phone OTP verification",
    request: {
        body: {
            content: {
                "application/json": { schema: RegisterRequest },
            },
        },
    },
    responses: {
        201: registerSuccessResponse(
            "RegisterResponse",
            RegisteredUserResponse,
            "User registered successfully",
        ),
        400: errorResponse("Invalid input, or email/phone OTP has not been verified"),
        409: errorResponse("Email or phone already exists"),
    },
});

registry.registerPath({
    method: "post",
    path: "/api/v1/admin/auth/signin",
    tags: [TAG],
    summary: "Sign in with email and password",
    request: {
        body: {
            content: {
                "application/json": { schema: SignInRequest },
            },
        },
    },
    responses: {
        200: registerSuccessResponse(
            "SignInResponse",
            z.object({
                access_token: z.string().openapi({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }),
                role: z.string().openapi({ example: "admin" }),
            }),
            "Signed in successfully; returns a JWT access token to send as 'Authorization: Bearer <access_token>'",
        ),
        400: errorResponse("Invalid credentials, or the account is inactive/deleted"),
    },
});

registry.registerPath({
    method: "post",
    path: "/api/v1/admin/auth/logout",
    tags: [TAG],
    summary: "Log out",
    responses: {
        200: registerSuccessResponse("LogoutResponse", z.object({}), "Logged out successfully"),
        500: errorResponse("Unexpected server error"),
    },
});

import { z } from "zod";

import { registry } from "../registry";
import { errorResponse, registerSuccessResponse } from "../common";

const TAG = "Client Profile";

/**
 * Request schema
 *
 * These are the fields the client is allowed to submit.
 * user_id, verification fields, marketplace counters, etc.
 * are controlled by the backend.
 */
const CompleteClientProfileRequest = z.object({
    full_name: z
        .string()
        .min(2)
        .max(100)
        .openapi({
            example: "John Doe",
        }),

    profile_image: z
        .string()
        .url()
        .optional()
        .openapi({
            example: "https://example.com/profile.jpg",
        }),

    bio: z
        .string()
        .max(1000)
        .optional()
        .openapi({
            example: "Founder looking for talented developers.",
        }),

    company_name: z
        .string()
        .max(150)
        .optional()
        .openapi({
            example: "Acme Technologies",
        }),

    company_logo: z
        .string()
        .url()
        .optional()
        .openapi({
            example: "https://example.com/company-logo.png",
        }),

    professional_title: z
        .string()
        .max(150)
        .optional()
        .openapi({
            example: "Founder & CEO",
        }),

    company_description: z
        .string()
        .max(2000)
        .optional()
        .openapi({
            example: "We build modern SaaS products for businesses.",
        }),

    company_website: z
        .string()
        .url()
        .optional()
        .openapi({
            example: "https://acme.com",
        }),

    company_size: z
        .string()
        .optional()
        .openapi({
            example: "11-50",
        }),

    industry: z
        .string()
        .optional()
        .openapi({
            example: "Technology",
        }),

    phone: z
        .string()
        .optional()
        .openapi({
            example: "+919999999999",
        }),

    address: z
        .string()
        .max(300)
        .optional()
        .openapi({
            example: "123 Main Street",
        }),

    city: z
        .string()
        .max(100)
        .optional()
        .openapi({
            example: "Kolkata",
        }),

    state: z
        .string()
        .max(100)
        .optional()
        .openapi({
            example: "West Bengal",
        }),

    country: z
        .string()
        .max(100)
        .optional()
        .openapi({
            example: "India",
        }),

    timezone: z
        .string()
        .optional()
        .openapi({
            example: "Asia/Kolkata",
        }),
});

const CompleteClientProfileRequestSchema = registry.register(
    "CompleteClientProfileRequest",
    CompleteClientProfileRequest,
);

/**
 * Response schema
 */
const ClientProfileResponse = z.object({
    id: z
        .string()
        .openapi({
            example: "66a9f0e67d0f0b21f5e9c123",
        }),

    user_id: z
        .string()
        .openapi({
            example: "66a9f0e67d0f0b21f5e9c456",
        }),

    full_name: z
        .string()
        .openapi({
            example: "John Doe",
        }),

    profile_image: z
        .string()
        .nullable()
        .optional()
        .openapi({
            example: "https://example.com/profile.jpg",
        }),

    bio: z
        .string()
        .nullable()
        .optional()
        .openapi({
            example: "Founder looking for talented developers.",
        }),

    company_name: z
        .string()
        .nullable()
        .optional()
        .openapi({
            example: "Acme Technologies",
        }),

    company_logo: z
        .string()
        .nullable()
        .optional()
        .openapi({
            example: "https://example.com/company-logo.png",
        }),

    professional_title: z
        .string()
        .nullable()
        .optional()
        .openapi({
            example: "Founder & CEO",
        }),

    company_description: z
        .string()
        .nullable()
        .optional()
        .openapi({
            example: "We build modern SaaS products.",
        }),

    company_website: z
        .string()
        .nullable()
        .optional()
        .openapi({
            example: "https://acme.com",
        }),

    company_size: z
        .string()
        .nullable()
        .optional()
        .openapi({
            example: "11-50",
        }),

    industry: z
        .string()
        .nullable()
        .optional()
        .openapi({
            example: "Technology",
        }),

    phone: z
        .string()
        .nullable()
        .optional()
        .openapi({
            example: "+919999999999",
        }),

    address: z
        .string()
        .nullable()
        .optional()
        .openapi({
            example: "123 Main Street",
        }),

    city: z
        .string()
        .nullable()
        .optional()
        .openapi({
            example: "Kolkata",
        }),

    state: z
        .string()
        .nullable()
        .optional()
        .openapi({
            example: "West Bengal",
        }),

    country: z
        .string()
        .nullable()
        .optional()
        .openapi({
            example: "India",
        }),

    timezone: z
        .string()
        .nullable()
        .optional()
        .openapi({
            example: "Asia/Kolkata",
        }),

    total_jobs_posted: z
        .number()
        .openapi({
            example: 0,
        }),

    total_jobs_hired: z
        .number()
        .openapi({
            example: 0,
        }),

    total_spent: z
        .number()
        .openapi({
            example: 0,
        }),

    is_identity_verified: z
        .boolean()
        .openapi({
            example: false,
        }),

    is_payment_verified: z
        .boolean()
        .openapi({
            example: false,
        }),

    isDeleted: z
        .boolean()
        .openapi({
            example: false,
        }),

    deletedAt: z
        .string()
        .datetime()
        .nullable()
        .openapi({
            example: null,
        }),

    createdAt: z
        .string()
        .datetime()
        .openapi({
            example: "2026-09-20T10:00:00.000Z",
        }),

    updatedAt: z
        .string()
        .datetime()
        .openapi({
            example: "2026-09-20T10:00:00.000Z",
        }),
});

const CompleteClientProfileResponse = registry.register(
    "CompleteClientProfileResponse",
    ClientProfileResponse,
);

registry.registerPath({
    method: "post",

    path: "/api/v1/client/profile/complete",

    tags: [TAG],

    summary: "Complete client profile",

    description:
        "Completes the authenticated client's profile. The user ID is taken from the authenticated JWT and must not be provided in the request body.",

    security: [
        {
            bearerAuth: [],
        },
    ],

    request: {
        body: {
            content: {
                "application/json": {
                    schema: CompleteClientProfileRequestSchema,
                },
            },
        },
    },

    responses: {
        200: registerSuccessResponse(
            "CompleteClientProfileResponse",
            CompleteClientProfileResponse,
            "Client profile completed successfully",
        ),

        400: errorResponse(
            "Invalid client profile data",
        ),

        401: errorResponse(
            "Authentication required or token is invalid",
        ),

        404: errorResponse(
            "Client profile not found",
        ),

        500: errorResponse(
            "Unexpected server error",
        ),
    },
});

import { z } from "zod";

export const createClientProfileSchema = z.object({
    full_name: z
        .string()
        .trim()
        .min(2)
        .max(100),

    profile_image: z
        .string()
        .url()
        .optional(),

    bio: z
        .string()
        .trim()
        .max(1000)
        .optional(),

    company_name: z
        .string()
        .trim()
        .max(150)
        .optional(),

    company_logo: z
        .string()
        .url()
        .optional(),

    professional_title: z
        .string()
        .trim()
        .max(150)
        .optional(),

    company_description: z
        .string()
        .trim()
        .max(2000)
        .optional(),

    company_website: z
        .string()
        .url()
        .optional(),

    company_size: z
        .string()
        .trim()
        .optional(),

    industry: z
        .string()
        .trim()
        .optional(),

    phone: z
        .string()
        .trim()
        .optional(),

    address: z
        .string()
        .trim()
        .max(300)
        .optional(),

    city: z
        .string()
        .trim()
        .max(100)
        .optional(),

    state: z
        .string()
        .trim()
        .max(100)
        .optional(),

    country: z
        .string()
        .trim()
        .max(100)
        .optional(),

    timezone: z
        .string()
        .trim()
        .optional(),
});

export type TCreateClientProfileInput =
    z.infer<typeof createClientProfileSchema>;
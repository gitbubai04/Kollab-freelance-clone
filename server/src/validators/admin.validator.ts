import { z } from "zod";

export const AdminLoginSchema = z.object({
    email: z.string().trim().min(1, "Email is required").email("Invalid email address"),
    password: z.string().trim().min(1, "Password is required"),
});
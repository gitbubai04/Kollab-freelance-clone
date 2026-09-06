import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().min(1, "Work email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
export type SignInValues = z.infer<typeof signInSchema>;

export const signUpSchema = z
  .object({
    joinAs: z.enum(["client", "freelancer"]),
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().min(1, "Work email is required").email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[0-9!@#$%^&*]/, "Must contain a number or symbol"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    agreeToTerms: z.boolean().refine((v) => v, "You must agree to the terms to continue"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type SignUpValues = z.infer<typeof signUpSchema>;

export const completeAccountSchema = z.object({
  role: z.enum(["client", "freelancer"]),
  company: z.string().min(1, "Company or organization is required"),
  timezone: z.string().min(1, "Please select a timezone"),
});
export type CompleteAccountValues = z.infer<typeof completeAccountSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Work email is required").email("Enter a valid email address"),
});
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const otpSchema = z.object({
  code: z.string().length(6, "Enter the full 6-digit code"),
});
export type OtpValues = z.infer<typeof otpSchema>;

export const postProjectSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
  description: z.string().min(20, "Please provide a more detailed description"),
  paymentStructure: z.enum(["fixed", "hourly"]),
  budget: z.coerce.number().positive("Budget must be greater than 0"),
  deadline: z.string().min(1, "Deadline is required"),
  expertiseLevel: z.enum(["junior", "intermediate", "expert"]),
});
export type PostProjectValues = z.infer<typeof postProjectSchema>;

export const submitProposalSchema = z.object({
  bidAmount: z.coerce.number().positive("Bid amount must be greater than 0"),
  deliveryDays: z.coerce.number().int().positive("Delivery time must be greater than 0"),
  coverLetter: z.string().min(50, "Cover letter should be at least 50 characters"),
});
export type SubmitProposalValues = z.infer<typeof submitProposalSchema>;

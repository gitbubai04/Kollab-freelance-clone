import mongoose, { Document } from "mongoose";

export interface IClientProfile extends Document {
    user_id: mongoose.Types.ObjectId;

    // Personal information
    full_name: string;
    profile_image?: string;
    bio?: string;

    // Company information
    company_name?: string;
    company_logo?: string;
    professional_title?: string;
    company_description?: string;
    company_website?: string;
    company_size?: string;
    industry?: string;

    // Contact information
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    timezone?: string;

    // Marketplace information
    total_jobs_posted: number;
    total_jobs_hired: number;
    total_spent: number;

    // Client verification
    is_identity_verified: boolean;
    is_payment_verified: boolean;

    // Account state
    isDeleted: boolean;
    deletedAt?: Date;

    createdAt: Date;
    updatedAt: Date;
}
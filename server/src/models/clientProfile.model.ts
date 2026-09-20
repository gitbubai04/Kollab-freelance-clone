import mongoose, { Schema } from "mongoose";
import { IClientProfile } from "../interface/clientProfile.interface";

const clientProfileSchema = new Schema<IClientProfile>(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
            index: true,
        },

        // Personal information
        full_name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100,
        },

        profile_image: {
            type: String,
            trim: true,
        },

        bio: {
            type: String,
            trim: true,
            maxlength: 1000,
        },

        // Company information
        company_name: {
            type: String,
            trim: true,
            maxlength: 150,
        },

        company_logo: {
            type: String,
            trim: true,
        },

        professional_title: {
            type: String,
            trim: true,
            maxlength: 150,
        },

        company_description: {
            type: String,
            trim: true,
            maxlength: 2000,
        },

        company_website: {
            type: String,
            trim: true,
        },

        company_size: {
            type: String,
            trim: true,
        },

        industry: {
            type: String,
            trim: true,
        },

        // Contact information
        phone: {
            type: String,
            trim: true,
        },

        address: {
            type: String,
            trim: true,
            maxlength: 300,
        },

        city: {
            type: String,
            trim: true,
            maxlength: 100,
        },

        state: {
            type: String,
            trim: true,
            maxlength: 100,
        },

        country: {
            type: String,
            trim: true,
            maxlength: 100,
        },

        timezone: {
            type: String,
            trim: true,
        },

        // Marketplace information
        total_jobs_posted: {
            type: Number,
            default: 0,
            min: 0,
        },

        total_jobs_hired: {
            type: Number,
            default: 0,
            min: 0,
        },

        total_spent: {
            type: Number,
            default: 0,
            min: 0,
        },

        // Verification
        is_identity_verified: {
            type: Boolean,
            default: false,
        },

        is_payment_verified: {
            type: Boolean,
            default: false,
        },

        // Account state
        isDeleted: {
            type: Boolean,
            default: false,
            index: true,
        },

        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export const ClientProfile = mongoose.model<IClientProfile>(
    "ClientProfile",
    clientProfileSchema
);
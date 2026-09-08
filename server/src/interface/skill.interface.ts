import { Document } from "mongoose";

export interface ISkill extends Document {
    name: string;
    createdAt: Date;
    updatedAt: Date;
    isDeleted?: boolean; // Optional field to indicate if the skill is deleted
    deletedAt?: Date; // Optional field to store the deletion timestamp
}

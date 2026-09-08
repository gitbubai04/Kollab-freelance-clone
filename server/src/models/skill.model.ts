import mongoose, { Schema } from 'mongoose';
import { ISkill } from '../interface/skill.interface';

const skillSchema = new Schema<ISkill>({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
        default: null,
    }
});

export default mongoose.model<ISkill>('Skill', skillSchema);

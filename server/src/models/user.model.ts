import mongoose, { Schema } from 'mongoose';
import { IUser } from '../interface/user.interface';
import { ROLE } from '../constant/enum';

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    is_phone_verified: {
        type: Boolean,
        default: false
    },
    is_email_verified: {
        type: Boolean,
        default: false
    },
    is_profile_completed: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'ADMIN',
        enum: ROLE,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    last_login: {
        type: Date
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    is_active: {
        type: Boolean,
        default: true
    }
});

export default mongoose.model<IUser>('User', userSchema);

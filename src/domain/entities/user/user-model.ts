import mongoose, { Schema } from "mongoose";
import { User } from "./user";

const schema = new Schema<User>({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    updatedAt: {
        type: Date,
        required: true,
    },
    deletedAt: {
        type: Date,
        required: false,
    },
},);

export const UserModel = mongoose.model<User>("User", schema);
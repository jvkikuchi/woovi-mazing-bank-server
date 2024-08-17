import mongoose, { model, Schema } from "mongoose";
import { Account } from "./account";

const schema = new Schema<Account>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    number: {
        type: String,
        required: true,
        unique: true,
    },
    ledger: [{
        value: Number,
        createdAt: String,
        default: []
    }],
    createdAt: {
        type: String,
        required: true,
    },
    updatedAt: {
        type: String,
        required: true,
    },
    deletedAt: {
        type: String,
        required: false,
    },
});

export const AccountModel = mongoose.model<Account>("Account", schema)
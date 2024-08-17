import mongoose, { Schema } from "mongoose";
import { Transaction } from "./transaction";

export const transactionSchema = new Schema<Transaction>({
    receiverAccountNumber: {
        type: String,
        required: true,
    },
    senderAccountNumber: {
        type: String,
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: String,
        required: true,
    },
});

export const TransactionModel = mongoose.model<Transaction>("Transaction", transactionSchema)
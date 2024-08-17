import { AccountModel } from "../entities/account/account-model";
import { Transaction } from "../entities/transaction/transaction";
import { TransactionModel } from "../entities/transaction/transaction-model";
import { AccountService } from "./account.service";
import mongoose from "mongoose";

export const newTransaction = async (newTransactionInfo: {
    receiverAccountNumber: string;
    senderAccountNumber: string;
    value: number;
}): Promise<Transaction> => {
    const { receiverAccountNumber, senderAccountNumber, value } = newTransactionInfo;

    const isSameReceiverAndSender = receiverAccountNumber === senderAccountNumber;

    if (isSameReceiverAndSender) {
        throw new Error(`You cannot create a transaction to your own account`);
    }

    const accountToSendTo = await AccountService.findByNumber(receiverAccountNumber);
    const accountToSendFrom = await AccountService.findByNumber(senderAccountNumber);

    if (!accountToSendTo || !accountToSendFrom) {
        throw new Error(`One of the accounts not found`);
    }

    // Check for duplicate transactions within the last 2 minutes
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    const existingTransaction = await TransactionModel.findOne({
        senderAccountNumber: accountToSendFrom.number,
        receiverAccountNumber: accountToSendTo.number,
        value,
        createdAt: { $gte: twoMinutesAgo.toISOString() },
    });

    if (existingTransaction) {
        throw new Error(`Identical transaction to account ${receiverAccountNumber} identified, please wait 2 minutes before trying again.`);
    }

    const transaction = new TransactionModel({
        senderAccountNumber: accountToSendFrom.number,
        receiverAccountNumber: accountToSendTo.number,
        value,
        createdAt: new Date().toISOString(),
    });

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        await AccountModel.updateOne(
            { _id: accountToSendFrom._id },
            { $push: { ledger: { value: -value, createdAt: transaction.createdAt } } },
            { session }
        );

        await AccountModel.updateOne(
            { _id: accountToSendTo._id },
            { $push: { ledger: { value: value, createdAt: transaction.createdAt } } },
            { session }
        );

        await transaction.save({ session });

        await session.commitTransaction();
        session.endSession();

        return transaction;
    } catch (error) {
        console.log('Transaction failed');
        console.log(error);

        await session.abortTransaction();
        session.endSession();
        throw new Error('Internal Server Error');
    }
};

export const TransactionService = { newTransaction };

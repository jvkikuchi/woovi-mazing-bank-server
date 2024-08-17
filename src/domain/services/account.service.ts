import { Account } from "../entities/account/account";
import { AccountModel } from "../entities/account/account-model";
import { TransactionModel } from "../entities/transaction/transaction-model";

export const create = async (account: Account): Promise<void> => {
    await AccountModel.create(account);
};

export const findByNumber = async (accountNumber: string): Promise<Account | null> => {
    const account = await AccountModel.findOne({ number: accountNumber });

    if (!account) {
        return null;
    }

    return account;
};

export const findById = async (accountId: string): Promise<Account | null> => {
    console.log('Finding account: ', accountId);

    const account = await AccountModel.findById(accountId);

    if (!account) {
        return null;
    }

    return account;
};


export const getAccountWithTransactions = async (accountNumber: string) => {
    const account = await AccountModel.findOne({ number: accountNumber });
    const transactions = await TransactionModel.find({ $or: [{ senderAccountNumber: accountNumber }, { receiverAccountNumber: accountNumber }] });

    if (!account) {
        return null;
    }

    return { ...account.toJSON(), transactions };
};


export const AccountService = {
    create,
    findById,
    getAccountWithTransactions,
    findByNumber,
};
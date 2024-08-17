import { TransactionService } from '../../domain/services/transaction.service';
import { AccountService } from '../../domain/services/account.service';
import { TransactionModel } from '../../domain/entities/transaction/transaction-model';
import { AccountModel } from '../../domain/entities/account/account-model';
import mongoose from 'mongoose';

jest.mock('../../domain/services/account.service');
jest.mock('../../domain/entities/transaction/transaction-model');
jest.mock('../../domain/entities/account/account-model');
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  
  return {
    ...actualMongoose,
    Types: {
      ObjectId: actualMongoose.Types.ObjectId,
    },
    startSession: jest.fn().mockReturnValue({
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    }),
  };
});

describe('TransactionService.newTransaction', () => {
  const sessionMock = mongoose.startSession();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if the sender and receiver account numbers are the same', async () => {
    await expect(TransactionService.newTransaction({
      senderAccountNumber: '123',
      receiverAccountNumber: '123',
      value: 100,
    })).rejects.toThrow('You cannot create a transaction to your own account');
  });

  it('should throw an error if one of the accounts is not found', async () => {
    (AccountService.findByNumber as jest.Mock).mockResolvedValueOnce(null);
    (AccountService.findByNumber as jest.Mock).mockResolvedValueOnce({
      number: '456',
    });

    await expect(TransactionService.newTransaction({
      senderAccountNumber: '123',
      receiverAccountNumber: '456',
      value: 100,
    })).rejects.toThrow('One of the accounts not found');
  });

  it('should throw an error if a duplicate transaction is found within 2 minutes', async () => {
    (AccountService.findByNumber as jest.Mock).mockResolvedValueOnce({
      number: '123',
    });
    (AccountService.findByNumber as jest.Mock).mockResolvedValueOnce({
      number: '456',
    });

    (TransactionModel.findOne as jest.Mock).mockResolvedValueOnce({
      senderAccountNumber: '123',
      receiverAccountNumber: '456',
      value: 100,
      createdAt: new Date().toISOString(),
    });

    await expect(TransactionService.newTransaction({
      senderAccountNumber: '123',
      receiverAccountNumber: '456',
      value: 100,
    })).rejects.toThrow('Identical transaction to account 456 identified, please wait 2 minutes before trying again.');
  });

  it('should successfully create a new transaction', async () => {
    (AccountService.findByNumber as jest.Mock).mockResolvedValueOnce({
      _id: 'sender-id',
      number: '123',
    });
    (AccountService.findByNumber as jest.Mock).mockResolvedValueOnce({
      _id: 'receiver-id',
      number: '456',
    });

    (TransactionModel.findOne as jest.Mock).mockResolvedValueOnce(null);
    (TransactionModel.prototype.save as jest.Mock).mockResolvedValueOnce({});

    await TransactionService.newTransaction({
      senderAccountNumber: '123',
      receiverAccountNumber: '456',
      value: 100,
    });

    expect(AccountModel.updateOne).toHaveBeenCalledTimes(2);
    expect(TransactionModel.prototype.save).toHaveBeenCalled();
    expect((await sessionMock).commitTransaction).toHaveBeenCalled();
    expect((await sessionMock).endSession).toHaveBeenCalled();
  });

});

import { transactionMutations } from '../../domain/entities/transaction/transaction.mutations';
import { TransactionService } from '../../domain/services/transaction.service';
import { handleAuth } from '../../../src/handle-auth';
import { Context } from 'koa';

jest.mock('../../domain/services/transaction.service');
jest.mock('../../../src/handle-auth');

describe('Transaction Mutations', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('newTransaction mutation', () => {
      const mockContext: Context = {
        state: {
          user: {
            accountNumber: '12345678',
          },
        },
      } as any;
  
      it('should throw an error if user is not authenticated', async () => {
        (handleAuth as jest.Mock).mockRejectedValue(new Error('Authentication failed'));
  
        const args = {
          senderAccountNumber: '12345678',
          receiverAccountNumber: '87654321',
          value: 100,
        };
  
        await expect(transactionMutations.newTransaction.resolve({}, args, mockContext))
          .rejects.toThrow('Authentication failed');
  
        expect(handleAuth).toHaveBeenCalledWith(mockContext);
        expect(TransactionService.newTransaction).not.toHaveBeenCalled();
      });
  
      it('should throw an error if sender account number does not match user account number', async () => {
        (handleAuth as jest.Mock).mockResolvedValueOnce(undefined); // Mock successful authentication
  
        const args = {
          senderAccountNumber: 'wrongAccountNumber',
          receiverAccountNumber: '87654321',
          value: 100,
        };
  
        await expect(transactionMutations.newTransaction.resolve({}, args, mockContext))
          .rejects.toThrow('You are not allowed to send from this account');
  
        expect(handleAuth).toHaveBeenCalledWith(mockContext);
        expect(TransactionService.newTransaction).not.toHaveBeenCalled();
      });
  
      it('should call TransactionService.newTransaction and return the transaction if successful', async () => {
        (handleAuth as jest.Mock).mockResolvedValueOnce(undefined); // Mock successful authentication
        const mockTransaction = {
          senderAccountNumber: '12345678',
          receiverAccountNumber: '87654321',
          value: 100,
        };
  
        (TransactionService.newTransaction as jest.Mock).mockResolvedValueOnce(mockTransaction);
  
        const args = {
          senderAccountNumber: '12345678',
          receiverAccountNumber: '87654321',
          value: 100,
        };
  
        const result = await transactionMutations.newTransaction.resolve({}, args, mockContext);
  
        expect(handleAuth).toHaveBeenCalledWith(mockContext);
        expect(TransactionService.newTransaction).toHaveBeenCalledWith({
          senderAccountNumber: '12345678',
          receiverAccountNumber: '87654321',
          value: 100,
        });
        expect(result).toEqual(mockTransaction);
      });
  
      it('should throw an error if TransactionService.newTransaction fails', async () => {
        (handleAuth as jest.Mock).mockResolvedValueOnce(undefined); // Mock successful authentication
  
        (TransactionService.newTransaction as jest.Mock).mockRejectedValueOnce(new Error('Transaction failed'));
  
        const args = {
          senderAccountNumber: '12345678',
          receiverAccountNumber: '87654321',
          value: 100,
        };
  
        await expect(transactionMutations.newTransaction.resolve({}, args, mockContext))
          .rejects.toThrow('Transaction failed');
  
        expect(handleAuth).toHaveBeenCalledWith(mockContext);
        expect(TransactionService.newTransaction).toHaveBeenCalledWith({
          senderAccountNumber: '12345678',
          receiverAccountNumber: '87654321',
          value: 100,
        });
      });
    });
  });
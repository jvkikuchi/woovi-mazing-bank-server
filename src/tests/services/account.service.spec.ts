import { AccountService } from '../../domain/services/account.service';
import { AccountModel } from '../../domain/entities/account/account-model';
import { TransactionModel } from '../../domain/entities/transaction/transaction-model';
import { Account } from '../../domain/entities/account/account';

jest.mock('../../domain/entities/account/account-model');
jest.mock('../../domain/entities/transaction/transaction-model');

describe('AccountService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create an account successfully', async () => {
            const createSpy = jest.spyOn(AccountModel, 'create');

            const mockAccount: Account = {
                number: '12345',
                //@ts-expect-error 
                user: '123-123-123',
                ledger: [],
            };

            await AccountService.create(mockAccount);

            expect(createSpy).toHaveBeenCalledWith(mockAccount);
            expect(createSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('findByNumber', () => {
        it('should return an account when found by account number', async () => {
            const findOneSpy = jest.spyOn(AccountModel, 'findOne');

            const mockAccount = {
                number: '12345',
                user: 'user-id',
                ledger: [],
            };

            findOneSpy.mockResolvedValue(mockAccount);

            const result = await AccountService.findByNumber('12345');

            expect(findOneSpy).toHaveBeenCalledWith({ number: '12345' });
            expect(result).toEqual(mockAccount);
        });
    });

    describe('findById', () => {
        it('should return an account when found by account ID', async () => {
            const mockAccount = {
                _id: '4545',
                number: '12345',
                user: 'user-id',
                ledger: [],
            };

            (AccountModel.findById as jest.Mock).mockResolvedValue(mockAccount);

            const result = await AccountService.findById('4545');

            expect(AccountModel.findById).toHaveBeenCalledWith('4545');
            expect(result).toEqual(mockAccount);
        });

        it('should return null when account is not found by account ID', async () => {


            (AccountModel.findById as jest.Mock).mockResolvedValue(null);

            const result = await AccountService.findById('333322221111');

            expect(AccountModel.findById).toHaveBeenCalledWith('333322221111');
            expect(result).toBeNull();
        });
    });

    describe('getAccountWithTransactions', () => {
        it('should return an account with transactions', async () => {
            const mockAccount = {
                _id: 'account-id',
                number: '12345',
                user: 'user-id',
                ledger: [],
                toJSON: jest.fn().mockReturnValue({
                    _id: 'account-id',
                    number: '12345',
                    user: 'user-id',
                    ledger: [],
                }),
            };
            const mockTransactions = [
                { senderAccountNumber: '12345', receiverAccountNumber: '67890', value: 100 },
                { senderAccountNumber: '67890', receiverAccountNumber: '12345', value: 200 },
            ];

            (AccountModel.findOne as jest.Mock).mockResolvedValue(mockAccount);
            (TransactionModel.find as jest.Mock).mockResolvedValue(mockTransactions);

            const result = await AccountService.getAccountWithTransactions('12345');

            expect(AccountModel.findOne).toHaveBeenCalledWith({ number: '12345' });
            expect(TransactionModel.find).toHaveBeenCalledWith({
                $or: [
                    { senderAccountNumber: '12345' },
                    { receiverAccountNumber: '12345' },
                ],
            });
            expect(result).toEqual({ ...mockAccount.toJSON(), transactions: mockTransactions });
        });

        it('should return null if account is not found', async () => {
            const findOneSpy = jest.spyOn(AccountModel, 'findOne');

            findOneSpy.mockResolvedValue(null);
            const result = await AccountService.getAccountWithTransactions('99999');

            expect(AccountModel.findOne).toHaveBeenCalledWith({ number: '99999' });
            expect(result).toBeNull();
        });
    });
});

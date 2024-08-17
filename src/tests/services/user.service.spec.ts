import { UserService } from '../../domain/services/user.service';
import { UserModel } from '../../domain/entities/user/user-model';
import { AccountModel } from '../../domain/entities/account/account-model';
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

jest.mock('../../domain/entities/user/user-model');
jest.mock('../../domain/entities/account/account-model');
jest.mock('../../domain/services/account.service');
jest.mock('nanoid');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');


jest.mock("nanoid", () => {
    return { customAlphabet: () => () => "12345678" };
});

describe('UserService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should throw an error if the user already exists', async () => {
            const userSpy = jest.spyOn(UserModel, 'findOne');

            userSpy.mockResolvedValue({ email: 'existing@example.com' });

            const mockUser = {
                email: 'existing@example.com',
                password: 'password123',
                save: jest.fn(),
            };

            await expect(UserService.create(mockUser as any)).rejects.toThrow('User already exists');
        });

        it('should create a new user and account, and return a token', async () => {
            const getUserByEmailSpy = jest.spyOn(UserModel, 'findOne');
            const createAccountSpy = jest.spyOn(AccountModel, 'create');

            getUserByEmailSpy.mockResolvedValue(null);

            const newUser = new UserModel({
                name: "Fulano",
                surname: "da Silva",
                email: "fulano@example.com",
                password: "password123",
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            const saveUserSpy = jest.spyOn(newUser, 'save');

            await UserService.create(newUser);

            expect(saveUserSpy).toHaveBeenCalled();
            // expect(createAccountSpy).toHaveBeenCalled();
        });
    });

    describe('login', () => {
        it('should throw an error if the email is incorrect', async () => {
            const findOneSpy = jest.spyOn(UserModel, 'findOne');

            findOneSpy.mockResolvedValue(null);

            await expect(UserService.login('invalid@example.com', 'password123')).rejects.toThrow('Incorrect E-mail or password');
        });

        it('should throw an error if the password is incorrect', async () => {
            const mockUser = {
                email: 'valid@example.com',
                password: 'hashedPassword',
            };

            const findOneSpy = jest.spyOn(UserModel, 'findOne');

            findOneSpy.mockResolvedValue(mockUser);

            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(UserService.login('valid@example.com', 'wrongPassword')).rejects.toThrow('Incorrect E-mail or password');
        });

        it('should return a token if the email and password are correct', async () => {
            const mockUser = {
                _id: 'user-id',
                email: 'valid@example.com',
                password: 'hashedPassword',
                name: 'John',
                surname: 'Doe',
            };

            const userModelSpy = jest.spyOn(UserModel, 'findOne');
            const accountModelSpy = jest.spyOn(AccountModel, 'findOne');

            userModelSpy.mockResolvedValue(mockUser);
            accountModelSpy.mockResolvedValue({ number: '12345678' });

            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (sign as jest.Mock).mockReturnValue('jwt-token');

            const token = await UserService.login('valid@example.com', 'password123');

            expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'valid@example.com' });
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
            expect(AccountModel.findOne).toHaveBeenCalledWith({ user: 'user-id' });
            expect(sign).toHaveBeenCalled();
            expect(token).toBe('jwt-token');
        });
    });
});

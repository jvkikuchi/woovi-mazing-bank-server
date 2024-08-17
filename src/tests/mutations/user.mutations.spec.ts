import { userMutations } from '../../domain/entities/user/user.mutations';
import { UserService } from '../../domain/services/user.service';
import { UserModel } from '../../domain/entities/user/user-model';

jest.mock('../../domain/services/user.service');
jest.mock('../../domain/entities/user/user-model');

describe('User Mutations', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login mutation', () => {
    it('should return a token when login is successful', async () => {
      const mockToken = 'mockToken';
      const loginSpy = jest.spyOn(UserService, 'login').mockResolvedValue(mockToken);

      const args = { email: 'email.teste@email.com', password: 'senha123' };

      const result = await userMutations.login.resolve({}, args);

      expect(loginSpy).toHaveBeenCalledWith('email.teste@email.com', 'senha123');
      expect(result).toEqual({ token: mockToken });
    });

    it('should throw an error if login fails', async () => {
      jest.spyOn(UserService, 'login').mockRejectedValue(new Error('Login failed'));

      const args = { email: 'test@example.com', password: 'senhaerrada' };

      await expect(userMutations.login.resolve({}, args)).rejects.toThrow('Login failed');
    });
  });

  describe('createUser mutation', () => {
    it('should create a user and return a token', async () => {
      const mockToken = 'mockToken';
      const createSpy = jest.spyOn(UserService, 'create').mockResolvedValue(mockToken);

      const args = {
        name: 'John',
        surname: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      const result = await userMutations.createUser.resolve({}, args);

      expect(UserModel).toHaveBeenCalledWith({
        name: 'John',
        surname: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(createSpy).toHaveBeenCalled();
      expect(result).toEqual({ token: mockToken });
    });

    it('should throw an error if user creation fails', async () => {
      const createSpy = jest.spyOn(UserService, 'create').mockRejectedValue(new Error('User creation failed'));

      const args = {
        name: 'John',
        surname: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      await expect(userMutations.createUser.resolve({}, args)).rejects.toThrow('User creation failed');
    });
  });
});

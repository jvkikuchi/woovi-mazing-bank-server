import { customAlphabet } from "nanoid";
import { User } from "../entities/user/user";
import { UserModel } from "../entities/user/user-model";
import { AccountService } from "./account.service";
import { sign, } from 'jsonwebtoken'
import { AccountModel } from "../entities/account/account-model";
import { Account } from "../entities/account/account";
import { hash, compare } from "bcrypt";

const nanoid = customAlphabet('1234567890', 8);

const getUserToken = ({
  userId,
  accountNumber,
  name,
  surname,
}: {
  userId: string;
  accountNumber: string;
  name: string;
  surname: string;
}) => {
  const jwtKey = process.env.JWT_KEY;

  const jwtToken = sign({
    userId,
    accountNumber,
    name,
    surname,
  },
    jwtKey as string,
    {
      expiresIn: "1800000 ",
      algorithm: "HS256",
      issuer: "Woovi-Crud"
    }
  );

  return jwtToken;
}

export const create = async (user: User) => {
  const existingUser = await findByEmail(user.email);

  if (existingUser) {
    throw new Error("User already exists");
  }

  const randomAccountNumber = nanoid();

  const account = new AccountModel({
    user,
    number: randomAccountNumber,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  user.password = await hash(user.password, 10);
  await user.save();

  await AccountService.create(account);

  const loginToken = getUserToken({
    userId: user.id,
    accountNumber: account.number,
    name: user.name,
    surname: user.surname,
  });

  return loginToken;
}

export const findById = async (id: string) => {
  return await UserModel.findById(id);
}

export const login = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    console.log('User not found');

    throw new Error('Incorrect E-mail or password');
  }

  const isPasswordCorrect = await compare(password, user.password);

  if (!isPasswordCorrect) {
    console.log('Incorrect E-mail or password');

    throw new Error('Incorrect E-mail or password');
  }

  const account = await AccountModel.findOne({
    user: user._id,
  });

  return getUserToken({
    userId: user.id,
    accountNumber: account!.number,
    name: user.name,
    surname: user.surname,
  });
};

const findByEmail = async (email: string) => {
  return await UserModel.findOne({ email });
}

export const UserService = {
  create,
  findById,
  login
};
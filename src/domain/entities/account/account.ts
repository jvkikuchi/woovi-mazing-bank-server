import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { Transaction, TransactionType } from "../transaction/transaction";
import { Document } from "mongoose";
import { User } from "../user/user";


const LedgerType = new GraphQLObjectType({
  name: 'Ledger',
  fields: {
    value: { type: GraphQLInt },
    createdAt: { type: GraphQLString },
  },
});

export const AccountType = new GraphQLObjectType({
  name: 'Account',
  fields: {
    id: { type: GraphQLString, resolve: (account) => account._id },
    userId: { type: GraphQLString },
    number: { type: GraphQLString },
    balance: { type: GraphQLInt },
    ledger: { type: new GraphQLList(LedgerType) },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    deletedAt: { type: GraphQLString },
  },
});

export const AccountTypeWithTransactions = new GraphQLObjectType({
  name: 'AccountWithTransactions',
  fields: {
    id: { type: GraphQLString, resolve: (account) => account._id },
    userId: { type: GraphQLString },
    number: { type: GraphQLString },
    balance: { type: GraphQLInt },
    ledger: { type: new GraphQLList(LedgerType) },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    deletedAt: { type: GraphQLString },
    transactions: { type: new GraphQLList(TransactionType) },
  },
});

export interface Account extends Document {
  user: User;
  number: string;
  ledger: { value: number, createdAt: string }[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};
import { GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLSchema, GraphQLScalarType } from "graphql";
import { Document } from "mongoose";
import { Account, AccountType } from "../account/account";

export const TransactionType = new GraphQLObjectType({
    name: 'Transaction',
    fields: {
      id: { type: GraphQLString, resolve: (transaction) => transaction._id },
      senderAccountNumber: { type: GraphQLString, resolve: (transaction) => transaction.senderAccountNumber },
      receiverAccountNumber: { type: GraphQLString, resolve: (transaction) => transaction.receiverAccountNumber },
      value: { type: GraphQLFloat, resolve: (transaction) => transaction.value },
      createdAt: { type: GraphQLString, resolve: (transaction) => transaction.createdAt },
    }
  });

export interface Transaction  extends Document {
    senderAccountNumber: string;
    receiverAccountNumber: string;
    value: number;
    createdAt: string;
}
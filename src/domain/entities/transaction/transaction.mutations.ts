import { GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';
import { TransactionType, Transaction } from './transaction';
import { TransactionService } from '../../services/transaction.service';
import { Context } from 'koa';
import { handleAuth } from "../../../handle-auth";

export const transactionMutations = {
  newTransaction: {
    type: TransactionType,
    args: {
      senderAccountNumber: { type: GraphQLNonNull(GraphQLString) },
      receiverAccountNumber: { type: GraphQLNonNull(GraphQLString) },
      value: { type: GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (_, { senderAccountNumber, receiverAccountNumber, value }, context: Context) => {
      await handleAuth(context)

      const user = context.state.user;

      if (user.accountNumber !== senderAccountNumber) {
        throw new Error(`You are not allowed to send from this account`);
      }

      const transaction = await TransactionService.newTransaction({
        receiverAccountNumber,
        senderAccountNumber,
        value,
      });

      return transaction
    }
  }
};
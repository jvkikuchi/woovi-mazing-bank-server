import { GraphQLString } from "graphql";
import { AccountTypeWithTransactions } from "./account";
import { AccountService } from "../../services/account.service";
import { Context } from "koa";
import { handleAuth } from "../../../handle-auth";


export const accountQueries = {
  getAccount: {
    type: AccountTypeWithTransactions,
    args: {
      number: { type: GraphQLString },
    },
    resolve: async (_, { number }, context: Context) => {
      await handleAuth(context)

      const user = context.state.user;
  
      const account = await AccountService.getAccountWithTransactions(number);

      if(user.accountNumber !== account!.number) {
        throw new Error(`You are not allowed to access this account`);
      }

      return account
    }
  }
};
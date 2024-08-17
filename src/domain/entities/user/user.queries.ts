import { GraphQLString } from "graphql";
import { UserModel } from "./user-model";
import { GetUserType } from "./user";
import { Context } from "koa";
import { handleAuth } from "../../../handle-auth";

export const userQueries = {
  getUser: {
    type: GetUserType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: async (_, { id }, context: Context) => {
      await handleAuth(context)

      const user = await UserModel.findOne({
        id,
      }).exec();

      console.log('Found user: ', user);

      return user
    }
  }
};
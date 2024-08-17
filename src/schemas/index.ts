import { GraphQLObjectType } from 'graphql';
import { userQueries } from '../domain/entities/user/user.queries';
import { accountQueries } from '../domain/entities/account/account.queries';

import { userMutations } from '../domain/entities/user/user.mutations';
import { GraphQLSchema } from 'graphql';
import { transactionMutations } from '../domain/entities/transaction/transaction.mutations';

export const QueryType = new GraphQLObjectType({
  name: "Queries",
  fields: () => ({
    ...userQueries,
    ...accountQueries,
  }),
});

export const MutationType = new GraphQLObjectType({
  name: "Mutations",
  fields: () => ({
    ...userMutations,
    ...transactionMutations,
  }),
});

export const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});
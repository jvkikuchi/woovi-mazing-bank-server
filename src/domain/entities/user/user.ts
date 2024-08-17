import { GraphQLObjectType, GraphQLString } from 'graphql';
import { Document } from 'mongoose';

export const AuthResponseType = new GraphQLObjectType({
  name: 'UserLoginType',
  fields: {
    token: { type: GraphQLString },
  },
});


export const GetUserType = new GraphQLObjectType({
  name: 'GetUserType',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    surname: { type: GraphQLString },
    email: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    deletedAt: { type: GraphQLString },
  },
});

export interface User extends Document {
  name: string;
  surname: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
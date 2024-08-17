import { GraphQLString } from "graphql";
import { User, AuthResponseType } from "./user";
import { UserService } from "../../services/user.service";
import { UserModel } from "./user-model";

export const userMutations = {
    login: {
        type: AuthResponseType,
        args: {
            email: { type: GraphQLString },
            password: { type: GraphQLString },
        },
        resolve: async (_, { email, password }) => {

            const token = await UserService.login(email, password);

            return { token };
        }
    },
    createUser: {
        type: AuthResponseType,
        args: {
            name: { type: GraphQLString },
            surname: { type: GraphQLString },
            email: { type: GraphQLString },
            password: { type: GraphQLString },
        },
        resolve: async (_, { name, surname, email, password }) => {
            const newUser = new UserModel({
                name,
                surname,
                email,
                password,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const token = await UserService.create(newUser);

            return { token };
        }
    }
};
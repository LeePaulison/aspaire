import { createUser, getUserById } from '../../dal/user.js';

export const userResolvers = {
  Query: {
    hello: () => 'Hello from Apollo Server!',
    user: async (_, { id }) => {
      return await getUserById(id);
    },
  },
  Mutation: {
    createUser: async (_, { input }) => {
      return await createUser(input);
    },
  },
};

import { AuthenticationError } from 'apollo-server-micro'

export default {
  resolver: async (_, { userId }, { user, dataSources }) => {
    if (!user) throw new AuthenticationError('You must be logged in.')
    return await dataSources.api.getUser({ userId })
  },
  schema: 'user(userId: ID!): User',
}

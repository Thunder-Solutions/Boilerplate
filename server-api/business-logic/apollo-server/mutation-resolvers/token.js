import { AuthenticationError } from 'apollo-server-micro'

export default {
  resolver: async (_, { refreshToken }, { user, dataSources }) => {
    if (!user) throw new AuthenticationError('You must be logged in.')
    const newToken = await dataSources.api.newToken({ userId: user.sub, refreshToken })
    if (newToken === 'invalid') throw new AuthenticationError('Invalid token.')
    return newToken
  },
  schema: 'token(refreshToken: String): String',
}

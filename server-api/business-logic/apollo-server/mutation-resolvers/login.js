export default {
  resolver: async (_, { username, password }, { dataSources }) => {
    return await dataSources.api.login({ username, password })
  },
  schema: 'login(username: String, password: String): LoginResponse',
}

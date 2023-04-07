export default {
  resolver: async (_, { userId, refreshToken, everywhere }, { dataSources }) => {
    return await dataSources.api.logout({ userId, refreshToken, everywhere });
  },
  schema: 'logout(userId: ID, refreshToken: String, everywhere: Boolean): Boolean',
};

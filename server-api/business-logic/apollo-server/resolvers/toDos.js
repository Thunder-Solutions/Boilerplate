export default {
  resolver: async (_, __, { dataSources }) => {
    return await dataSources.api.getToDos();
  },
  schema: 'toDos: [ToDo]',
};

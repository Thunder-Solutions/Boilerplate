export default {
  resolver: async (_, { title, description }, { dataSources }) => {
    return await dataSources.api.addToDo({ title, description });
  },
  schema: 'newToDo(toDo: ToDoInput): ToDo',
};

import ToDoSchema from './toDo';
import UserSchema from './user';

const schemaMap = {
  ToDo: ToDoSchema,
  User: UserSchema,
};

// getModels(connection)
export default connection => Object.entries(schemaMap).reduce((models, [name, Schema]) => {
  models[name] = connection.model(name, Schema);
  return models;
}, {});

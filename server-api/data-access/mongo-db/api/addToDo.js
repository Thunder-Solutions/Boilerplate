const addToDo = ({ ToDo }) => async ({ title, description }) => {

  const ToDoModel = new ToDo({
    title,
    description,
  });

  const newToDo = await ToDoModel.save();

  return newToDo;
};

export default addToDo;

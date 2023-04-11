export type ToDo = {
  _id: string,
  title: string,
  description: string,
};

export type ToDosResponse = {
  toDos: ToDo[],
};

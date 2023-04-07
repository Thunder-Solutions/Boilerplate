const getToDos = ({ ToDo }) => async () => {
  const toDos = await ToDo.find()
  return toDos
}

export default getToDos

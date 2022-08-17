import { gqlMutate } from 'utilities'

const addToDo = toDo => gqlMutate(`
  mutation AddToDo($toDo: ToDo) {
    toDo(toDo: $toDo) {
      title
      description
    }
  }
`, {
  variables: { toDo },
})

export default addToDo

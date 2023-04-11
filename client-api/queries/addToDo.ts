import { ToDo, ToDosResponse } from 'client-api/models';
import { GQLResponse, gqlMutate } from 'utilities';

const addToDo = (toDo: ToDo): GQLResponse<ToDosResponse> => gqlMutate(`
  mutation AddToDo($toDo: ToDo) {
    toDo(toDo: $toDo) {
      title
      description
    }
  }
`, {
  variables: { toDo },
});

export default addToDo;

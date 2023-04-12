import { ToDosResponse } from 'client-api/models';
import { GQLResponse, gqlQuery } from 'utilities';

const getToDos = (): GQLResponse<ToDosResponse> => gqlQuery(`
  query GetToDos {
    toDos {
      _id
      title
      description
    }
  }
`, {
  fetchPolicy: 'no-cache',
});

export default getToDos;

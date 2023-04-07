import { gqlQuery } from 'utilities';

const getToDos = () => gqlQuery(`
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

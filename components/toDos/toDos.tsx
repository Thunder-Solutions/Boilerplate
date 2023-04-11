import css from './toDos.module.css';
import withAPI from '../withAPI/withAPI';
import Heading from'components/heading/heading';
import Content from 'components/content/content';

type ToDo = {
  _id: string,
  title: string,
  description: string,
};

type ToDosResponse = {
  toDos: ToDo[],
};

const validateToDos = (response: unknown): response is ToDosResponse => {
  return typeof response === 'object'
    && 'toDos' in response
    && Array.isArray(response.toDos);
}

const ToDos = withAPI({
  query: 'getToDos',
}, ({ response }) => {
  return validateToDos(response) ? (
    <div className={css.toDos}>
      {response.toDos.map(({ _id, title, description }) => (
        <div key={_id} className={css.toDo}>
          <Heading>{title}</Heading>
          <Content>{description}</Content>
        </div>
      ))}
    </div>
  ): <></>;
});

export default ToDos;

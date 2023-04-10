import css from './toDos.module.css';
import withAPI from '../withAPI/withAPI';
import Heading from'components/heading/heading';
import Content from 'components/content/content';

const ToDos = withAPI({
  query: 'getToDos',
}, ({ response }) => {
  return (
    <div className={css.toDos}>
      {response.toDos.map(({ _id, title, description }) => (
        <div key={_id} className={css.toDo}>
          <Heading>{title}</Heading>
          <Content>{description}</Content>
        </div>
      ))}
    </div>
  );
});

export default ToDos;

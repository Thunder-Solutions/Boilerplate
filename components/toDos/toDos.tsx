import css from './toDos.module.css';
import withAPI from '../withAPI/withAPI';
import Title from 'components/title/title';
import Content from 'components/content/content';

const ToDos = withAPI({
  query: 'getToDos',
}, ({ response }) => {
  return (
    <div className={css.toDos}>
      {response.toDos.map(({ _id, title, description }) => (
        <div key={_id} className={css.toDo}>
          <Title>{title}</Title>
          <Content>{description}</Content>
        </div>
      ))}
    </div>
  );
});

export default ToDos;

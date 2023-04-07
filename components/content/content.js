import css from './content.module.css';

const Content = ({ children, Tag = 'p' }) => {
  return <Tag className={css.content}>{children}</Tag>;
};

export default Content;

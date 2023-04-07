import css from './group.module.css';

const Group = ({ children, className = '' }) => {
  return (
    <div className={`${css.group} ${className}`}>{children}</div>
  );
};

export default Group;

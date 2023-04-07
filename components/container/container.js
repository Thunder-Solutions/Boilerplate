import css from './container.module.css';

const Container = ({ children, className = '' }) => {
  return (
    <div className={`${css.container} ${className}`}>{children}</div>
  );
};

export default Container;

import { DivTagProps } from 'utilities';
import css from './container.module.css';

export type ContainerProps = DivTagProps;

const Container = ({ children, className = '', ...props }: ContainerProps) => {
  return (
    <div {...props} className={`${css.container} ${className}`}>{children}</div>
  );
};

export default Container;

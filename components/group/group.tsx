import { DivTagProps } from 'utilities';
import css from './group.module.css';

export type GroupProps = DivTagProps

const Group = ({ children, className = '', ...props }: GroupProps) => {
  return (
    <div {...props} className={`${css.group} ${className}`} role="group">{children}</div>
  );
};

export default Group;

import Link from 'cmsComponents/link/link';
import { getClassName } from 'utilities';
import css from './button.module.css';

const Button = ({ children, className = '', type = 'submit', ...props }) => {

  const buttonClass = getClassName({
    [css.primary]: type === 'submit',
  }, css.button, className);

  return (
    <button {...props} type={type} className={buttonClass}>{children}</button>
  );
};

Button.Link = ({ children, className = '', wrapperClass = '', type = '', ...props }) => {

  const buttonClass = getClassName({
    [css.primary]: type === 'primary',
  }, css.button, css.buttonLink, className);

  return (
    <Link {...props} type="none" className={buttonClass} wrapperClass={wrapperClass}>{children}</Link>
  );
};

export default Button;

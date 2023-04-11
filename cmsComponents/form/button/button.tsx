import Link, { LinkComponentProps } from 'cmsComponents/link/link';
import { getClassName } from 'utilities';
import css from './button.module.css';
import { ButtonProps } from 'utilities/types';
import { PropsWithChildren } from 'react';

const Button = ({ children, className = '', type = 'submit', ...props }: ButtonProps) => {

  const buttonClass = getClassName({
    [css.primary]: type === 'submit',
  }, css.button, className);

  return (
    <button {...props} type={type} className={buttonClass}>{children}</button>
  );
};

type RawButtonLinkProps = {
  className?: string,
  wrapperClass?: string,
  type?: '' | 'primary',
};

export type ButtonLinkProps = PropsWithChildren<RawButtonLinkProps & Omit<LinkComponentProps, keyof RawButtonLinkProps>>;

Button.Link = ({ children, className = '', wrapperClass = '', type = '', ...props }: ButtonLinkProps) => {

  const buttonClass = getClassName({
    [css.primary]: type === 'primary',
  }, css.button, css.buttonLink, className);

  return (
    <Link {...props} type="none" className={buttonClass} wrapperClass={wrapperClass}>{children}</Link>
  );
};

export default Button;

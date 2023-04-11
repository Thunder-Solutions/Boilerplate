import css from './link.module.css';
import NextLink, { LinkProps } from 'next/link';
import { RefAttributes } from 'react';
import { bool, getClassName, AnchorTagProps } from 'utilities';

export type LinkComponentProps = {
  /**
   * To override the styles on the link wrapper
   */
  wrapperClass?: string,
  /**
   * Changes the layout behavior of the link
   * @defaultValue `true`
   */
  inline?: boolean,
  /**
   * May be set to `"none"` to strip the visual indicators of the underlying link. This can be particularly useful for wrapping images.
   * @defaultValue `"default"`
   */
  type?: 'default' | 'none',
} & Omit<AnchorTagProps, keyof LinkProps> & LinkProps & RefAttributes<HTMLAnchorElement>;

const Link = ({
  children,
  className = '',
  wrapperClass: _wrapperClass = '',
  inline = true,
  type = 'default',
  ...props
}: LinkComponentProps) => {

  const wrapperClass = getClassName({ [css.standalone]: !bool(inline) }, css.linkWrapper, _wrapperClass);
  const linkClass = getClassName({ [css[type]]: !!css[type] }, css.link, className);
  if (!css[type]) console.warn(`"${type}" is not a valid <Link> type.`);

  return (
    <span className={wrapperClass}>
      <NextLink className={linkClass} {...props}>
        {children}
      </NextLink>
    </span>
  );
};

export default Link;

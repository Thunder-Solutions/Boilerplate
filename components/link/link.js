import css from './link.module.css';
import NextLink from 'next/link';
import { bool, getClassName } from 'utilities';

const Link = ({
  children,
  className = '',
  wrapperClass: _wrapperClass = '',
  inline = true,
  type = 'default',
  ...props
}) => {

  const wrapperClass = getClassName({ [css.standalone]: !bool(inline) }, css.linkWrapper, _wrapperClass);
  const linkClass = getClassName({ [css[type]]: !!css[type] }, css.link, className);
  if (!css[type]) console.warn(`"${type}" is not a valid <Link> type.`);

  return (
    <span className={wrapperClass}>
      <NextLink {...props}>
        <a className={linkClass}>{children}</a>
      </NextLink>
    </span>
  );
};

export default Link;

import Link from 'components/link/link';
import LocaleContext from 'locales/localeContext';
import { Fragment, useContext } from 'react';
import css from './siteFooter.module.css';
import Icon from 'components/icon/icon';
import { GenericTagProps } from 'utilities';

export type SiteFooterProps = GenericTagProps;

const SiteFooter = ({ className = '', ...props }: SiteFooterProps) => {
  const locale = useContext(LocaleContext);
  const footerClass = `${css.footer} ${className}`
  return (
    <footer {...props} className={footerClass}>
      <small>{locale.copyright}</small>
      <div className={css.links}>
        <div className={css.siteMap}>
          {locale.siteMap.map(({ text, href }, idx) => (
            <Fragment key={href}>
              <Link href={href}>{text}</Link>
              {idx === locale.siteMap.length - 1 ? <></> : <> | </>}
            </Fragment>
          ))}
        </div>
        <div className={css.social}>
          {locale.social.map(({ type, title, href }) => (
            <Link key={href} className={css.socialLink} href={href}>
              <Icon type={type} title={title} />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;

import css from './page.module.css';
import { SiteFooter, SiteHeader } from 'components';

const Page = ({ children, id }) => {
  return (
    <div className={css.page} id={id}>
      <SiteHeader pageId={id} />
      <main>{children}</main>
      <SiteFooter/>
    </div>
  );
};

export default Page;

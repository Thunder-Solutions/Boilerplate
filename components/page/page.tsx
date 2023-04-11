import { DivTagProps } from 'utilities/types';
import css from './page.module.css';
import { SiteFooter, SiteHeader } from 'components';

export type PageProps = DivTagProps;

const Page = ({ children, id, ...props }: PageProps) => {
  return (
    <div {...props} className={css.page} id={id}>
      <SiteHeader pageId={id} />
      <main>{children}</main>
      <SiteFooter/>
    </div>
  );
};

export default Page;

import Heading from'components/heading/heading';
import css from './pageHeading.module.css';

export type PageHeadingProps = {
  title: string,
  subtitle?: string,
};

const PageHeading = ({ title, subtitle }: PageHeadingProps) => {
  return (
    <header className={css.header}>
      <Heading lv={1} className={css.title}>{title}</Heading>
      {subtitle ? <Heading className={css.subtitle}>{subtitle}</Heading> : <></>}
    </header>
  );
};

export default PageHeading;

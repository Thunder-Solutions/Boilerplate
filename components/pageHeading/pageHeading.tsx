import Heading from'components/heading/heading';
import css from './pageHeading.module.css';

const PageHeading = ({ title, subtitle }) => {
  return (
    <header className={css.header}>
      <Heading lv={1} className={css.title}>{title}</Heading>
      {subtitle ? <Heading className={css.subtitle}>{subtitle}</Heading> : <></>}
    </header>
  );
};

export default PageHeading;

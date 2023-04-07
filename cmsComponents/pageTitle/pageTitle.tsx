import Title from 'components/title/title';
import css from './pageTitle.module.css';

const PageTitle = ({ title, subtitle }) => {
  return (
    <header className={css.header}>
      <Title lv={1} className={css.title}>{title}</Title>
      {subtitle ? <Title className={css.subtitle}>{subtitle}</Title> : <></>}
    </header>
  );
};

export default PageTitle;

import css from './heading.module.css';
import { DivProps, HeadingProps } from 'utilities/types';

export type HeadingComponentProps = { lv?: number } & (DivProps | HeadingProps);

const Heading = ({ children, lv = 2 }: HeadingComponentProps) => {

  // if `lv` is 0 (or a non-number) remove all semantics completely
  const H = (lv === 0 || isNaN(lv)) ? (props: DivProps) => <div {...props} /> : `h${lv}`;

  return <H className={css.title}>{children}</H>;
};

export default Heading;

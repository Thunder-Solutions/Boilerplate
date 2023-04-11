import css from './heading.module.css';
import { DivTagProps, HeadingTagProps } from 'utilities/types';

export type HeadingComponentProps = { lv?: number } & (DivTagProps | HeadingTagProps);

const Heading = ({ children, lv = 2 }: HeadingComponentProps) => {

  // if `lv` is 0 (or a non-number) remove all semantics completely
  const H = (lv === 0 || isNaN(lv)) ? (props: DivTagProps) => <div {...props} /> : `h${lv}`;

  return <H className={css.title}>{children}</H>;
};

export default Heading;

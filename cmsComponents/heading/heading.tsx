import { DetailedHTMLProps, HTMLAttributes } from 'react';
import css from './heading.module.css';

type DivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
type HProps = DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
type HTMLProps = DivProps | HProps;

export type HeadingProps = { lv?: number } & HTMLProps;

const Heading = ({ children, lv = 2 }: HeadingProps) => {

  // if `lv` is 0 (or a non-number) remove all semantics completely
  const H = (lv === 0 || isNaN(lv)) ? (props: DivProps) => <div {...props} /> : `h${lv}`;

  return <H className={css.title}>{children}</H>;
};

export default Heading;

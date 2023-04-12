import css from './heading.module.css';
import { DivTagProps, HeadingTagProps } from 'utilities';

export type HeadingComponentProps = {
  /**
   * The heading level.
   * @example
   * <Heading h={1}> === <h1>
   * <Heading h={2}> === <h2>
   * ...etc
   * @defaultValue `2`
   */
  h?: number,
} & (DivTagProps | HeadingTagProps);

const Heading = ({ children, h = 2 }: HeadingComponentProps) => {

  // if `h` is 0 (or a non-number) remove all semantics completely
  const H = (h === 0 || isNaN(h)) ? (props: DivTagProps) => <div {...props} /> : `h${h}`;

  return <H className={css.title}>{children}</H>;
};

export default Heading;

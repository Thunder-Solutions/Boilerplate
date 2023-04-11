import { PropsWithChildren } from 'react';
import css from './content.module.css';

export type ContentProps = PropsWithChildren<{
  /**
   * If the `<p>` tag does not meet the semantic needs of the situation, it can be swapped using this prop
   * @defaultValue `"p"`
   */
  Tag?: keyof JSX.IntrinsicElements,
}>;

const Content = ({ children, Tag = 'p', ...props }: ContentProps) => {
  return <Tag {...props} className={css.content}>{children}</Tag>;
};

export default Content;

import { DivTagProps } from 'utilities/types';
import css from './spinner.module.css';

const Spinner = (props: DivTagProps) => {
  return (
    <div {...props}>
      <div className={css.spinner} title="loading..." />
    </div>
  );
};

export default Spinner;

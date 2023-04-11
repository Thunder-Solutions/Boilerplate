import { DivTagProps } from 'utilities';
import css from './spinner.module.css';

export type SpinnerProps = DivTagProps;

const Spinner = (props: SpinnerProps) => {
  return (
    <div {...props}>
      <div className={css.spinner} title="loading..." />
    </div>
  );
};

export default Spinner;

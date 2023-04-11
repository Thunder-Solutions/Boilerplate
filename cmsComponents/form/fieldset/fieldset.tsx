import { FieldsetProps } from 'utilities/types';
import css from './fieldset.module.css';

type FieldsetComponentProps = FieldsetProps & {
  legend?: string,
};

const Fieldset = ({ children, className = '', legend = 'Section', ...props }: FieldsetComponentProps) => {

  const fieldsetClass = `${className} ${css.fieldset}`;

  return (
    <fieldset {...props} className={fieldsetClass}>
      <legend className={css.legend}>{legend}</legend>
      <div className={css.content}>
        {children}
      </div>
    </fieldset>
  );
};

export default Fieldset;

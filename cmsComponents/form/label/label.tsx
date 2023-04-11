import { getClassName } from 'utilities';
import css from './label.module.css';
import { LabelProps } from 'utilities/types';

type LabelComponentProps = {
  label?: string,
  inline?: boolean,
  required?: boolean,
} & LabelProps;

const Label = ({ children, label = '', inline = false, required = false, ...props }: LabelComponentProps) => {

  const labelClass = getClassName({
    [css.inline]: inline,
  }, css.label);

  return (
    <label {...props} className={labelClass}>
      {inline ? <span>{children}</span> : <></>}
      <span className={css.labelText}>
        {label}
        {required
          ? <abbr className={css.required} title="required">*</abbr>
          : <></>
        }
      </span>
      {!inline ? <span>{children}</span> : <></>}
    </label>
  );
};

export default Label;

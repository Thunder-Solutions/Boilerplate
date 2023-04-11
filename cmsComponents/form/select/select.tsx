import Icon from 'cmsComponents/icon/icon';
import { NOOP, SelectTagProps } from 'utilities';
import { PropsWithLabel, getValidationHelpers } from '../formUtilities';
import Label from '../label/label';
import css from './select.module.css';
import { ChangeEventHandler } from 'react';

export type SelectComponentProps = PropsWithLabel<SelectTagProps>;

const Select = ({ children, ...props }: SelectComponentProps) => {

  // not destructuring above because we want to pass all props around
  const {
    onChange = NOOP,
    label = '',
    required = false,
    defaultValue = '',
  } = props;

  const {
    className,
    handleBlur,
    inputRef,
    validate,
  } = getValidationHelpers({
    props,
    inputClass: css.select,
  });

  const handleChange: ChangeEventHandler = (event) => {
    validate(event.nativeEvent);
    onChange(event);
  };

  return (
    <Label label={label} required={required}>
      <span className={css.container}>
        <select
          {...props}
          className={className}
          onBlur={handleBlur}
          onChange={handleChange}
          defaultValue={defaultValue}
          ref={inputRef}
        >
          {defaultValue
            ? <></>
            : <option value="" disabled>Select an option...</option>
          }
          {children}
        </select>
        <Icon type="Down" className={css.icon} />
      </span>
    </Label>
  );
};

export default Select;

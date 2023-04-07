import { useState } from 'react';
import { NOOP } from 'utilities';
import { getValidationHelpers } from '../formUtilities';
import Label from '../label/label';
import css from './checkbox.module.css';

const Checkbox = props => {

  // not destructuring above because we want to pass all props around
  const {
    onChange = NOOP,
    label = '',
    required = false,
    checked: _checked = false,
  } = props;

  const {
    className,
    handleBlur,
    inputRef,
    validate,
  } = getValidationHelpers({
    props,
    inputClass: css.checkbox,
  });

  const [checked, setChecked] = useState(_checked);
  const handleChange = event => {
    setChecked(event.target.checked);
    validate(event);
    onChange(event);
  };

  const toggleChecked = () => { setChecked(!checked); };
  const handleKeyDown = event => {
    if (event.key === ' ') toggleChecked();
  };

  return (
    <Label label={label} required={required} inline={true}>
      <input
        {...props}
        className={css.input}
        type="checkbox"
        ref={inputRef}
        onChange={handleChange}
        checked={checked}
      />
      <span
        tabIndex="0"
        className={className}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        data-is-checkable="true"
      />
    </Label>
  );
};

export default Checkbox;

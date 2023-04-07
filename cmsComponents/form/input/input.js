import css from './input.module.css';
import { getValidationHelpers } from '../formUtilities';
import Label from '../label/label';
import { NOOP } from 'utilities';

const Input = props => {

  // not destructuring above because we want to pass all props around
  const {
    autoFormat = v => v,
    onInput = NOOP,
    label = '',
    required = false,
  } = props;

  const {
    className,
    handleBlur,
    inputRef,
    validate,
  } = getValidationHelpers({
    props,
    inputClass: css.input,
  });

  const handleInput = event => {
    inputRef.current.value = autoFormat(inputRef.current.value);
    validate(event);
    onInput(event);
  };

  return (
    <Label label={label} required={required}>
      <input
        {...props}
        className={className}
        ref={inputRef}
        onBlur={handleBlur}
        onInput={handleInput}
      />
    </Label>
  );
};

export default Input;

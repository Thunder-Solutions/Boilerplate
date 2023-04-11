import css from './input.module.css';
import { PropsWithLabel, getValidationHelpers } from '../formUtilities';
import Label from '../label/label';
import { NOOP } from 'utilities';
import { InputProps } from 'utilities/types';
import { ChangeEventHandler } from 'react';

type InputComponentProps = PropsWithLabel<{
  autoFormat?: (value: string) => string,
} & InputProps>;

const Input = (props: InputComponentProps) => {

  // not destructuring above because we want to pass all props around
  const {
    autoFormat = (v: string): string => v,
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

  const handleInput: ChangeEventHandler = (event) => {
    inputRef.current.value = autoFormat(inputRef.current.value);
    validate(event.nativeEvent);
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

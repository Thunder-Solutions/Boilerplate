import css from './textarea.module.css';
import { PropsWithLabel, getValidationHelpers } from '../formUtilities';
import Label from '../label/label';
import { NOOP } from 'utilities';
import { TextareaProps } from 'utilities/types';
import { ChangeEventHandler } from 'react';

type TextareaComponentProps = PropsWithLabel<{
  autoFormat?: (value: string) => string,
} & TextareaProps>;

const Textarea = ({ children, ...props }: TextareaComponentProps) => {

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
    inputClass: css.textarea,
  });

  const handleInput: ChangeEventHandler = event => {
    inputRef.current.value = autoFormat(inputRef.current.value);
    validate(event.nativeEvent);
    onInput(event);
  };

  return (
    <Label label={label} required={required}>
      <textarea
        {...props}
        className={className}
        ref={inputRef}
        onBlur={handleBlur}
        onInput={handleInput}
      >{children}</textarea>
    </Label>
  );
};

export default Textarea;

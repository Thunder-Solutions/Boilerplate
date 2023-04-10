import { useState, useEffect, useRef, useContext } from 'react';
import { createContextState, NOOP, getClassName } from 'utilities';
import css from './formValidation.module.css';

export const DEFAULT_FORM_STATE = {
  valid: false,
  validated: false,
  validationMessage: '',
};

export const FormContext = createContextState(DEFAULT_FORM_STATE);

export const DEFAULT_SUBMIT = (data: FormData) => {
  console.group('Form submitted without a handler.');
  console.log('Form Data:', [...data.entries()]);
  console.groupEnd();
  return 'The form was submitted.';
};

type ValidationProps = {
  className?: string,
  getValidityMessage?: (value?: string) => string,
  onBlur?: (event: Event) => void,
}

type ValidationArgs = {
  props: ValidationProps,
  inputClass: string,
  inputArr: HTMLInputElement[],
}

/**
 * Get validation helpers for custom validation.
 */
export const getValidationHelpers = ({ props = {}, inputClass = '', inputArr = [] }: ValidationArgs) => {

  const {
    className: _className = '',
    getValidityMessage = () => '',
    onBlur = NOOP,
  } = props;

  const [validated, setValidated] = useState(false);
  const [touched, setTouched] = useState(false);
  const [dirty, setDirty] = useState(false);
  const inputRef = useRef<HTMLInputElement>();
  const inputRefs = useRef<HTMLInputElement[]>(inputArr);

  const inputState = {
    touched,
    dirty,
    validated,
  };

  const className = getClassName({
    [css.touched]: touched,
    [css.untouched]: !touched,
    [css.dirty]: dirty,
    [css.pristine]: !dirty,
    [css.validated]: validated,
  }, css.control, inputClass, _className);

  const checkValidity = () => {
    const checkInputRef = (input: HTMLInputElement) => {
      const inputIsCheckable = Object.prototype.hasOwnProperty.call(input, 'checked');
      if (inputIsCheckable && !input.checked) return input.setCustomValidity('');
      const validityMessage = getValidityMessage(input.value);
      input.setCustomValidity(validityMessage);
    };
    if (inputRef.current) checkInputRef(inputRef.current);
    else inputRefs.current.forEach(checkInputRef);
  };

  const validate = (event: Event) => {
    const { value } = event.currentTarget as HTMLInputElement;
    setDirty(!!value && value !== '');
    if (inputRef.current) inputRef.current.setCustomValidity('');
    else inputRefs.current.forEach(input => input.setCustomValidity(''));
  };

  const handleBlur = (event: Event) => {
    checkValidity();
    setTouched(true);
    onBlur(event);
  };

  useEffect(checkValidity); // check once on render

  // keep "validated" in sync with the context
  const { value: { validated: _validated } } = useContext(FormContext);
  useEffect(() => { setValidated(_validated); }, [_validated]);

  return {
    className,
    handleBlur,
    inputRef,
    inputRefs,
    inputState,
    validate,
  };
};

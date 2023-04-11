import Spinner from 'cmsComponents/spinner/spinner';
import { useState } from 'react';
import { getClassName } from 'utilities';
import css from './form.module.css';
import { DEFAULT_FORM_STATE, DEFAULT_SUBMIT, FormContext } from './formUtilities';
import { FormProps } from 'utilities/types';

export type FormComponentProps = {
  onSubmit?: (formData: FormData) => string | Promise<string>,
} & FormProps;

const Form = ({ children, onSubmit = DEFAULT_SUBMIT }: FormComponentProps) => {
  const [formState, setFormState] = useState(DEFAULT_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const { valid, validated, validationMessage } = formState;

  const handleInvalid = event => {
    const form = event.currentTarget;
    const invalidInput = [...form.elements].find(input => !input.checkValidity());
    setFormState({
      valid: false,
      validated: true,
      validationMessage: invalidInput.validationMessage || 'The form is invalid.',
    });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    const form = event.currentTarget;
    setLoading(true);
    try {
      const formData = new FormData(form);
      const { name, value } = event.nativeEvent.submitter ?? {};
      if (name) formData.append(name, value);
      const successMessage = await onSubmit(formData) ?? 'The form has been submitted.';
      setFormState({
        valid: true,
        validated: true,
        validationMessage: successMessage,
      });
    } catch (err) {
      setFormState({
        valid: false,
        validated: true,
        validationMessage: String(err).trim() || 'Something went wrong.',
      });
    }
    setLoading(false);
  };

  const messageClass = getClassName({
    [css.warning]: !valid && !validated,
    [css.invalid]: !valid && validated,
    [css.valid]: valid,
  }, css.message);

  return (
    <FormContext.Provider value={{ value: formState, setValue: setFormState }}>
      <form className={css.form} onSubmit={handleSubmit} onInvalid={handleInvalid}>
        {loading
          ? <div className={css.loadingOverlay}><Spinner /></div>
          : <></>
        }
        {children}
        <div role="alert">
          {validated && validationMessage !== ''
            ? <div className={messageClass}>{validationMessage}</div>
            : <></>
          }
        </div>
      </form>
    </FormContext.Provider>
  );
};

export default Form;

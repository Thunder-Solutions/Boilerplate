import { DivTagProps } from 'utilities';
import css from './errorMessage.module.css';

export type ErrorMessageProps = {
  error: Error | string,
} & DivTagProps;

const ErrorMessage = ({ error, ...props }: ErrorMessageProps) => {
  const _error = typeof error === 'string' ? error : error.message ?? String(error);
  console.error(error);
  return (
    <div {...props} className={css.error}>There was an error: {_error}</div>
  );
};

export default ErrorMessage;

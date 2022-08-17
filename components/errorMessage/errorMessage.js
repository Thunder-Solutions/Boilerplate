import { checkType } from 'utilities'
import css from './errorMessage.module.css'

const ErrorMessage = ({ error }) => {
  const _error = checkType(error, 'string') ? error : error.error
  console.error(error)
  return (
    <div>There was an error: {_error}</div>
  )
}

export default ErrorMessage

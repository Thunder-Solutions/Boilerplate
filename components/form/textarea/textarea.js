import css from './textarea.module.css'
import { getValidationHelpers } from '../formUtilities'
import Label from '../label/label'
import { NOOP } from 'utilities'

const Textarea = ({ children, ...props }) => {

  // not destructuring above because we want to pass all props around
  const {
    autoFormat = v => v,
    onInput = NOOP,
    label = '',
    required = false,
  } = props

  const {
    className,
    handleBlur,
    inputRef,
    validate,
  } = getValidationHelpers({
    props,
    inputClass: css.textarea,
  })

  const handleInput = event => {
    inputRef.current.value = autoFormat(inputRef.current.value)
    validate(event)
    onInput(event)
  }

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
  )
}

export default Textarea

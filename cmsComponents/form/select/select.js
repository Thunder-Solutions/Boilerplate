import Icon from 'cmsComponents/icon/icon'
import { NOOP } from 'utilities'
import { getValidationHelpers } from '../formUtilities'
import Label from '../label/label'
import css from './select.module.css'

const Select = ({ children, ...props }) => {

  // not destructuring above because we want to pass all props around
  const {
    onChange = NOOP,
    label = '',
    required = false,
    defaultValue = '',
  } = props

  const {
    className,
    handleBlur,
    inputRef,
    validate,
  } = getValidationHelpers({
    props,
    inputClass: css.select,
  })

  const handleChange = event => {
    validate(event)
    onChange(event)
  }

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
            : <option value="" disabled="disabled">Select an option...</option>
          }
          {children}
        </select>
        <Icon type="Down" className={css.icon} />
      </span>
    </Label>
  )
}

export default Select

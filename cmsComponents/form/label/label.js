import { getClassName } from 'utilities'
import css from './label.module.css'

const Label = ({ children, label = 'Form Field', inline = false, required = false, ...props }) => {

  const labelClass = getClassName({
    [css.inline]: inline,
  }, css.label)

  return (
    <label {...props} className={labelClass}>
      {inline ? <span>{children}</span> : <></>}
      <span className={css.labelText}>
        {label}
        {required
          ? <abbr className={css.required} title="required">*</abbr>
          : <></>
        }
      </span>
      {!inline ? <span>{children}</span> : <></>}
    </label>
  )
}

export default Label

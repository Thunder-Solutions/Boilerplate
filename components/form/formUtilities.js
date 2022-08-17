import { useState, useEffect, useRef, createRef, useContext } from 'react'
import { createContextState, useContextState, NOOP, getClassName } from 'utilities'
import css from './formValidation.module.css'

export const DEFAULT_FORM_STATE = {
  valid: false,
  validated: false,
  validationMessage: '',
}

export const FormContext = createContextState(DEFAULT_FORM_STATE)

export const DEFAULT_SUBMIT = data => {
  console.group('Form submitted without a handler.')
  console.log('Form Data:', [...data.entries()])
  console.groupEnd()
}

/**
 * Get validation helpers for custom validation.
 * @param {function} validation - This callback should return a string to set a custom validity message on an input.
 * @param {Array.<Object>} inputArr - A list of inputs to which validation will apply.
 * @returns {Object} - A module containing validation helpers.
 */
export const getValidationHelpers = ({ props = {}, inputClass = '', inputArr = [] }) => {

  const {
    className: _className = '',
    getValidityMessage = (() => ''),
    onBlur = NOOP,
  } = props

  const [validated, setValidated] = useState(false)
  const [touched, setTouched] = useState(false)
  const [dirty, setDirty] = useState(false)
  const inputRef = useRef(null)
  const inputRefs = useRef(inputArr.map(createRef))

  const inputState = {
    touched,
    dirty,
    validated,
  }

  const className = getClassName({
    [css.touched]: touched,
    [css.untouched]: !touched,
    [css.dirty]: dirty,
    [css.pristine]: !dirty,
    [css.validated]: validated,
  }, css.control, inputClass, _className)

  const checkValidity = () => {
    const checkInputRef = inputRef => {
      const input = inputRef.current
      const inputIsCheckable = Object.prototype.hasOwnProperty.call(input, 'checked')
      if (inputIsCheckable && !input.checked) return input.setCustomValidity('')
      const validityMessage = getValidityMessage(input.value)
      input.setCustomValidity(validityMessage)
    }
    if (inputRef.current) checkInputRef(inputRef)
    else inputRefs.current.forEach(checkInputRef)
  }

  const validate = event => {
    const { value } = event.currentTarget
    setDirty(!!value && value !== '')
    if (inputRef.current) inputRef.current.setCustomValidity('')
    else inputRefs.current.forEach(inputRef => inputRef.current.setCustomValidity(''))
  }

  const handleBlur = event => {
    checkValidity()
    setTouched(true)
    onBlur(event)
  }

  useEffect(checkValidity) // check once on render

  // keep "validated" in sync with the context
  const { value: { validated: _validated } } = useContext(FormContext)
  useEffect(() => { setValidated(_validated) }, [_validated])

  return {
    className,
    handleBlur,
    inputRef,
    inputRefs,
    inputState,
    validate,
  }
}

import PropTypesOriginal from 'prop-types'
import { EMPTY, empty } from './constants'

/**
 * Used for mapping PropType method names to their corresponding types
 */
const typeMap = {
  any: null,
  array: Array,
  bigint: BigInt,
  bool: Boolean,
  element: globalThis.HTMLElement,
  elementType: globalThis.HTMLElement,
  func: Function,
  node: globalThis.Node,
  number: Number,
  object: Object,
  string: String,
  symbol: Symbol,
}

/**
 * Decorates the PropTypes package with actual types so they can be extracted from outside the component
 */
export const PropTypes = Object.entries(PropTypesOriginal).reduce((PropTypes, [key, val]) => {
  PropTypes[key] = val
  const assignType = (obj, Type) => {
    obj.type = Type
    if (obj.isRequired) obj.isRequired.type = Type
  }
  if (val.name === 'bound checkType') {
    const Type = typeMap[key] ?? null
    assignType(PropTypes[key], Type)
  } else if (typeof val === 'function') {
    PropTypes[key] = (Type, ...args) => {
      const result = val(Type, ...args)
      assignType(result, Type)
      return result
    }
  }
  return PropTypes
}, {})

/**
 * Get just the information needed from one propType
 * @param {PropTypesOriginal.Validator<unknown>} propType - The propType as defined by the 'prop-types' npm package (and decorated by 'utilities/cms')
 * @returns {{ required: Boolean, type: Function }} - The necessary propType info
 */
export const getPropTypeInfo = propType => ({

  // if the property exists, then `isRequired` was not defined in the propTypes;
  // therefore, we know this field is required if `isRequired` is missing.
  required: !propType.isRequired,

  // this will contain the type as long as the decorated version of propTypes
  // from local 'utilities' was used in the original component's definition.
  type: propType.type,
})

/**
 * Get props which are available for the CMS to edit
 * @param {React.ReactElement} Component - The React component to get props from
 * @returns {[string, unknown]} - Key/value pairs for each propType for easy iteration
 */
export const getCMSProps = Component => Object.entries(Component.propTypes ?? EMPTY.OBJ)

/**
 * Component props as { key: value } pairs
 * @typedef {Object.<string, unknown>} Props
 */

/**
 * Gets the default prop values for a given component
 * @param {React.ReactElement} Component - The component which needs default props
 * @returns {Props} - The prop values as key/value pairs
 */
export const getDefaultProps = Component => {
  const cmsProps = getCMSProps(Component.propTypes)
  const defaultPropState = cmsProps.reduce((defaultPropState, [prop, propType]) => {
    const { required, type } = getPropTypeInfo(propType)
    if (required) defaultPropState[prop] = empty(type)
    return defaultPropState
  }, empty(Object))
  return defaultPropState
}

/**
 * An object representing a component as it's used in the page-builder
 * @typedef {Object} CMSComponent
 * @property {string} id
 * @property {React.ReactElement} Component
 * @property {Props} props
 * @property {Array<CMSComponent>} childComponents
 */

/**
 * Creates a new object representing one component with default content
 * @param {React.ReactElement} Component - The actual React component to use
 * @param {number} index - The insertion index in the component array
 * @returns {CMSComponent} - A new component object for use with the CMS
 */
export const createComponent = (Component, index) => ({
  id: `${Component.name}-${Date.now()}-${index}`,
  Component,
  props: getDefaultProps(Component),
  childComponents: [],
})

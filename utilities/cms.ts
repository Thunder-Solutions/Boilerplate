import PropTypesOriginal, { Requireable } from 'prop-types';
import { EMPTY, empty } from './constants';
import { ReactElement } from 'react';

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
};

type GenericObj = { [key: string]: unknown };
type GenericFn = (...args: unknown[]) => unknown;
type ValueOf<T> = T[keyof T];

/**
 * Decorates the PropTypes package with actual types so they can be extracted from outside the component
 */
export const PropTypes: typeof PropTypesOriginal = Object.entries(PropTypesOriginal).reduce((PropTypes, [key, val]) => {
  PropTypes[key] = val;
  const assignType = (obj, Type) => {
    obj.type = Type;
    if (obj.isRequired) obj.isRequired.type = Type;
  };
  const _val = val as (GenericObj | GenericFn);
  if (_val.name === 'bound checkType') {
    const Type = typeMap[key] ?? null;
    assignType(PropTypes[key], Type);
  } else if (typeof _val === 'function') {
    PropTypes[key] = (Type, ...args) => {
      const result = _val(Type, ...args);
      assignType(result, Type);
      return result;
    };
  }
  return PropTypes;
}, { ...PropTypesOriginal });

type RequireableWithType<T> = { type: ValueOf<typeof typeMap> } & Requireable<T>

/**
 * Get just the information needed from one propType
 */
export const getPropTypeInfo = (propType: RequireableWithType<unknown>): { required: Boolean, type: ValueOf<typeof typeMap> } => ({

  // if the property exists, then `isRequired` was not defined in the propTypes;
  // therefore, we know this field is required if `isRequired` is missing.
  required: !propType.isRequired,

  // this will contain the type as long as the decorated version of propTypes
  // from local 'utilities' was used in the original component's definition.
  type: propType.type,
});

type Component = { propTypes?: GenericObj, name?: string } & ReactElement<unknown>;
type PropTuple = [string, RequireableWithType<unknown>];

/**
 * Get props which are available for the CMS to edit
 */
export const getCMSProps = (Component: Component): PropTuple[] => {
  return Object.entries(Component.propTypes ?? EMPTY.OBJ);
};

/**
 * Gets the default prop values for a given component
 */
export const getDefaultProps = (Component: Component): GenericObj => {
  const cmsProps = getCMSProps(Component);
  const defaultPropState = cmsProps.reduce((defaultPropState, [prop, propType]: PropTuple) => {
    const { required, type } = getPropTypeInfo(propType);
    if (required) defaultPropState[prop] = empty(type);
    return defaultPropState;
  }, {});
  return defaultPropState;
};

type CMSComponent = {
  id: string,
  Component: Component,
  props: GenericObj,
  childComponents: CMSComponent[],
};

/**
 * Creates a new object representing one component with default content
 */
export const createComponent = (Component: Component, index: number): CMSComponent => ({
  id: `${Component.name}-${Date.now()}-${index}`,
  Component,
  props: getDefaultProps(Component),
  childComponents: [],
});

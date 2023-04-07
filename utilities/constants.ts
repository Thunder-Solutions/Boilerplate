/**
 * No operation: a DRY constant for setting default callbacks
 * @returns {void}
 */
export const NOOP = () => {};

/**
 * Empty Values: DRY constants for default values
 */
export const EMPTY = {
  ARR: [],
  BIGINT: 0n,
  BOOL: false,
  EL: globalThis.document?.createElement('div'),
  FN: NOOP,
  NODE: globalThis.document?.createTextNode(''),
  NUM: 0,
  OBJ: {},
  STR: '',
  SYM: Symbol('sym'),
};

/**
 * A slightly more legible format to represent type constructor classes
 * @template T
 * @typedef {<T>new () => T} Constructor
 */

// this is defined outside the `empty` function because it doesn't need to be created more than once
/**
 * Used to associate types with their respective empty values in the `empty(Type)` function below
 * @template T
 * @type {Map<Constructor<T>, T>}
 */
const emptyMap = new Map();
emptyMap.set(Array, EMPTY.ARR);
emptyMap.set(BigInt, EMPTY.BIGINT);
emptyMap.set(Boolean, EMPTY.BOOL);
emptyMap.set(globalThis.HTMLElement, EMPTY.EL);
emptyMap.set(Function, EMPTY.FN);
emptyMap.set(globalThis.Node, EMPTY.NODE);
emptyMap.set(Number, EMPTY.NUM);
emptyMap.set(Object, EMPTY.OBJ);
emptyMap.set(String, EMPTY.STR);
emptyMap.set(Symbol, EMPTY.SYM);

/**
 * Gets a default (empty) value for the provided type
 * @template T
 * @param {Constructor<T>} Type - The constructor of the desired type
 * @returns {T} - The default value of the given type
 */
export const empty = Type => emptyMap.get(Type);

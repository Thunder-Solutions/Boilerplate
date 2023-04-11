import { Constructor } from './types';

/**
 * No operation: a DRY constant for setting default callbacks
 */
export const NOOP = () => {};

/**
 * Empty Values: DRY constants for default values
 */
export const EMPTY = Object.freeze(Object.seal({
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
}));

// this is defined outside the `empty` function because it doesn't need to be created more than once
/**
 * Used to associate types with their respective empty values in the `empty(Type)` function below
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
 * Gets a default (empty) value for the provided constructor
 */
export const empty = <T>(Type: Constructor<T>): T => emptyMap.get(Type);

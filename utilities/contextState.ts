/**
 * @file - Utilities to wrap useContext in order to work like useState.
 */
import { useState, createContext, useContext, useEffect, Context } from 'react';
import { NOOP } from './constants';

type State<T> = {
  value: T,
  setValue: (newValue: unknown) => void,
}

type ContextState<T> = Context<State<T>>

/**
 * This will create and return a Context object which can be used with `useContextState`.
 */
export const createContextState = <T>(initialState: T = null): ContextState<T> => {

  // pass the value to a nested part of the actual context,
  // so the setter can be safely abstracted away.
  return createContext({
    value: initialState,
    setValue: NOOP,
  });
};

/**
 * This function operates similarly to `useState`, except it expects the context as an
 * argument.  The initial state is determined by `createContextState` instead.
 */
export const useContextState = <T>(Context: ContextState<T>): [T, Function] => {

  // handle wrong type passed in
  if (typeof Context !== 'object') throw new TypeError(`Expected type "object" but got "${typeof Context}"`);

  // wrap the context with `useState`
  const context = useContext(Context);
  const [state, setState] = useState(context.value);

  // when local state updates, sync the entire context with it
  useEffect(() => { context.setValue(state) }, [state])

  // return an array of [state, setState] just like `useState` would
  return [context.value, setState]
};

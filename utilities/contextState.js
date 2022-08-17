/**
 * @file - Utilities to wrap useContext in order to work like useState.
 */
import React, { useState, createContext, useContext, useEffect } from 'react'
import { NOOP } from './constants'

/**
 * @template T
 * @typedef {<T>React.Context<{value: T, setValue: () => void}>} ContextState
 */

/**
 * This will create and return a Context object which can be used with `useContextState`.
 * @template T
 * @param {T} initialState - This is the value used to initialize the context.
 * @returns {ContextState<T>} - A special React Context object with a value/setter pair.
 */
export const createContextState = (initialState = null) => {

  // pass the value to a nested part of the actual context,
  // so the setter can be safely abstracted away.
  return createContext({
    value: initialState,
    setValue: NOOP,
  })
}

/**
 * This function operates similarly to `useState`, except it expects the context as an
 * argument.  The initial state is determined by `createContextState` instead.
 * @template T
 * @param {ContextState<T>} Context - A React Context object created by `createContextState`.
 * @returns {[T, Function]} - The state and setter as an array, just like `useState`.
 */
export const useContextState = Context => {

  // handle wrong type passed in
  if (typeof Context !== 'object') throw new TypeError(`Expected type "object" but got "${typeof Context}"`)

  // wrap the context with `useState`
  const context = useContext(Context)
  const [state, setState] = useState({
    value: context.value,
    setValue: newVal => setState({
      ...state,
      value: newVal,
    }),
  })

  // update the entire context
  useEffect(() => { context.setValue(state.value) }, [state.value])

  // return an array of [state, setState] just like `useState` would
  return [state.value, state.setValue]
}

/**
 * A higher-order component used to pass the context state to its children without
 * cluttering the template with a Provider.
 * @param {React.ReactElement} Component - The React Component to be wrapped by a context provider.
 * @param {...React.Context<unknown>} Contexts - All React Contexts with which to wrap the given component.
 * @returns {React.ReactElement} - The final wrapped React Component.
 */
export const withContextState = (Component, ...Contexts) => {
  const ContextComponent = ({ children, ...props }) => {
    const Context = Contexts[0]
    const { value: initialValue } = useContext(Context)
    const [state, setState] = useState(initialValue)

    const WrappedComponent = ({ children, ...props }) => (
      <Context.Provider value={{ value: state, setValue: setState }}>
        <Component {...props}>{children}</Component>
      </Context.Provider>
    )

    if (Contexts.length > 1) {
      const NestedContexts = Contexts.slice(1)
      const NestedComponent = withContextState(WrappedComponent, ...NestedContexts)
      return <NestedComponent {...props}>{children}</NestedComponent>
    }

    return <WrappedComponent {...props}>{children}</WrappedComponent>
  }

  return ContextComponent
}

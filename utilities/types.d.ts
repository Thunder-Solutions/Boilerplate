import { Dispatch, ReactNode, SetStateAction } from 'react';

export type GenericObj = { [key: PropertyKey]: unknown };
export type GenericFn = (...args: unknown[]) => unknown;
export type ValueOf<T> = T[keyof T];
export type ReactState<T> = [T, Dispatch<SetStateAction<T>>];

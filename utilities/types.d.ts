import { DetailedHTMLProps, Dispatch, HTMLAttributes, ReactNode, SetStateAction } from 'react';

export type GenericObj = { [key: PropertyKey]: unknown };
export type GenericFn = (...args: unknown[]) => unknown;
export type ValueOf<T> = T[keyof T];
export type ReactState<T> = [T, Dispatch<SetStateAction<T>>];

// DEFAULT TAG PROPS
export type DivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
export type HeadingProps = DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
export type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
export type FormProps = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;

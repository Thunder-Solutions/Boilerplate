import { AnchorHTMLAttributes, DetailedHTMLProps, Dispatch, HTMLAttributes, ReactNode, SetStateAction } from 'react';

export type GenericObj<T = unknown> = { [key: PropertyKey]: T };
export type GenericFn<T = unknown, A = unknown> = (...args: T[]) => A;
export type ValueOf<T> = T[keyof T];
export type ReactState<T> = [T, Dispatch<SetStateAction<T>>];

export interface Constructor<T> {
  new (): T;
  prototype: T;
}

// DEFAULT TAG PROPS
export type GenericTagProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
export type DivTagProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
export type SpanTagProps = DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
export type HeadingTagProps = DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
export type ButtonTagProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
export type FormTagProps = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
export type InputTagProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
export type FieldsetTagProps = DetailedHTMLProps<FieldsetHTMLAttributes<HTMLFieldSetElement>, HTMLFieldSetElement>;
export type LabelTagProps = DetailedHTMLProps<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
export type SelectTagProps = DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
export type TextareaTagProps = DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
export type AnchorTagProps = DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
export type DialogTagProps = DetailedHTMLProps<DialogHTMLAttributes<HTMLDialogElement>, HTMLDialogElement>;

import Dialog, { DialogComponentProps } from 'cmsComponents/dialog/dialog';
import Checkbox from 'cmsComponents/form/checkbox/checkbox';
import Form from 'cmsComponents/form/form';
import Input from 'cmsComponents/form/input/input';
import { useState } from 'react';
import { bool, getPropTypeInfo, NOOP, pascalToSpaces, PropTuple, GenericObj, ReactState } from 'utilities';

export type ComponentDialogProps = {
  cmsProps: PropTuple[],
  propState: ReactState<GenericObj>,
  onUpdateProps: (prop: string, value: string | number | boolean) => void,
} & DialogComponentProps;

const ComponentDialog = ({
  children,
  cmsProps = [],
  propState = useState({}),
  onUpdateProps = NOOP,
  ...props
}: ComponentDialogProps) => {

  return (
    <Dialog {...props}>
      {children}
      <Form>
        {cmsProps.map(([prop, propType], idx) => {
          const { required, type } = getPropTypeInfo(propType);
          const value = propState[prop];
          const updateHandlers = {
            str: (event: Event) => { onUpdateProps(prop, (event.target as HTMLInputElement).value); },
            num: (event: Event) => { onUpdateProps(prop, +(event.target as HTMLInputElement).value); },
            bool: (event: Event) => { onUpdateProps(prop, (event.target as HTMLInputElement).checked); },
          };

          const sharedInputProps = { label: pascalToSpaces(prop), value, required };
          const inputMap = {
            String: {
              InputComponent: Input,
              inputProps: { onInput: updateHandlers.str },
            },
            Number: {
              InputComponent: Input,
              inputProps: { onInput: updateHandlers.num, type: 'number' },
            },
            Boolean: {
              InputComponent: Checkbox,
              inputProps: { onChange: updateHandlers.bool, type: 'checkbox', checked: bool(value) },
            },
          };
          const { InputComponent, inputProps } = inputMap[type?.name] ?? {};

          // if a component exists to handle this type,
          // add a field for it, otherwise skip it.
          return InputComponent
            ? <InputComponent
                {...sharedInputProps}
                {...inputProps}
                autoFocus={idx === 0}
                key={prop}
              />
            : <></>;
        })}
      </Form>
    </Dialog>
  );
};

export default ComponentDialog;

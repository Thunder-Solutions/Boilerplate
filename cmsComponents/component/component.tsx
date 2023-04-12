import ComponentDialog from 'cmsComponents/componentDialog/componentDialog';
import Button from 'cmsComponents/form/button/button';
import Icon from 'cmsComponents/icon/icon';
import { useState } from 'react';
import { CMSComponent, Component, getDefaultProps, NOOP, pascalToSpaces, PropTuple, DivTagProps } from 'utilities';
import css from './component.module.css';

export type ComponentProps = {
  Component: Component,
  className?: string,
  onAdd?: (component?: CMSComponent) => void,
} & DivTagProps;

const Component = ({
  children,
  className = '',
  onAdd = NOOP,
  Component,
  ...props
}: ComponentProps) => {

  const componentClass = `${className} ${css.component}`;
  const cmsProps: PropTuple[] = Object.entries(Component.propTypes ?? {});
  const defaultPropState = getDefaultProps(Component);
  const [propState, setPropState] = useState(defaultPropState);
  const editDialogOpenState = useState(false);
  const setEditDialogOpen = editDialogOpenState[1];
  const openEditDialog = () => { setEditDialogOpen(true); };
  const updatePropState = (prop, value) => {
    setPropState({
      ...propState,
      [prop]: value,
    });
  };

  const menuHandlers = {
    cut: () => { console.log('clicked cut'); },
    copy: () => { console.log('clicked copy'); },
    paste: () => { console.log('clicked paste'); },
    add: onAdd,
    edit: openEditDialog,
    remove: () => { console.log('clicked remove'); },
  };

  const tryRenderComponent = (Component, propState) => {
    try {
      return <Component {...propState} />;
    } catch (err) {
      return <>Could not render component: {err}</>;
    }
  };

  return (
    <div {...props} className={componentClass}>
      <menu className={css.menu}>
        <Button onClick={menuHandlers.cut}>Cut <Icon type="Cut" /></Button>
        <Button onClick={menuHandlers.copy}>Copy <Icon type="Copy" /></Button>
        <Button onClick={menuHandlers.paste} disabled>Paste <Icon type="Paste" /></Button>
        <Button onClick={menuHandlers.add}>Add <Icon type="Add" /></Button>
        <Button onClick={menuHandlers.edit}>Edit <Icon type="Edit" /></Button>
        <Button onClick={menuHandlers.remove}>Remove <Icon type="Delete" /></Button>
      </menu>
      {tryRenderComponent(Component, propState)}
      <ComponentDialog
        openState={editDialogOpenState}
        title={`Edit ${pascalToSpaces(Component.name)}`}
        cmsProps={cmsProps}
        propState={[propState, setPropState]}
        onUpdateProps={updatePropState}
      />
      {children}
    </div>
  );
};

export default Component;

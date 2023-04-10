import Component from 'cmsComponents/component/component';
import Dialog from 'cmsComponents/dialog/dialog';
import Button from 'cmsComponents/form/button/button';
import Form from 'cmsComponents/form/form';
import Select from 'cmsComponents/form/select/select';
import Icon from 'cmsComponents/icon/icon';
import { useState } from 'react';
import { CMSComponent, createComponent, NOOP, pureSplice } from 'utilities';
import * as allComponents from 'components';
import { ReactState } from 'utilities/types';

type ComponentChildrenProps = {
  componentState?: ReactState<CMSComponent[]>,
  onAdd: (component?: CMSComponent) => void,
};

const ComponentChildren = ({ componentState, onAdd = NOOP, ...props }: ComponentChildrenProps) => {

  // components state
  const [components, setComponents] = componentState || useState<CMSComponent[]>([]);
  const [index, setIndex] = useState(components.length);
  const [fromComponent, setFromComponent] = useState(false);

  // dialog state
  const addDialogOpenState = useState(false);
  const setAddDialogOpen = addDialogOpenState[1];
  const openAddDialog = (index: number, fromComponent: boolean = false) => {
    setAddDialogOpen(true);
    setFromComponent(fromComponent);
    setIndex(index);
  };
  const closeAddDialog = () => { setAddDialogOpen(false); };

  // add a component
  const handleAdd = (formData: FormData) => {
    const componentName = formData.get('Component') as string;
    const Component = allComponents[componentName];
    console.log([...formData.entries()]);
    const addBelow = formData.get('add') === 'below';
    const noComponents = components.length === 0;
    const _index = noComponents ? 0 : (addBelow ? index + 1 : index);
    const newComponent = createComponent(Component, _index);
    const newComponents = pureSplice(components, _index, 0, newComponent);
    setComponents(newComponents);
    onAdd(newComponent);
    closeAddDialog();
    return 'Successfully added component.';
  };

  return (
    <div {...props}>
      {components.map((c, index) => (
        <Component Component={c.Component} key={c.id} onAdd={() => openAddDialog(index, true)} />
      ))}
      <Button onClick={() => openAddDialog(components.length)}>Add Component <Icon type="Add" /></Button>
      <Dialog openState={addDialogOpenState} title="Add a New Component">
        <Form onSubmit={handleAdd}>
          <Select label="Choose a Component" name="Component" required>
            {Object.keys(allComponents).map(name => (
              <option value={name} key={name}>{name}</option>
            ))}
          </Select>
          {fromComponent
            ? <>
                <Button name="add" value="above">Add Above</Button>
                <Button name="add" value="below">Add Below</Button>
              </>
            : <Button name="add" value="end">Add Component</Button>
          }
        </Form>
      </Dialog>
    </div>
  );
};

export default ComponentChildren;

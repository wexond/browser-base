import * as React from 'react';
import { observer } from 'mobx-react';

import store from '~/renderer/views/app/store';
import { Dropdown } from '~/renderer/components/Dropdown';
import { Input } from '~/renderer/components/Input';
import { StyledDialog, Title, Row, Label, Buttons } from './styles';
import { Button } from '~/renderer/components/Button';
import { colors } from '~/renderer/constants';

const onMouseDown = (e: React.MouseEvent) => {
  e.stopPropagation();
};

export default observer(() => {
  return (
    <StyledDialog visible={store.addBookmark.visible} onMouseDown={onMouseDown}>
      <Title>Add bookmark</Title>
      <Row>
        <Label>Name</Label>
        <Input className="textfield" />
      </Row>
      <Row>
        <Label>Folder</Label>
        <Dropdown defaultValue="First">
          <Dropdown.Item>First</Dropdown.Item>
          <Dropdown.Item>Second</Dropdown.Item>
          <Dropdown.Item>Third</Dropdown.Item>
        </Dropdown>
      </Row>
      <Buttons>
        <Button>DONE</Button>
        <Button type="outlined" foreground={colors.blue['500']}>
          REMOVE
        </Button>
      </Buttons>
    </StyledDialog>
  );
});

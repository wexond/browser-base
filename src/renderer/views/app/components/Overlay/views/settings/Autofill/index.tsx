import * as React from 'react';
import { observer } from 'mobx-react-lite';

import store from '~/renderer/views/app/store';
import { ContextMenu, ContextMenuItem } from '~/renderer/components/ContextMenu';
import { icons } from '~/renderer/constants';
import { Passwords } from './Passwords';
import { Addresses } from './Addresses';
import { Content } from '../../../style';
import { Header } from '../style';

const onEditClick = () => {
  
}

const onRemoveClick = () => {
  const item = store.autoFill.selectedItem;
  store.autoFill.removeItem(item);
}

const Menu = observer(() => {
  const item = store.autoFill.selectedItem;

  const style = {
    top: store.autoFill.menuTop,
    left: store.autoFill.menuLeft - 130,
  }

  return (
    <ContextMenu style={style} visible={store.autoFill.menuVisible}>
      {item.type === 'address' && <ContextMenuItem
        icon={icons.edit}
        onClick={onEditClick}
      >
        Edit
      </ContextMenuItem>}
      <ContextMenuItem
        icon={icons.trash}
        onClick={onRemoveClick}
      >
        Remove
      </ContextMenuItem>
    </ContextMenu>
  );
});

export const Autofill = () => {
  return (
    <Content>
      <Header style={{ paddingBottom: 12 }}>Autofill</Header>
      <Passwords />
      <Addresses />
      <Menu />
    </Content>
  );
};

import { observer } from 'mobx-react';
import * as React from 'react';

import { StyledTabGroup, Content, Icons, Icon } from './style';
import { icons } from '../../constants';
import { TabGroup } from '../../models';
import store from '../../store';

const onClick = (id: number) => () => {
  store.tabGroupsStore.currentGroupId = id;
};

const onCloseClick = (id: number) => (e: any) => {
  e.stopPropagation();
  store.tabGroupsStore.removeGroup(id);
};

export default observer(({ data }: { data: TabGroup }) => {
  const { name, color, id } = data;

  return (
    <StyledTabGroup
      style={{
        backgroundColor: color,
      }}
      selected={store.tabGroupsStore.currentGroupId === id}
      onClick={onClick(id)}
    >
      <Content>{name}</Content>
      <Icons>
        <Icon style={{ backgroundImage: `url(${icons.edit})` }} />
        <Icon
          onClick={onCloseClick(id)}
          style={{ backgroundImage: `url(${icons.close})` }}
        />
      </Icons>
    </StyledTabGroup>
  );
});

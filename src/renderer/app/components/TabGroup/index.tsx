import { observer } from 'mobx-react';
import * as React from 'react';

import { StyledTabGroup, Content, Icons, Icon } from './style';
import { icons } from '../../constants';
import { TabGroup } from '../../models';
import store from '../../store';

const onClick = (id: number) => () => {
  store.tabGroupsStore.currentGroupId = id;
};

export default observer(({ data }: { data: TabGroup }) => {
  const { name, color } = data;

  return (
    <StyledTabGroup
      style={{
        backgroundColor: color,
      }}
      selected={store.tabGroupsStore.currentGroupId === data.id}
      onClick={onClick(data.id)}
    >
      <Content>{name}</Content>
      <Icons>
        <Icon style={{ backgroundImage: `url(${icons.edit})` }} />
        <Icon style={{ backgroundImage: `url(${icons.close})` }} />
      </Icons>
    </StyledTabGroup>
  );
});

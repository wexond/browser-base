import * as React from 'react';
import { observer } from 'mobx-react';

import { StyledTabGroups, AddTabGroup } from './style';
import TabGroup from '../TabGroup';
import store from '../../store';

const onAddClick = () => {
  store.tabGroupsStore.addGroup();
};

export const TabGroups = observer(() => {
  return (
    <StyledTabGroups>
      {store.tabGroupsStore.groups.map(item => (
        <TabGroup data={item} key={item.id} />
      ))}

      <AddTabGroup onClick={onAddClick} />
    </StyledTabGroups>
  );
});

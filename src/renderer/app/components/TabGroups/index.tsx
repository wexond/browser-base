import * as React from 'react';
import { observer } from 'mobx-react';

import { StyledTabGroups, AddTabGroup } from './style';
import TabGroup from '../TabGroup';
import store from '../../store';

const onAddClick = () => {
  store.tabGroups.addGroup();
};

export const TabGroups = observer(() => {
  return (
    <StyledTabGroups>
      {store.tabGroups.list.map(item => (
        <TabGroup data={item} key={item.id} />
      ))}

      <AddTabGroup onClick={onAddClick} />
    </StyledTabGroups>
  );
});

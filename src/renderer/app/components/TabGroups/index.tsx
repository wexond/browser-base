import * as React from 'react';
import { observer } from 'mobx-react';

import { StyledTabGroups, AddTabGroup } from './style';
import TabGroup from '../TabGroup';
import store from '../../store';
import { Section } from '../Overlay/style';
import { Header, preventHiding } from '../Overlay';

const onAddClick = () => {
  store.tabGroups.addGroup();
};

export const TabGroups = observer(() => {
  return (
    <Section onClick={preventHiding}>
      <Header>Tab groups</Header>
      <StyledTabGroups>
        {store.tabGroups.list.map(item => (
          <TabGroup data={item} key={item.id} />
        ))}

        <AddTabGroup onClick={onAddClick} />
      </StyledTabGroups>
    </Section>
  );
});

import * as React from 'react';
import { observer } from 'mobx-react';

import { StyledTabGroups, AddTabGroup } from './style';
import store from '~/renderer/views/app/store';
import { Section } from '../../../style';
import { preventHiding, Header } from '../../..';
import { TabGroup } from '../TabGroup';

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

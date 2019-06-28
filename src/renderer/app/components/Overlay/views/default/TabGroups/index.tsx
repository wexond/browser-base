import * as React from '~/renderer/app/components/Overlay/views/default/TabGroups/node_modules/react';
import { observer } from '~/renderer/app/components/Overlay/views/default/TabGroups/node_modules/mobx-react';

import { StyledTabGroups, AddTabGroup } from './style';
import TabGroup from '../default/TabGroup';
import store from '../../../app/store';
import { Section } from '../../../app/components/Overlay/style';
import { Header, preventHiding } from '../../../app/components/Overlay';

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

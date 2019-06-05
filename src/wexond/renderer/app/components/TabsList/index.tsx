import * as React from 'react';
import { observer } from 'mobx-react';

import { StyledTabGroups } from './style';
import { Tab as TabModel } from '~/renderer/app/models';
import Tab from '../Tab';
import store from '../../store';
import { Section } from '../Overlay/style';
import { Header, preventHiding } from '../Overlay';
import { onTabClick } from '~/renderer/app/utils/dials';
import { Bubble } from '~/renderer/app/components/Bubble';

const onClick = (tab: TabModel) => (e: React.MouseEvent<HTMLDivElement>) => {
  store.overlay.visible = false
  tab.select();
}
const removeTab = (tab: TabModel) => (e: React.MouseEvent<HTMLDivElement>) => {
  tab.close();
  store.overlay.visible = true
}

export const TabsList = observer(() => {
  return (
    <Section onClick={preventHiding}>
      <Header>Open Tabs</Header>
      <StyledTabGroups>
        {store.tabs.list.map((item) => (
          <Bubble
            itemsPerRow={4}
            onClick={onClick(item)}
            onCloseClick={removeTab(item)}
            maxLines={1}
            iconSize={20}
            icon={store.favicons.favicons[item.favicon]}
          >{item.title}
          </Bubble>
        ))}
      </StyledTabGroups>
    </Section>
  );
});

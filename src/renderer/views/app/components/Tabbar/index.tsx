import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { AddTab, StyledTabbar, TabsContainer } from './style';
import { Tabs } from '../Tabs';
import store from '../../store';
import { ipcRenderer } from 'electron';
import { TabGroup } from '../TabGroup';
import { ICON_ADD } from '~/renderer/constants/icons';
import { AddressBarContainer } from '../AddressBarContainer';

let timeout: any;

const onMouseEnter = () => {
  clearTimeout(timeout);
};

const onTabsMouseLeave = () => {
  timeout = setTimeout(() => {
    store.tabs.removedTabs = 0;
    store.tabs.updateTabsBounds(true);
  }, 300);
};

const onAddTabClick = () => {
  store.tabs.addTab();
};

const onWheel = (e: any) => {
  if (!store.tabs.containerRef) return;

  const { deltaX, deltaY } = e;
  const { scrollLeft } = store.tabs.containerRef.current;

  const delta = Math.abs(deltaX) >= Math.abs(deltaY) ? deltaX : -deltaY;
  const target = delta / 2;

  store.tabs.scrollingToEnd = false;

  store.tabs.containerRef.current.scrollLeft = scrollLeft + target;
};

export const TabGroups = observer(() => {
  return (
    <React.Fragment>
      {store.tabGroups.list.map((item) => (
        <TabGroup key={item.id} tabGroup={item}></TabGroup>
      ))}
    </React.Fragment>
  );
});

export const Tabbar = observer(() => {
  return (
    <StyledTabbar>
      <TabsContainer
        onMouseEnter={onMouseEnter}
        onMouseLeave={onTabsMouseLeave}
        onWheel={onWheel}
        ref={store.tabs.containerRef}
      >
        <TabGroups />
        <Tabs />
      </TabsContainer>
      <AddTab
        icon={ICON_ADD}
        onClick={onAddTabClick}
        divRef={(r: any) => (store.addTab.ref = r)}
      />
      {store.isCompact && <AddressBarContainer />}
    </StyledTabbar>
  );
});

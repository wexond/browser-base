import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { AddTab, StyledTabbar, TabsContainer } from './style';
import { Tabs } from '../Tabs';
import store from '../../../store';
import { icons } from '~/renderer/constants';
import HorizontalScrollbar from '~/renderer/components/HorizontalScrollbar';
import { ipcRenderer } from 'electron';

const getContainer = () => store.tabs.containerRef.current;

let timeout: any;

const onMouseEnter = () => {
  store.tabs.scrollbarVisible = true;
  clearTimeout(timeout);
};

const onTabsMouseLeave = (e: React.MouseEvent) => {
  store.tabs.scrollbarVisible = false;
  timeout = setTimeout(() => {
    store.tabs.removedTabs = 0;
    store.tabs.updateTabsBounds(true);
  }, 300);
  ipcRenderer.send(`hide-tab-preview-${store.windowId}`);
  store.tabs.canShowPreview = true;
};

const onAddTabClick = () => {
  store.tabs.onNewTab();
};

export const Tabbar = observer(() => {
  return (
    <StyledTabbar>
      <TabsContainer
        onMouseEnter={onMouseEnter}
        onMouseLeave={onTabsMouseLeave}
        ref={store.tabs.containerRef}
      >
        <Tabs />
      </TabsContainer>
      <AddTab
        icon={icons.add}
        onClick={onAddTabClick}
        divRef={(r: any) => (store.addTab.ref = r)}
      />
      <HorizontalScrollbar
        ref={store.tabs.scrollbarRef}
        enabled={store.tabs.scrollable}
        visible={store.tabs.scrollbarVisible}
        getContainer={getContainer}
      />
    </StyledTabbar>
  );
});

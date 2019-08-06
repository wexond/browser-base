import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { AddTab, StyledTabbar, TabsContainer, Handle } from './style';
import { Tabs } from '../Tabs';
import store from '../../../store';
import { icons } from '~/renderer/constants';
import { WindowsControls } from 'react-windows-controls';
import { platform } from 'os';
import { TABBAR_HEIGHT } from '../../../constants';
import { closeWindow, minimizeWindow, maximizeWindow } from '../../../utils';
import HorizontalScrollbar from '~/renderer/components/HorizontalScrollbar';

const getContainer = () => store.tabs.containerRef.current;

const onMouseEnter = () => (store.tabs.scrollbarVisible = true);

const onMouseLeave = () => (store.tabs.scrollbarVisible = false);

const onAddTabClick = () => {
  store.tabs.onNewTab();
};

export const Tabbar = observer(() => {
  return (
    <StyledTabbar>
      <Handle />
      <TabsContainer
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
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

      {platform() !== 'darwin' && (
        <WindowsControls
          style={{
            zIndex: 9999,
            height: TABBAR_HEIGHT,
            WebkitAppRegion: 'no-drag',
          }}
          dark={store.theme['toolbar.icons.invert']}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
        />
      )}
    </StyledTabbar>
  );
});

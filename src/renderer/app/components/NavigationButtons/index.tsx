import { observer } from 'mobx-react';
import * as React from 'react';

import store from '~/renderer/app/store';
import ToolbarButton from '~/renderer/app/components/ToolbarButton';
import { icons } from '~/renderer/app/constants/icons';
import { StyledContainer } from './style';

const onBackClick = () => {
  store.tabs.selectedTab.callViewMethod('webContents.goBack');
};

const onForwardClick = () => {
  store.tabs.selectedTab.callViewMethod('webContents.goForward');
};

const onRefreshClick = () => {
  if (store.tabs.selectedTab && store.tabs.selectedTab.loading) {
    store.tabs.selectedTab.callViewMethod('webContents.stop');
  } else {
    store.tabs.selectedTab.callViewMethod('webContents.reload');
  }
};

export const NavigationButtons = observer(() => {
  const { selectedTab } = store.tabs;

  let isWindow = false;
  let loading = false;

  if (selectedTab) {
    isWindow = selectedTab.isWindow;
    loading = selectedTab.loading;
  }

  const visible =
    store.tabGroups.currentGroup.tabs.length === 0 ||
    store.overlay.currentContent !== 'default';

  return (
    <StyledContainer
      style={{
        opacity: visible ? 0 : 1,
        pointerEvents: visible ? 'none' : 'auto',
      }}
      isFullscreen={store.isFullscreen}
    >
      <ToolbarButton
        disabled={!store.navigationState.canGoBack || store.overlay.visible}
        size={24}
        icon={icons.back}
        style={{ marginLeft: 8 }}
        onClick={onBackClick}
      />
      <ToolbarButton
        disabled={!store.navigationState.canGoForward || store.overlay.visible}
        size={24}
        icon={icons.forward}
        onClick={onForwardClick}
      />
      <ToolbarButton
        disabled={isWindow || store.overlay.visible}
        size={20}
        icon={loading ? icons.close : icons.refresh}
        onClick={onRefreshClick}
      />
    </StyledContainer>
  );
});

import { observer } from 'mobx-react';
import * as React from 'react';
import { ipcRenderer } from 'electron';

import store from '~/renderer/app/store';
import ToolbarButton from '~/renderer/app/components/ToolbarButton';
import { icons } from '~/renderer/app/constants/icons';
import { TOOLBAR_ICON_HEIGHT } from '~/renderer/app/constants/design';
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

const onHomePress = () => {
  ipcRenderer.send('open-flowr')
}

export const NavigationButtons = observer(() => {
  const { selectedTab } = store.tabs;

  let isWindow = false;
  let loading = false;

  if (selectedTab) {
    isWindow = selectedTab.isWindow;
    loading = selectedTab.loading;
  }

  return (
    <StyledContainer isFullscreen={store.isFullscreen}>
      <ToolbarButton
        disabled={false}
        size={TOOLBAR_ICON_HEIGHT}
        icon={icons.window}
        onClick={onHomePress}
      />
      <ToolbarButton
        disabled={!store.navigationState.canGoBack}
        size={TOOLBAR_ICON_HEIGHT}
        icon={icons.back}
        style={{ marginLeft: 8 }}
        onClick={onBackClick}
      />
      <ToolbarButton
        disabled={!store.navigationState.canGoForward}
        size={TOOLBAR_ICON_HEIGHT}
        icon={icons.forward}
        onClick={onForwardClick}
      />
      <ToolbarButton
        disabled={isWindow}
        size={TOOLBAR_ICON_HEIGHT}
        icon={loading ? icons.close : icons.refresh}
        onClick={onRefreshClick}
      />
    </StyledContainer>
  );
});

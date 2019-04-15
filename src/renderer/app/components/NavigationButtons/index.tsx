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
  return (
    <StyledContainer isFullscreen={store.isFullscreen}>
      <ToolbarButton
        disabled={!store.navigationState.canGoBack}
        size={24}
        icon={icons.back}
        style={{ marginLeft: 8 }}
        onClick={onBackClick}
      />
      <ToolbarButton
        disabled={!store.navigationState.canGoForward}
        size={24}
        icon={icons.forward}
        onClick={onForwardClick}
      />
      <ToolbarButton
        size={20}
        icon={
          store.tabs.selectedTab && store.tabs.selectedTab.loading
            ? icons.close
            : icons.refresh
        }
        onClick={onRefreshClick}
      />
    </StyledContainer>
  );
});

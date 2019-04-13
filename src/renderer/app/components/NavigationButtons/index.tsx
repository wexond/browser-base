import { observer } from 'mobx-react';
import * as React from 'react';

import store from '~/renderer/app/store';
import ToolbarButton from '~/renderer/app/components/ToolbarButton';
import { icons } from '~/renderer/app/constants/icons';
import { StyledContainer } from './style';
import { callBrowserViewMethod } from '~/shared/utils/browser-view';

const onBackClick = () => {
  callBrowserViewMethod('webContents.goBack');
};

const onForwardClick = () => {
  callBrowserViewMethod('webContents.goForward');
};

const onRefreshClick = () => {
  if (store.tabs.selectedTab && store.tabs.selectedTab.loading) {
    callBrowserViewMethod('webContents.stop');
  } else {
    callBrowserViewMethod('webContents.reload');
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

import { observer } from 'mobx-react';
import * as React from 'react';

import store from '~/renderer/app/store';
import ToolbarButton from '~/renderer/app/components/ToolbarButton';
import { icons } from '~/renderer/app/constants/icons';
import { StyledContainer } from './style';
import { callBrowserViewMethod } from '~/shared/utils/browser-view';

const onBackClick = () => {
  callBrowserViewMethod(store.tabsStore.selectedTabId, 'goBack');
};

const onForwardClick = () => {
  callBrowserViewMethod(store.tabsStore.selectedTabId, 'goForward');
};

const onRefreshClick = () => {
  if (store.tabsStore.selectedTab && store.tabsStore.selectedTab.loading) {
    callBrowserViewMethod(store.tabsStore.selectedTabId, 'stop');
  } else {
    callBrowserViewMethod(store.tabsStore.selectedTabId, 'reload');
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
          store.tabsStore.selectedTab && store.tabsStore.selectedTab.loading
            ? icons.close
            : icons.refresh
        }
        onClick={onRefreshClick}
      />
    </StyledContainer>
  );
});

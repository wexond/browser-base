import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { StyledContainer } from './style';
import store from '../../store';
import { ToolbarButton } from '../ToolbarButton';
import {
  ICON_CLOSE,
  ICON_FORWARD,
  ICON_BACK,
  ICON_REFRESH,
} from '~/renderer/constants/icons';

const onBackClick = () => {
  browser.tabs.goBack(store.tabs.selectedTabId);
};

const onForwardClick = () => {
  browser.tabs.goForward(store.tabs.selectedTabId);
};

const onRefreshClick = () => {
  if (store.tabs.selectedTab && store.tabs.selectedTab.loading) {
    browser.tabs.stop(store.tabs.selectedTabId);
  } else {
    browser.tabs.reload(store.tabs.selectedTabId);
  }
};

export const NavigationButtons = observer(() => {
  const { selectedTab } = store.tabs;

  let loading = false;

  if (selectedTab) {
    loading = selectedTab.loading;
  }

  return (
    <StyledContainer>
      <ToolbarButton
        disabled={!store.navigationState.canGoBack}
        size={20}
        icon={ICON_BACK}
        style={{ marginLeft: 6 }}
        onClick={onBackClick}
      />
      <ToolbarButton
        disabled={!store.navigationState.canGoForward}
        size={20}
        icon={ICON_FORWARD}
        onClick={onForwardClick}
      />
      <ToolbarButton
        size={20}
        icon={loading ? ICON_CLOSE : ICON_REFRESH}
        onClick={onRefreshClick}
      />
    </StyledContainer>
  );
});

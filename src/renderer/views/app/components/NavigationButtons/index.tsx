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
  store.tabs.selectedTab.callViewMethod('goBack');
};

const onForwardClick = () => {
  store.tabs.selectedTab.callViewMethod('goForward');
};

const onRefreshClick = () => {
  if (store.tabs.selectedTab && store.tabs.selectedTab.loading) {
    store.tabs.selectedTab.callViewMethod('stop');
  } else {
    store.tabs.selectedTab.callViewMethod('reload');
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

import { observer } from 'mobx-react';
import * as React from 'react';

import store from '~/renderer/app/store';
import ToolbarButton from '~/renderer/app/components/ToolbarButton';
import { icons } from '~/renderer/app/constants/icons';
import { StyledContainer } from './style';
import { ipcRenderer } from 'electron';

const sendNavigationAction = (action: 'back' | 'forward' | 'refresh') => {
  ipcRenderer.send('browserview-navigation-action', {
    id: store.tabsStore.selectedTabId,
    action,
  });
};

const onBackClick = () => {
  sendNavigationAction('back');
};

const onForwardClick = () => {
  sendNavigationAction('forward');
};

const onRefreshClick = () => {
  sendNavigationAction('refresh');
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
      <ToolbarButton size={20} icon={icons.refresh} onClick={onRefreshClick} />
    </StyledContainer>
  );
});

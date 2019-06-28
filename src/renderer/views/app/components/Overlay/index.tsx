import * as React from 'react';

import store from '../../store';
import { StyledOverlay, HeaderText, HeaderArrow } from './style';
import { observer } from 'mobx-react';
import { Default, History, Bookmarks, Settings } from './views';

export const Header = ({ children, clickable }: any) => {
  return (
    <HeaderText clickable={clickable}>
      {children}
      {clickable && <HeaderArrow />}
    </HeaderText>
  );
};

const onClick = () => {
  if (store.tabGroups.currentGroup.tabs.length > 0 && !store.overlay.isNewTab) {
    store.overlay.visible = false;
  }
  store.overlay.dialTypeMenuVisible = false;
};

export const preventHiding = (e: any) => {
  e.stopPropagation();
  store.overlay.dialTypeMenuVisible = false;
};

export const Overlay = observer(() => {
  return (
    <StyledOverlay visible={store.overlay.visible} onClick={onClick}>
      <Default />
      <History />
      <Bookmarks />
      <Settings />
    </StyledOverlay>
  );
});
